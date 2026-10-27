import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type TimeseriesGranularity = 'day' | 'week';

@Injectable()
export class AdminInsightsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTimeseries(granularity: string, periodsRaw?: number) {
    if (granularity !== 'day' && granularity !== 'week') {
      throw new BadRequestException('granularity має бути day або week');
    }
    const unit: TimeseriesGranularity = granularity;
    const max = unit === 'day' ? 365 : 104;
    const fallback = unit === 'day' ? 30 : 12;
    const periods = Math.min(max, Math.max(2, periodsRaw ?? fallback));
    const unitSql = Prisma.raw(`'${unit}'`);
    const stepSql = Prisma.raw(`INTERVAL '1 ${unit}'`);
    const backSql = Prisma.raw(`INTERVAL '${periods - 1} ${unit}'`);

    const rows = await this.prisma.$queryRaw<
      Array<{ bucket: Date; registrations: number; active: number }>
    >`
      SELECT
        gs::date AS bucket,
        (
          SELECT COUNT(*)::int FROM users u
          WHERE date_trunc(${unitSql}, u.created_at)::date = gs::date
        ) AS registrations,
        (
          SELECT COUNT(DISTINCT a.user_id)::int FROM user_activity_days a
          WHERE date_trunc(${unitSql}, a.day::timestamp)::date = gs::date
        ) AS active
      FROM generate_series(
        date_trunc(${unitSql}, NOW()) - ${backSql},
        date_trunc(${unitSql}, NOW()),
        ${stepSql}
      ) AS gs
      ORDER BY bucket
    `;

    return {
      granularity: unit,
      points: rows.map((r) => ({
        date: r.bucket.toISOString().slice(0, 10),
        registrations: r.registrations,
        active: r.active,
      })),
    };
  }

  async getCohorts(weeksRaw?: number) {
    const weeks = Math.min(26, Math.max(2, weeksRaw ?? 8));
    const backSql = Prisma.raw(`INTERVAL '${weeks - 1} week'`);

    const [sizes, retention] = await Promise.all([
      this.prisma.$queryRaw<Array<{ cohort: Date; size: number }>>`
        SELECT date_trunc('week', created_at)::date AS cohort, COUNT(*)::int AS size
        FROM users
        WHERE created_at >= date_trunc('week', NOW()) - ${backSql}
        GROUP BY 1
        ORDER BY 1
      `,
      this.prisma.$queryRaw<
        Array<{ cohort: Date; wk: number; retained: number }>
      >`
        SELECT
          c.cohort,
          ((date_trunc('week', a.day::timestamp)::date - c.cohort) / 7)::int AS wk,
          COUNT(DISTINCT a.user_id)::int AS retained
        FROM (
          SELECT id, date_trunc('week', created_at)::date AS cohort
          FROM users
          WHERE created_at >= date_trunc('week', NOW()) - ${backSql}
        ) c
        JOIN user_activity_days a ON a.user_id = c.id AND a.day >= c.cohort
        GROUP BY 1, 2
      `,
    ]);

    const retainedBy = new Map<string, number>();
    for (const r of retention) {
      retainedBy.set(`${r.cohort.toISOString().slice(0, 10)}:${r.wk}`, r.retained);
    }

    const thisWeek = await this.prisma.$queryRaw<Array<{ w: Date }>>`
      SELECT date_trunc('week', NOW())::date AS w
    `;
    const currentWeekMs = thisWeek[0].w.getTime();

    const cohorts = sizes.map((s) => {
      const key = s.cohort.toISOString().slice(0, 10);
      const elapsed = Math.round(
        (currentWeekMs - s.cohort.getTime()) / (7 * 24 * 3600 * 1000),
      );
      const retained: Array<number | null> = [];
      for (let w = 0; w < weeks; w += 1) {
        retained.push(w > elapsed ? null : (retainedBy.get(`${key}:${w}`) ?? 0));
      }
      return { cohort: key, size: s.size, retained };
    });

    return { weeks, cohorts };
  }
}
