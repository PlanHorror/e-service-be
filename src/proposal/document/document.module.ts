import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [DocumentService, PrismaService],
  controllers: [DocumentController],
  exports: [DocumentService],
})
export class DocumentModule {}
