import React, { createContext, useState, useContext, useEffect } from 'react';
import moment from 'moment';
import { getAllSemesters } from '../storage/SemestersStorage';

export const CurrentSemesterContext = createContext({
  currentSemesterId: null as string | null,
  setCurrentSemesterId: (_: string | null) => { },
});

interface Props {
  children: React.ReactNode;
}

export const CurrentSemesterProvider = ({ children }: Props) => {
  const [currentSemesterId, setCurrentSemesterId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSetCurrentSemester = async () => {
      const semesters = await getAllSemesters();
      const now = moment();
      const currentSemester = semesters?.find(semester => {
        const start = moment(semester.start);
        const end = moment(semester.end);
        return now.isBetween(start, end, undefined, '[]');
      });
      if (currentSemester) {
        setCurrentSemesterId(currentSemester.id);
      }
    };
    fetchAndSetCurrentSemester();
  }, []);

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
