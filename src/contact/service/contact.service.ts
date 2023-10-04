import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Contact } from '@prisma/client';


@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async getAllContacts() {
    return this.prisma.contact.findMany();
  }

  async getContactById(id: number) {
    return this.prisma.contact.findUnique({
      where: { id },
    });
  }

  async createContact(data: Contact) {
    return this.prisma.contact.create({
      data,
    });
  }

  async deleteContact(id: number) {
    return this.prisma.contact.delete({
      where: { id },
    });
  }
}
