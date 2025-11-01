import React, { useState, useEffect } from 'react';
import { TimeLogEntry, LogType, Request, RequestType } from './types';
import Header from './components/Header';
import TimeClock from './components/TimeClock';
import TimeLog from './components/TimeLog';
import WorkdaySummary from './components/WorkdaySummary';
import RequestForm from './components/RequestForm';
import ScheduleView from './components/ScheduleView';

const App: React.FC = () => {
  const [timeLog, setTimeLog] = useState<TimeLogEntry[]>(() => {
    try {
      const savedLogs = localStorage.getItem('timeLog');
      if (savedLogs) {
        const parsed = JSON.parse(savedLogs) as any[];
        return parsed.map(log => ({ ...log, timestamp: new Date(log.timestamp) }));
      }
    } catch (error) {
      console.error("Failed to load or parse time logs from localStorage", error);
    }
    return [];
  });

  const [currentStatus, setCurrentStatus] = useState<LogType | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [view, setView] = useState<'dashboard' | 'schedule'>('dashboard');

  useEffect(() => {
    const lastLog = timeLog.length > 0 ? timeLog[timeLog.length - 1] : null;
    if (lastLog && lastLog.type !== LogType.WORK_END) {
        setCurrentStatus(lastLog.type);
    } else {
        setCurrentStatus(null);
    }
  }, []); // Run only on initial mount


  useEffect(() => {
    // Check for saved theme preference or system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  
  useEffect(() => {
    try {
      localStorage.setItem('timeLog', JSON.stringify(timeLog));
    } catch (error) {
      console.error("Failed to save time logs to localStorage", error);
    }
  }, [timeLog]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);


  const handleLog = (type: LogType) => {
    // Prevent ending workday if not clocked in
    if (type === LogType.WORK_END && currentStatus === null) {
        return;
    }

    setTimeLog(prevLog => [...prevLog, { id: Date.now(), type, timestamp: new Date() }]);
    
    if (type === LogType.WORK_END) {
        setCurrentStatus(null);
        showTempNotification(`Jornada encerrada. Bom descanso!`);
    } else {
        setCurrentStatus(type);
    }
  };

  const showTempNotification = (message: string) => {
    setShowNotification(message);
    setTimeout(() => {
        setShowNotification(null);
    }, 3000);
  };

  const handleRequestSubmit = (request: Omit<Request, 'id' | 'status'>) => {
    const newRequest: Request = {
      ...request,
      id: Date.now(),
      status: 'Pendente',
    };
    setRequests(prev => [...prev, newRequest]);
    showTempNotification(`Sua solicitação de ${request.type} foi enviada.`);
  };

  const todayEntries = timeLog.filter(entry => 
    entry.timestamp.toLocaleDateString('pt-BR') === new Date().toLocaleDateString('pt-BR')
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} view={view} setView={setView} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {view === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <TimeClock currentStatus={currentStatus} onLog={handleLog} />
                <WorkdaySummary entries={todayEntries} />
              </div>
              <div className="space-y-6">
                <TimeLog entries={todayEntries} />
                <RequestForm onSubmit={handleRequestSubmit} />
              </div>
            </div>
          )}
          {view === 'schedule' && (
              <ScheduleView entries={timeLog} />
          )}
        </div>
      </main>

      {/* Notification Toast */}
      {showNotification && (
          <div className="fixed bottom-5 right-5 bg-green-600 text-white py-3 px-6 rounded-lg shadow-xl animate-bounce">
              {showNotification}
          </div>
      )}
    </div>
  );
};

export default App;
