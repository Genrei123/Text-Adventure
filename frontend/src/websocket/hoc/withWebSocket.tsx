import React from 'react';
import { WebSocketProvider } from '../context/WebSocketContext';

const withWebSocket = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <WebSocketProvider>
      <Component {...props} />
    </WebSocketProvider>
  );
};

export default withWebSocket;