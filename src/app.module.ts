import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsModule } from './app/conversations/conversations.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './app/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.js, .ts}'],
      synchronize: true,
    }),
    ConversationsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [ChatGateway],
})
export class AppModule {}
