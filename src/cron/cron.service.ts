import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { deleteFile } from '../common';
import { PrismaService } from '../prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CronService {
  constructor(private readonly prisma: PrismaService) {}
  // Cron 1 day
  @Cron('0 0 * * *')
  // Cron 10s
  // @Cron('*/10 * * * * *')
  async deleteDanglingFiles() {
    // Take all file in attachments folder
    const attachmentsPath = path.join(process.cwd(), 'attachments');
    const files = fs.readdirSync(attachmentsPath);
    const query = `
      SELECT dp.attachment_path, v.file, dt.path
      FROM (VALUES 
        ${files.map((file) => `('${process.env.ATTACHMENTS_PATH}/${file}', '${file}')`).join(',\n')}
      ) AS v(attachment_path, file)
      LEFT JOIN "DocumentProposal" dp
            ON dp.attachment_path = v.attachment_path
      LEFT JOIN "DocumentTemplate" dt
            ON dt.path = v.attachment_path
      WHERE dp.attachment_path IS NULL
        AND dt.path IS NULL;
    `;
    // console.log('Query executed:', query);
    const documents: {
      attachment_path: string;
      file: string;
      path: string;
    }[] = await this.prisma.$queryRawUnsafe(query);
    for (const doc of documents) {
      const filePath = path.join(attachmentsPath, doc.file);
      console.log('Deleting file:', filePath);
      if (fs.existsSync(filePath)) {
        deleteFile(filePath);
      }
    }
    if (documents.length === 0) {
      console.log('No dangling files found.');
    }
  }
}
