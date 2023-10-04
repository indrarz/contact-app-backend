import { Controller, Get, Post, Delete, Param, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ContactService } from '../service/contact.service';
import { Contact } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('api/v1/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get() // Endpoint untuk mendapatkan semua kontak
  async getAllContacts() {
    const contacts = await this.contactService.getAllContacts();
    return contacts;
  }

  @Get(':id') // Endpoint untuk mendapatkan kontak berdasarkan ID
  async getContactById(@Param('id') id: string) {
    const contact = await this.contactService.getContactById(Number(id));
    return contact;
  }

  @Post() // Endpoint untuk menambahkan kontak baru
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: '../../uploads', // Direktori tujuan penyimpanan
        filename: (req, file, cb) => {
          // Membuat nama file yang unik dengan ekstensi yang benar
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createContact(@Body() contactData: Contact, @UploadedFile() file) {
    try {
      if (file) {
        // Jika ada file yang diunggah, dapat menyimpan path ke database
        contactData.foto = file.path;
      }
      const createdContact = await this.contactService.createContact(contactData);
      return createdContact;
    } catch (error) {
      console.error(error);
    }
  }

  @Delete(':id') // Endpoint untuk menghapus kontak berdasarkan ID
  async deleteContact(@Param('id') id: string) {
    const deletedContact = await this.contactService.deleteContact(Number(id));
    return deletedContact;
  }
}
