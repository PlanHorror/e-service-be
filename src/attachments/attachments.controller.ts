import {
  BadRequestException,
  Controller,
  Get,
  Header,
  NotFoundException,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join, normalize, resolve } from 'path';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('Attachments')
@Controller('attachments')
export class AttachmentsController {
  constructor() {}

  @ApiOperation({ summary: 'Download file by path' })
  @ApiQuery({ name: 'path', description: 'File path relative to project root' })
  @ApiResponse({ status: 200, description: 'File downloaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid path' })
  @ApiResponse({ status: 404, description: 'File not found' })
  @Get()
  getFile(
    @Query('path') path: string,
    @Res({ passthrough: true }) res: Response,
  ): StreamableFile {
    if (!path) {
      throw new BadRequestException('Path is required');
    }

    // Security: Normalize path and ensure it's within allowed directory
    const normalizedPath = normalize(path);
    const attachmentsDir = resolve(process.cwd(), 'attachments');
    const fullPath = resolve(process.cwd(), normalizedPath);

    // Prevent path traversal attacks
    if (
      !fullPath.startsWith(attachmentsDir) &&
      !normalizedPath.startsWith('attachments/')
    ) {
      throw new BadRequestException('Invalid path - access denied');
    }

    // Check if file exists
    if (!existsSync(fullPath)) {
      throw new NotFoundException('File not found');
    }

    try {
      const file = createReadStream(fullPath);

      // Set appropriate headers
      const filename = path.split('/').pop() || 'download';
      const encodedFilename = encodeURIComponent(filename);

      res.set({
        'Content-Type': this.getMimeType(filename),
        'Content-Disposition': `attachment; filename*=UTF-8''${encodedFilename}`,
      });

      return new StreamableFile(file);
    } catch (error) {
      console.error('Error reading file:', error);
      throw new NotFoundException('Unable to read file');
    }
  }

  private getMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      txt: 'text/plain',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  }
}
