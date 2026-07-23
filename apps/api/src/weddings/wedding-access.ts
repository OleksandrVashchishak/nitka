import {
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Wedding, WeddingMemberRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type WeddingAccess = {
  wedding: Wedding;
  role: WeddingMemberRole;
};

/** Весілля для юзера: через membership або owner (з lazy backfill OWNER). */
export async function resolveWeddingForUser(
  prisma: PrismaService,
  userId: string,
): Promise<WeddingAccess | null> {
  const member = await prisma.weddingMember.findUnique({
    where: { userId },
    include: { wedding: true },
  });
  if (member) {
    return { wedding: member.wedding, role: member.role };
  }

  const owned = await prisma.wedding.findUnique({ where: { userId } });
  if (!owned) return null;

  await prisma.weddingMember.upsert({
    where: { userId },
    create: {
      weddingId: owned.id,
      userId,
      role: WeddingMemberRole.OWNER,
    },
    update: {},
  });

  return { wedding: owned, role: WeddingMemberRole.OWNER };
}

export async function requireWeddingForUser(
  prisma: PrismaService,
  userId: string,
  message = 'Спочатку створи весілля в кабінеті (дата / місто)',
): Promise<WeddingAccess> {
  const access = await resolveWeddingForUser(prisma, userId);
  if (!access) throw new BadRequestException(message);
  return access;
}

export async function requireWeddingOwner(
  prisma: PrismaService,
  userId: string,
): Promise<WeddingAccess> {
  const access = await requireWeddingForUser(prisma, userId);
  if (access.role !== WeddingMemberRole.OWNER) {
    throw new ForbiddenException('Лише власник весілля може це зробити');
  }
  return access;
}
