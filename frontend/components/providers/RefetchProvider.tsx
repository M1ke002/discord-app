'use client';
import { createContext, useState } from 'react';

interface ContextProps {
  refetchServerSidebar: object;
  refetchNavbar: object;
  triggerRefetchComponents: Function;
}

export const refetchContext = createContext<ContextProps>({
  refetchServerSidebar: {},
  refetchNavbar: {},
  triggerRefetchComponents: () => null
});

const RefetchProvider = ({ children }: { children: React.ReactNode }) => {
  const [refetchServerSidebar, setRefetchServerSidebar] = useState({});
  const [refetchNavbar, setRefetchNavbar] = useState({});

  const triggerRefetchComponents = (componentNames: string[]) => {
    componentNames.forEach((componentName) => {
      if (componentName === 'ServerSidebar') {
        console.log('setRefetchServerSidebar');
        setRefetchServerSidebar({});
      } else if (componentName === 'Navbar') {
        setRefetchNavbar({});
      }
    });
  };

  const contextValue = {
    refetchServerSidebar,
    refetchNavbar,
    triggerRefetchComponents
  };

  return (
    <refetchContext.Provider value={contextValue}>
      {children}
    </refetchContext.Provider>
  );
};

export default RefetchProvider;
