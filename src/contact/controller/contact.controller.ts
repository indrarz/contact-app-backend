import { Controller, Get, Post, Delete, Param, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ContactService } from '../service/contact.service';
import { Contact } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
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
      fileFilter: (req, file, cb) => {
        // Validasi tipe file (opsional)
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Hanya file gambar yang diizinkan!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async createContact(@Body() contactData: Contact, @UploadedFile() file) {
    try {
      if (file) {
        // Mengonversi file Base64 ke dalam string
        const base64Image = file.buffer.toString('base64');
        contactData.foto = `data:${file.mimetype};base64,${base64Image}`;
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
