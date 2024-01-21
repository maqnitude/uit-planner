import React, { createContext, useState, useContext } from 'react';

export const CurrentSemesterContext = createContext({
  currentSemesterId: null as string | null,
  setCurrentSemesterId: (_: string | null) => { },
});

interface Props {
  children: React.ReactNode;
}

export const CurrentSemesterProvider = ({ children }: Props) => {
  const [currentSemesterId, setCurrentSemesterId] = useState<string | null>(null);

  return (
    <CurrentSemesterContext.Provider value={{ currentSemesterId, setCurrentSemesterId }}>
      {children}
    </CurrentSemesterContext.Provider>
  );
};

export const useCurrentSemester = () => {
  const context = useContext(CurrentSemesterContext);
  if (context === undefined) {
    throw new Error('useCurrentSemester must be used within a CurrentSemesterProvider');
  }
  return context;
};
