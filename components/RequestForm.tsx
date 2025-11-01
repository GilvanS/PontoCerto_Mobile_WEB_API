import React, { useState } from 'react';
import { RequestType, Request } from '../types';

interface RequestFormProps {
  onSubmit: (request: Omit<Request, 'id' | 'status'>) => void;
}

const RequestForm: React.FC<RequestFormProps> = ({ onSubmit }) => {
  const [type, setType] = useState<RequestType>(RequestType.ADJUSTMENT);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !reason) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    const newRequest: Omit<Request, 'id' | 'status'> = {
      type,
      startDate: new Date(startDate),
      reason,
      ...(type === RequestType.VACATION && endDate && { endDate: new Date(endDate) }),
    };
    onSubmit(newRequest);

    // Reset form
    setStartDate('');
    setEndDate('');
    setReason('');
  };
  
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-slate-200 dark:bg-slate-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">Fazer uma Solicitação</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="request-type" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Tipo de Solicitação</label>
          <select 
            id="request-type"
            value={type}
            onChange={(e) => setType(e.target.value as RequestType)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-slate-700 dark:text-slate-100 border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-primary dark:focus:ring-sky-500 focus:border-primary dark:focus:border-sky-500 sm:text-sm rounded-md"
          >
            <option value={RequestType.ADJUSTMENT}>Ajuste Manual</option>
            <option value={RequestType.TIME_OFF}>Folga</option>
            <option value={RequestType.VACATION}>Férias</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                {type === RequestType.VACATION ? 'Data de Início' : 'Data'}
              </label>
              <input 
                type={type === RequestType.ADJUSTMENT ? 'datetime-local' : 'date'} 
                id="start-date" 
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm bg-white dark:bg-slate-700 dark:text-slate-100 border-gray-300 dark:border-slate-600 rounded-md"
                required
              />
            </div>
            {type === RequestType.VACATION && (
                <div>
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Data de Fim</label>
                  <input 
                    type="date" 
                    id="end-date" 
                    min={startDate || today}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 block w-full shadow-sm sm:text-sm bg-white dark:bg-slate-700 dark:text-slate-100 border-gray-300 dark:border-slate-600 rounded-md"
                    required
                  />
                </div>
            )}
        </div>
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
            {type === RequestType.ADJUSTMENT ? 'Justificativa do Ajuste' : 'Motivo'}
          </label>
          <textarea
            id="reason"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1 block w-full shadow-sm sm:text-sm bg-white dark:bg-slate-700 dark:text-slate-100 border-gray-300 dark:border-slate-600 rounded-md"
            placeholder={
              type === RequestType.ADJUSTMENT ? "Ex: Esqueci de registrar o retorno do intervalo às 13:00." : "Descreva o motivo da sua solicitação."
            }
            required
          ></textarea>
        </div>
        <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Enviar Solicitação
        </button>
      </form>
    </div>
  );
};

export default RequestForm;