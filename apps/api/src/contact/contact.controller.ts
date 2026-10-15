import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contact: ContactService) {}

  @Post()
  create(@Body() dto: CreateContactDto) {
    return this.contact.create(dto);
  }
}
