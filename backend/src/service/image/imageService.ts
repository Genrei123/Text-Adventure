import multer from 'multer';
import { Request, Response } from 'express';
import User from '../../model/user/user';

export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

export const upload = multer({ storage: storage }).single('file');

export const uploadProfileImage = async (req: Request, res: Response) => {
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
            { where: { id: (req.user as any).id } }
        );

        // Optional: Check if the update affected any rows (should be 1)
        if (updatedRows[0] === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ message: 'Failed to upload image' });
    }
};