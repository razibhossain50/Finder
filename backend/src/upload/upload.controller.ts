import {Controller,Post,UseInterceptors,UploadedFile,BadRequestException,UseGuards} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { profilePictureMulterOptions } from './multer.config';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('profile-picture')
  @UseInterceptors(FileInterceptor('profilePicture', profilePictureMulterOptions()))
  async uploadProfilePicture(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

  const { key, url, size } = await this.uploadService.uploadProfilePicture(file);
  const filename = key.split('/').pop();

    return {
      message: 'File uploaded successfully',
  key,
  filename,
      originalName: file.originalname,
      url,
      size,
    };
  }
}