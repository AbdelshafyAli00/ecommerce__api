import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

export const multerOptions = (folder: string) => ({
  storage: diskStorage({
    destination: `./src/uploads/${folder}`,
    filename: (req, file, cb) => {
      const prefix = `${Date.now()}-${Math.round(Math.random() * 1000)}`;
      const filename = `${prefix}-${file.originalname}`;
      cb(null, filename);
    },
  }),

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Not supported file'), false);
    }
  },
});

