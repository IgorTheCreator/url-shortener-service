import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { LongUrlDto, RedirectParamDto } from './dto';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class UrlService {
  private readonly logger = new Logger(UrlService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly utils: UtilsService,
  ) {}

  async createShortUrl({ long, expires }: LongUrlDto) {
    try {
      const url = await this.prisma.uRL.findFirst({
        where: {
          long,
        },
      });
      if (url) {
        return {
          long: url.long,
          created_at: url.createdAt,
          expires_at: url.expiresAt,
          short_url: url.short,
        };
      }
      let expiresAt = '';
      if (expires) {
        expiresAt = expires;
      } else {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 5);
        expiresAt = date.toISOString();
      }

      const hash = this.utils.sha256(long).slice(0, 10);

      const short = await this.prisma.uRL.create({
        data: {
          long,
          expiresAt,
          short: hash,
        },
      });

      return {
        long: short.long,
        created_at: short.createdAt,
        expires_at: short.expiresAt,
        short_url: short.short,
      };
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getLongUrl({ shortUrl }: RedirectParamDto) {
    try {
      const long = await this.redis.get(shortUrl);
      if (long) {
        await this.prisma.uRL.update({
          where: {
            short: shortUrl,
          },
          data: {
            lastVisited: new Date(),
            countVisits: {
              increment: 1,
            },
          },
        });
        return { long };
      }
      const url = await this.prisma.uRL.findUnique({
        where: {
          short: shortUrl,
          expiresAt: {
            gte: new Date(),
          },
        },
      });
      if (!url) {
        throw new NotFoundException('Url not found');
      }

      await this.prisma.uRL.update({
        where: {
          short: shortUrl,
        },
        data: {
          lastVisited: new Date(),
          countVisits: {
            increment: 1,
          },
        },
      });

      await this.redis.set(shortUrl, url.long);

      return { long: url.long };
    } catch (e) {
      this.logger.error(e);
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
