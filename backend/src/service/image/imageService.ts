import multer from 'multer';
import { Request, Response } from 'express';
import User from '../../model/user/user';

// Extend the Express Request type to include multer's file property
interface MulterRequest extends Request {
    file?: Express.Multer.File; // Use Express.Multer.File type
}

// Define storage configuration with proper types
export const storage = multer.diskStorage({
    destination: function (
        req: Request, // Or MulterRequest if you need file here
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void
    ) {
        cb(null, 'public/images');
    },
    filename: function (
        req: Request, // Or MulterRequest if you need file here
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
    ) {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// Configure multer upload
export const upload = multer({ storage: storage }).single('file');

// Upload profile image handler
export const uploadProfileImage = async (req: MulterRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Use req.user to restrict to the authenticated user
        const imageUrl = `/image/${req.file.filename}`;
        const updatedRows = await User.update(
            { image_url: imageUrl },
            { where: { id: (req.user as any).id } } // Consider typing req.user properly
        );

        if (updatedRows[0] === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ message: 'Failed to upload image' });
    }
};