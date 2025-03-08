import { Request, Response } from 'express';
import User from '../../model/user/user'; // Adjust the import path to your User model

// Extend Request type to include file from multer
interface MulterRequest extends Request {
  file?: Express.Multer.File;
  user?: any; // You might want to use a proper user type here
}

// Upload profile image handler
export const upload = async (req: MulterRequest, res: Response): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Construct the URL path to the uploaded image
    const imageUrl = `/images/user-profile/${req.file.filename}`;
    
    // Update the user's profile image in the database
    const updatedRows = await User.update(
      { image_url: imageUrl },
      { where: { id: req.user.id } }
    );

    if (updatedRows[0] === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the image URL to the client
    res.status(200).json({ 
      message: 'Image uploaded successfully', 
      imageUrl 
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Failed to upload image' });
  }
};