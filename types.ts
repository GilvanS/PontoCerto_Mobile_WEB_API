
export enum LogType {
  WORK_START = 'Início de Jornada',
  WORK_END = 'Fim de Jornada',
  BREAK_START = 'Início de Intervalo',
  BREAK_END = 'Fim de Intervalo',
  CLIENT_START = 'Saída para Cliente',
  CLIENT_END = 'Retorno do Cliente',
}

export interface TimeLogEntry {
  id: number;
  type: LogType;
  timestamp: Date;
}

export enum RequestType {
  TIME_OFF = 'Folga',
  VACATION = 'Férias',
  ADJUSTMENT = 'Ajuste Manual',
}

export interface Request {
  id: number;
  type: RequestType;
  startDate: Date;
  endDate?: Date;
  reason: string;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
}
