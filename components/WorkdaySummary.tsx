import React, { useState, useEffect } from 'react';
import { TimeLogEntry, LogType } from '../types';

interface WorkdaySummaryProps {
  entries: TimeLogEntry[];
}

const formatDuration = (ms: number): string => {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const WorkdaySummary: React.FC<WorkdaySummaryProps> = ({ entries }) => {
  const [summary, setSummary] = useState({ worked: 0, break: 0, client: 0, showWarning: false });

  useEffect(() => {
    if (entries.length === 0) {
      setSummary({ worked: 0, break: 0, client: 0, showWarning: false });
      return;
    }

    const startEntry = entries.find(e => e.type === LogType.WORK_START);
    if (!startEntry) return;

    let totalBreakMs = 0;
    let totalClientMs = 0;

    for (let i = 0; i < entries.length; i++) {
        if (entries[i].type === LogType.BREAK_START && entries[i+1]?.type === LogType.BREAK_END) {
            totalBreakMs += entries[i+1].timestamp.getTime() - entries[i].timestamp.getTime();
        }
        if (entries[i].type === LogType.CLIENT_START && entries[i+1]?.type === LogType.CLIENT_END) {
            totalClientMs += entries[i+1].timestamp.getTime() - entries[i].timestamp.getTime();
        }
    }
    
    const lastEntry = entries[entries.length - 1];
    const endTimestamp = lastEntry.type === LogType.WORK_END ? lastEntry.timestamp.getTime() : new Date().getTime();
    const totalElapsedMs = endTimestamp - startEntry.timestamp.getTime();
    const totalWorkedMs = totalElapsedMs - totalBreakMs;
    
    const oneHourInMs = 60 * 60 * 1000;
    const showWarning = lastEntry.type === LogType.WORK_END && totalBreakMs < oneHourInMs;

    setSummary({ worked: totalWorkedMs, break: totalBreakMs, client: totalClientMs, showWarning });

  }, [entries]);

  const SummaryItem: React.FC<{label: string, value: string}> = ({label, value}) => (
    <div className="text-center">
      <p className="text-2xl font-bold text-primary dark:text-sky-400">{value}</p>
      <p className="text-sm text-secondary dark:text-slate-400">{label}</p>
    </div>
  );


  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">Resumo da Jornada</h2>
      <div className="grid grid-cols-3 gap-4">
        <SummaryItem label="Horas Trabalhadas" value={formatDuration(summary.worked)} />
        <SummaryItem label="Intervalo Total" value={formatDuration(summary.break)} />
        <SummaryItem label="Tempo em Cliente" value={formatDuration(summary.client)} />
      </div>
      {summary.showWarning && (
        <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 rounded-md">
            <p className="font-bold">Atenção</p>
            <p>O intervalo foi inferior a 1 hora, conforme exigido por lei.</p>
        </div>
      )}
    </div>
  );
};

export default WorkdaySummary;