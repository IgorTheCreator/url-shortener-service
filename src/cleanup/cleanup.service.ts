import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CleanupService {
  logger = new Logger(CleanupService.name);
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanDb() {
    try {
      await this.prisma.uRL.deleteMany({
        where: {
          expiresAt: {
            lte: new Date().toISOString(),
          },
        },
      });
    } catch (e) {
      this.logger.error(e);
    }
  }
}
