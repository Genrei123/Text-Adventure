export const sanitizeInput = (input: string): string => {
    // Implement sanitization logic (e.g., removing harmful characters)
    return input.replace(/<[^>]*>?/gm, ''); // Example: Remove HTML tags
};