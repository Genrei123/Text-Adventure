import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL; // Use the environment variable

let isSessionCreating = false;

export const createSession = async (email: string) => {
  if (isSessionCreating) {
    console.log('Session creation already in progress');
    return;
  }

  try {
    isSessionCreating = true;
    const response = await axios.post(`${API_URL}/sessions/createSession`, { email });
    const newSession = response.data;

    console.log('New session created:', newSession); // Add this line to log the response

    localStorage.setItem('sessionId', newSession.id);
    return newSession;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  } finally {
    isSessionCreating = false;
  }
};

export const clearSession = async (sessionId: string, visitedPages: string[]) => {
  try {
    const response = await axios.post(`${API_URL}/sessions/clearSession`, { sessionId, visitedPages });
    
    return response.data;
  } catch (error) {
    console.error('Error clearing session:', error);
    throw error;
  }
};

export const addPageVisits = async (sessionId: string, pages: string[], localStorageData: string) => {
  try {
    const response = await axios.post(`${API_URL}/sessions/addPageVisit`, { sessionId, pages, localStorageData });
    return response.data;
  } catch (error) {
    console.error('Error adding page visits:', error);
    throw error;
  }
};

// Helper function to track page visits
export const trackPageVisit = async (sessionId: string, page: string) => {
  const visitedPages = JSON.parse(localStorage.getItem("visitedPages") || "{}");

  // Increment count for the current page
  visitedPages[page] = (visitedPages[page] || 0) + 1;

  // Save updated visited pages to local storage
  localStorage.setItem("visitedPages", JSON.stringify(visitedPages));

  // console.log("Visited pages:", visitedPages);

  // Send only the updated page visit to the backend
  await addPageVisits(sessionId, [page], JSON.stringify(visitedPages));
};

// Function to log out and clear session
export const handleLogout = async (sessionId: string) => {
  try {
    const visitedPages = JSON.parse(localStorage.getItem('visitedPages') || '[]');
    // console.log('Logging out. Current local storage:', localStorage.getItem('visitedPages'));
    await clearSession(sessionId, visitedPages);
    localStorage.removeItem('visitedPages');
    localStorage.removeItem('sessionId'); // Remove session ID from local storage
    // console.log('Session cleared and local storage removed.');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};
