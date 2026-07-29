import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Internship {
  id: string;
  role: string;
  company: string;
  stipend: string;
  description: string;
  task?: string;
  location?: string;
  link?: string;
  source: 'RECRUITER POSTED' | 'AI FETCHED';
  startDate?: string;
  endDate?: string;
  posted_at?: string;
}

interface InternshipContextType {
  internships: Internship[];
  addInternships: (newItems: Internship[]) => void;
  updateInternship: (id: string, updated: Partial<Internship>) => void;
  deleteInternship: (id: string) => void;
  clearInternships: () => void;
  refresh: () => void;
}

const InternshipContext = createContext<InternshipContextType | undefined>(undefined);

export function InternshipProvider({ children }: { children: React.ReactNode }) {
  const [internships, setInternships] = useState<Internship[]>([]);

  const loadInternships = () => {
    const saved = localStorage.getItem('all_internships');
    if (saved) {
      setInternships(JSON.parse(saved));
    } else {
      setInternships([]);
    }
  };

  useEffect(() => {
    loadInternships();
    
    // Listen for storage changes in other tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'all_internships') {
        loadInternships();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const persist = (list: Internship[]) => {
    localStorage.setItem('all_internships', JSON.stringify(list));
    setInternships(list);
  };

  const addInternships = (newItems: Internship[]) => {
    const updated = [...newItems, ...internships];
    const unique = updated.filter((v, i, a) => 
      a.findIndex(t => ((t.role || '') === (v.role || '') && (t.company || '') === (v.company || ''))) === i
    );
    persist(unique);
  };

  const updateInternship = (id: string, updated: Partial<Internship>) => {
    const newList = internships.map(item => item.id === id ? { ...item, ...updated } : item);
    persist(newList);
  };

  const deleteInternship = (id: string) => {
    const newList = internships.filter(item => item.id !== id);
    persist(newList);
  };

  const clearInternships = () => {
    persist([]);
  };

  const refresh = () => loadInternships();

  return (
    <InternshipContext.Provider value={{ internships, addInternships, updateInternship, deleteInternship, clearInternships, refresh }}>
      {children}
    </InternshipContext.Provider>
  );
}

export function useInternships() {
  const context = useContext(InternshipContext);
  if (context === undefined) {
    throw new Error('useInternships must be used within an InternshipProvider');
  }
  return context;
}
