import React from 'react';
import { WebSocketProvider } from '../context/WebSocketContext';

const withWebSocketProvider = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <WebSocketProvider>
      <Component {...props} />
    </WebSocketProvider>
  );
};

export default withWebSocketProvider;