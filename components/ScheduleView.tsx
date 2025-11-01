import React, { useState, useMemo } from 'react';
import { TimeLogEntry, LogType } from '../types';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import ClockIcon from './icons/ClockIcon';
import CoffeeIcon from './icons/CoffeeIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';

interface ScheduleViewProps {
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

const ScheduleView: React.FC<ScheduleViewProps> = ({ entries }) => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState<string | null>(null); // Store date as 'YYYY-MM-DD' string

    const entriesByDate = useMemo(() => {
        const map = new Map<string, TimeLogEntry[]>();
        entries.forEach(entry => {
            const dateStr = entry.timestamp.toISOString().split('T')[0];
            if (!map.has(dateStr)) {
                map.set(dateStr, []);
            }
            map.get(dateStr)!.push(entry);
        });
        return map;
    }, [entries]);

    const selectedDayLogs = selectedDate ? entriesByDate.get(selectedDate) || [] : [];
    const isPunchCountOdd = selectedDayLogs.length > 0 && selectedDayLogs.length % 2 !== 0;

    const renderMonth = (year: number, month: number) => {
        const monthName = new Date(year, month).toLocaleString('pt-BR', { month: 'long' });
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon...

        const dayCells = [];
        for (let i = 0; i < firstDayOfWeek; i++) {
            dayCells.push(<div key={`empty-${i}`}></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasEntries = entriesByDate.has(dateStr);
            const isSelected = selectedDate === dateStr;
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            dayCells.push(
                <button
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`
                        w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors
                        ${isSelected ? 'bg-primary text-white' : ''}
                        ${!isSelected && hasEntries ? 'bg-primary/20 dark:bg-sky-400/20' : ''}
                        ${!isSelected && isToday ? 'ring-2 ring-primary dark:ring-sky-500' : ''}
                        ${!isSelected ? 'hover:bg-slate-200 dark:hover:bg-slate-700' : ''}
                    `}
                >
                    {day}
                </button>
            );
        }

        return (
            <div key={month} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                <h3 className="font-bold text-center mb-2 capitalize">{monthName}</h3>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-secondary dark:text-slate-400">
                    <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
                </div>
                <div className="grid grid-cols-7 gap-1 mt-2">
                    {dayCells}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg flex items-center justify-between">
                <button onClick={() => setCurrentYear(y => y - 1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                    <ChevronLeftIcon />
                </button>
                <h2 className="text-2xl font-bold">{currentYear}</h2>
                <button onClick={() => setCurrentYear(y => y + 1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                    <ChevronRightIcon />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => renderMonth(currentYear, i))}
            </div>
            
            {selectedDate && (
                <div id="log-details" className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg mt-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">
                        Registros para {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </h2>
                    {isPunchCountOdd && (
                        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-md">
                            <p className="font-bold">Atenção: Registros Ímpares</p>
                            <p>A contagem de registros para este dia é ímpar ({selectedDayLogs.length}). Verifique se você esqueceu de registrar alguma entrada ou saída.</p>
                        </div>
                    )}
                    {selectedDayLogs.length > 0 ? (
                        <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {selectedDayLogs.map((entry) => (
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
                    ) : (
                        <p className="text-secondary dark:text-slate-400 text-center py-4">Nenhum registro para esta data.</p>
                    )}
                </div>
            )}

        </div>
    );
};

export default ScheduleView;
