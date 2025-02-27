import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { createSession } from '../api-calls/visitedPagesSession';

interface SessionTrackerProps {
  email: string;
  setSessionId: (id: string) => void;
  visitedPages: string[];
  setVisitedPages: (pages: string[]) => void;
}

const SessionTracker: React.FC<SessionTrackerProps> = ({ email, setSessionId, visitedPages, setVisitedPages }) => {
  const location = useLocation();
  const [sessionId, setLocalSessionId] = React.useState<string | null>(null);

  useEffect(() => {
    const startSession = async () => {
      try {
        const session = await createSession(email);
        setLocalSessionId(session.id);
        setSessionId(session.id);
        console.log('Session created:', {
          id: session.id,
          email: session.email,
          startTime: session.startTime,
        });

        // Store session ID in local storage
        localStorage.setItem('sessionId', session.id);

        // Initialize visited pages in local storage
        localStorage.setItem('visitedPages', JSON.stringify([]));
      } catch (error) {
        console.error('Error starting session:', error);
      }
    };

    startSession();
  }, [email, setSessionId]);

  useEffect(() => {
    const trackPageVisit = () => {
      if (sessionId) {
        const lastVisitedPage = visitedPages[visitedPages.length - 1];
        if (lastVisitedPage !== location.pathname) {
          const updatedVisitedPages = [...visitedPages, location.pathname];
          setVisitedPages(updatedVisitedPages);
          console.log('Visited pages:', updatedVisitedPages.join(', '));

          // Update visited pages in local storage
          localStorage.setItem('visitedPages', JSON.stringify(updatedVisitedPages));
        }
      }
    };

    trackPageVisit();
  }, [location.pathname, sessionId, visitedPages, setVisitedPages]);

  return null;
};

export default SessionTracker;