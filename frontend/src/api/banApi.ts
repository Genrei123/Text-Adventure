import axios from 'axios';

// Create an axios instance with the base URL for the backend API
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

/**
 * Fetches the list of all bans from the server.
 * @returns A list of all bans.
 * @throws Error if there is an error fetching the bans.
 */
export const fetchBans = async () => {
    const response = await api.get('/api/bans'); // Now proxied through Vite
    return response.data;
};

/**
 * Adds a comment to a specific ban.
 * @param banId - The ID of the ban to add a comment to.
 * @param comment - The comment to add.
 * @returns The updated ban with the new comment.
 * @throws Error if there is an error adding the comment.
 */
export const addCommentToBan = async (banId: number, comment: string) => {
    const response = await api.put(`/bans/${banId}`, { comment });
    return response.data;
};

/**
 * Creates a new ban.
 * @param banData - The data for the new ban.
 * @returns The created ban.
 * @throws Error if there is an error creating the ban.
 */
export const createBan = async (banData: any) => {
    const response = await api.post('/bans', banData);
    return response.data;
};

/**
 * Deletes a specific ban by ID.
 * @param banId - The ID of the ban to delete.
 * @returns A message indicating the result of the deletion.
 * @throws Error if there is an error deleting the ban.
 */
export const deleteBan = async (banId: number) => {
    const response = await api.delete(`/bans/${banId}`);
    return response.data;
};

/**
 * Searches for users by username.
 * @param term - The search term.
 * @returns A list of users matching the search term.
 * @throws Error if there is an error searching for users.
 */
export const searchUsers = async (term: string) => {
    const response = await api.get(`/bans/users/search?term=${term}`);
    return response.data;
};