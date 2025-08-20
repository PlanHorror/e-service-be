import * as uuid from 'uuid';
import * as path from 'node:path';
import * as fs from 'fs';

export function generateUniqueFileName(file: Express.Multer.File): string {
  const extension = file.originalname.split('.').pop();
  const name = file.originalname.split('.').slice(0, -1).join('.');
  return `${name}-${uuid.v4()}.${extension}`;
}

export function saveFile(file: Express.Multer.File, path: string): void {
  fs.writeFile(path, file.buffer, (err) => {
    if (err) {
      console.error(err);
      throw err;
    }
  });
}

export function deleteFile(path: string): void {
  fs.unlink(path, (err) => {
    if (err) {
      throw err;
    }
  });
}
