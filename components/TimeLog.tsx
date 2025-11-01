import React from 'react';
import { TimeLogEntry, LogType } from '../types';
import ClockIcon from './icons/ClockIcon';
import CoffeeIcon from './icons/CoffeeIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';

interface TimeLogProps {
  entries: TimeLogEntry[];
}

const getLogIcon = (type: LogType) => {
  const className = "w-5 h-5 mr-3";
  switch (type) {
    case LogType.WORK_START:
    case LogType.WORK_END:
      return <ClockIcon className={className} />;
    case LogType.BREAK_START:
    case LogType.BREAK_END:
      return <CoffeeIcon className={className} />;
    case LogType.CLIENT_START:
    case LogType.CLIENT_END:
      return <BriefcaseIcon className={className} />;
    default:
      return null;
  }
};

const getLogColor = (type: LogType) => {
    switch (type) {
        case LogType.WORK_START: return 'text-success';
        case LogType.WORK_END: return 'text-danger';
        case LogType.BREAK_START:
        case LogType.CLIENT_START: return 'text-amber-600';
        case LogType.BREAK_END:
        case LogType.CLIENT_END: return 'text-sky-600';
        default: return 'text-gray-500';
    }
}


const TimeLog: React.FC<TimeLogProps> = ({ entries }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">Registros de Hoje</h2>
      {entries.length === 0 ? (
        <p className="text-secondary dark:text-slate-400 text-center py-4">Nenhum registro para hoje.</p>
      ) : (
        <ul className="space-y-3 h-64 overflow-y-auto pr-2">
          {entries.slice().reverse().map((entry) => (
            <li key={entry.id} className={`flex items-center p-3 rounded-md bg-slate-50 dark:bg-slate-700 border-l-4 ${getLogColor(entry.type).replace('text-','border-')}`}>
              <div className={`${getLogColor(entry.type)}`}>
                {getLogIcon(entry.type)}
              </div>
              <span className="flex-grow font-medium text-gray-700 dark:text-slate-200">{entry.type}</span>
              <span className="text-sm font-mono text-gray-500 dark:text-slate-400">
                {entry.timestamp.toLocaleTimeString('pt-BR')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TimeLog;