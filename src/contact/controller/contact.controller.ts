import { Controller, Get, Post, Delete, Param, Body, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { ContactService } from '../service/contact.service';
import { Contact } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
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
  async getContactById(@Param('id') id: string, @Res() res: Response) {
    try {
      const contact = await this.contactService.getContactById(Number(id));

      if (!contact) {
        return res.status(404).json({ message: 'Kontak tidak ditemukan' });
      }

      if (contact.foto) {
        // Mendapatkan tipe konten dari data foto (contoh: image/jpeg)
        const contentType = contact.foto.split(';')[0].split(':')[1];

        // Mengirim respons dengan tipe konten yang benar
        res.setHeader('Content-Type', contentType);

        // Mengirim data foto Base64 sebagai buffer
        const base64Data = contact.foto.split(',')[1];
        const imageBuffer = Buffer.from(base64Data, 'base64');
        res.end(imageBuffer);
      } else {
        return res.status(404).json({ message: 'Foto tidak tersedia' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
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
