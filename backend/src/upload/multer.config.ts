import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

export function profilePictureMulterOptions() {
  return {
    storage: memoryStorage(),
    fileFilter: (_req: any, file: Express.Multer.File, cb: (error: any, acceptFile: boolean) => void) => {
      if (!file.mimetype.match(/^image\/(jpeg|jpg|png)$/)) {
        return cb(new BadRequestException('Only JPEG and PNG images are allowed'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  } as const;
}
