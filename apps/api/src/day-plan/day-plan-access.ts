import {
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { DayPlanShareAccess, Wedding } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { resolveWeddingForUser } from '../weddings/wedding-access';

export type DayPlanAccessLevel = 'edit' | 'view';

export type DayPlanAccess = {
  wedding: Wedding;
  level: DayPlanAccessLevel;
  via: 'member' | 'grant';
};

export async function resolveDayPlanAccess(
  prisma: PrismaService,
  userId: string,
): Promise<DayPlanAccess | null> {
  const member = await resolveWeddingForUser(prisma, userId);
  if (member) {
    return { wedding: member.wedding, level: 'edit', via: 'member' };
  }

  const grant = await prisma.dayPlanShareGrant.findFirst({
    where: {
      userId,
      acceptedAt: { not: null },
    },
    include: {
      share: { include: { wedding: true } },
    },
    orderBy: { acceptedAt: 'desc' },
  });

  if (!grant) return null;

  return {
    wedding: grant.share.wedding,
    level: grant.access === DayPlanShareAccess.EDIT ? 'edit' : 'view',
    via: 'grant',
  };
}

export async function requireDayPlanAccess(
  prisma: PrismaService,
  userId: string,
  min: DayPlanAccessLevel = 'view',
  message = 'Немає доступу до плану дня',
): Promise<DayPlanAccess> {
  const access = await resolveDayPlanAccess(prisma, userId);
  if (!access) throw new BadRequestException(message);
  if (min === 'edit' && access.level !== 'edit') {
    throw new ForbiddenException('Недостатньо прав для редагування плану дня');
  }
  return access;
}

export async function requireDayPlanEditByShareToken(
  prisma: PrismaService,
  userId: string,
  token: string,
): Promise<{ wedding: Wedding }> {
  const share = await prisma.dayPlanShare.findUnique({
    where: { token },
    include: { wedding: true },
  });
  if (!share) throw new BadRequestException('Посилання недійсне');

  const member = await resolveWeddingForUser(prisma, userId);
  if (member && member.wedding.id === share.weddingId) {
    return { wedding: share.wedding };
  }

  const grant = await prisma.dayPlanShareGrant.findFirst({
    where: {
      shareId: share.id,
      userId,
      acceptedAt: { not: null },
      access: DayPlanShareAccess.EDIT,
    },
  });
  if (!grant) {
    throw new ForbiddenException('Недостатньо прав для редагування плану дня');
  }

  return { wedding: share.wedding };
}
