import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

const destinationFolder = process.env.OUTPUT_DIR || 'uploads';
const OUTPUT_DIR = path.join(destinationFolder);

const uploadMiddleware = () => {
    const storage = multer.diskStorage({
        destination: (req: Request, file, cb) => {
            cb(null, OUTPUT_DIR);
        },
        filename: (req: Request, file: Express.Multer.File, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        },
    });

    const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    };

    return multer({ storage, fileFilter });
};

export { uploadMiddleware, OUTPUT_DIR };
