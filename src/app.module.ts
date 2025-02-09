import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { UrlModule } from './url/url.module';
import { UtilsModule } from './utils/utils.module';
import { CleanupModule } from './cleanup/cleanup.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UrlModule,
    UtilsModule,
    CleanupModule,
  ],
})
export class AppModule {}
