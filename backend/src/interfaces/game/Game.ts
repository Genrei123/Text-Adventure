import { Comments } from './Comments';

export interface Game {
    id: number;
    title: string;
    slug: string;
    description: string;
    tagline: string;
    genre: string;
    subgenre: string;
    primary_color?: string;
    prompt_name: string;
    prompt_text?: string;
    prompt_model?: string;
    image_prompt_model?: string;
    image_prompt_name?: string;
    image_prompt_text?: string;
    image_data?: Buffer;
    music_prompt_text?: string;
    music_prompt_seed_image?: string;
    private: boolean;
    createdAt: Date;
    updatedAt: Date;
    UserId: number;

    // Ratings
    rating?: number;
    rating_count?: number;
    
    // Comments
    comment_count?: number;
    comments?: Comments[];
}