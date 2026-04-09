import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './products/products.module';
import { CategoryModule } from './categories/category.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './orders/order.module';
import { ReviewModule } from './Review/review.module';
import { MailModule } from './mail/mail.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import { dataSourceOptions } from 'db/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

   CacheModule.register({
  isGlobal: true,
  store: new Keyv({
    store: new KeyvRedis('redis://127.0.0.1:6379'),
  }),
  ttl: 60000,
}),

    TypeOrmModule.forRoot(dataSourceOptions),
   

    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),

    UsersModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    CartModule,
    OrderModule,
    ReviewModule,
    MailModule,
  ],

  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})

 
export class AppModule {}
