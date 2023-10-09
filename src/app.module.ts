import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './contact/contact.module';
import { NestFactory } from '@nestjs/core';

@Module({
  imports: [ContactModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Mengaktifkan CORS
  app.enableCors({
    origin: 'https://contact-apps.up.railway.app/',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3001);
}

bootstrap();