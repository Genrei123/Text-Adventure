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
      } catch (error) {
        console.error('Error starting session:', error);
      }
    };

    startSession();
  }, [email]);

  useEffect(() => {
    const trackPageVisit = () => {
      if (sessionId) {
        const updatedVisitedPages = [...visitedPages, location.pathname];
        setVisitedPages(updatedVisitedPages);
        console.log('Visited pages:', updatedVisitedPages.join(', '));
      }
    };

    trackPageVisit();
  }, [location.pathname, sessionId]);

  return null;
};

export default SessionTracker;