import { Module } from '@nestjs/common';
import { ContactService } from './service/contact.service';
import { ContactController } from './controller/contact.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [ContactService, PrismaService],
  controllers: [ContactController]
})
export class ContactModule {}
