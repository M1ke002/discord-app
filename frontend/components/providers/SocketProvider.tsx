'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // useEffect(() => {
  //   const socketInstance = (io as any)('http://localhost:8085');

  //   socketInstance.on('connect', () => {
  //     setIsConnected(true);
  //     console.log('Connected to socket server');
  //   });

  //   socketInstance.on('testSocket', (data: any) => {
  //     console.log(
  //       'received data from server in socket client: ' + JSON.stringify(data)
  //     );
  //   });

  //   socketInstance.on('disconnect', () => {
  //     setIsConnected(false);
  //     console.log('Disconnected from socket server');
  //   });

  //   setSocket(socketInstance);

  //   return () => {
  //     socketInstance.disconnect();
  //   };
  // }, []);

  return (
    // <SocketContext.Provider value={{ socket, isConnected }}>
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
