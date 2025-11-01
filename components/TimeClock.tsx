import React, { useState, useEffect } from 'react';
import { LogType } from '../types';
import ClockIcon from './icons/ClockIcon';
import CoffeeIcon from './icons/CoffeeIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';

interface TimeClockProps {
  currentStatus: LogType | null;
  onLog: (type: LogType) => void;
}

const ActionButton: React.FC<{ onClick: () => void; text: string; icon: React.ReactNode; className: string; disabled?: boolean; }> = ({ onClick, text, icon, className, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-lg font-semibold text-white transition-transform transform hover:scale-105 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${className}`}
  >
    {icon}
    <span>{text}</span>
  </button>
);

const TimeClock: React.FC<TimeClockProps> = ({ currentStatus, onLog }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => date.toLocaleTimeString('pt-BR');
  const formatDate = (date: Date) => date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const hasStarted = currentStatus !== null;
  const isWorking = currentStatus === LogType.WORK_START || currentStatus === LogType.CLIENT_END || currentStatus === LogType.BREAK_END;
  const isOnBreak = currentStatus === LogType.BREAK_START;
  const isWithClient = currentStatus === LogType.CLIENT_START;

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <p className="text-5xl font-mono text-gray-800 dark:text-slate-100">{formatTime(currentTime)}</p>
        <p className="text-secondary dark:text-slate-400">{formatDate(currentTime)}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!hasStarted && (
           <div className="md:col-span-2">
            <ActionButton onClick={() => onLog(LogType.WORK_START)} text="Iniciar Jornada" icon={<ClockIcon />} className="bg-success hover:bg-green-700" />
           </div>
        )}
        {hasStarted && (
          <>
            <ActionButton onClick={() => onLog(isOnBreak ? LogType.BREAK_END : LogType.BREAK_START)} text={isOnBreak ? "Retornar do Intervalo" : "Sair para Intervalo"} icon={<CoffeeIcon />} className={isOnBreak ? "bg-amber-500 hover:bg-amber-600" : "bg-secondary hover:bg-slate-600"} disabled={!isWorking && !isOnBreak} />
            <ActionButton onClick={() => onLog(isWithClient ? LogType.CLIENT_END : LogType.CLIENT_START)} text={isWithClient ? "Retornar do Cliente" : "Sair para Cliente"} icon={<BriefcaseIcon />} className={isWithClient ? "bg-sky-500 hover:bg-sky-600" : "bg-secondary hover:bg-slate-600"} disabled={!isWorking && !isWithClient} />
            <div className="md:col-span-2">
              <ActionButton onClick={() => onLog(LogType.WORK_END)} text="Encerrar Jornada" icon={<ClockIcon />} className="bg-danger hover:bg-red-700" disabled={isOnBreak || isWithClient} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TimeClock;