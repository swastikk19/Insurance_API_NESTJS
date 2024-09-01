import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';

let multerConfig: MulterOptions;

try {
  multerConfig = {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        try {
          const networkPath = 'D:\\RevFin\\PolicyUploads';
          cb(null, networkPath);
        } catch (error) {
          cb(error, '');
        }
      },
      filename: (req, file, cb) => {
        try {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = file.mimetype.split('/')[1];
          cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
        } catch (error) {
          cb(error, '');
        }
      },
    }),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed'), false);
      }
    },
  };
} catch (error) {
  throw error;
}

export { multerConfig };
