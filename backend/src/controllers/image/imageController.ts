import { uploadProfileImage } from "../../service/image/imageService"
import { Request, Response } from "express";

export const upload = async (req: Request, res: Response) => { 
    try {
        await uploadProfileImage(req, res);
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
};


