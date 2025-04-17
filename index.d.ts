import { EventEmitter } from 'events';
import { Request, Response } from 'express';

interface SSEOptions {
  isSerialized?: boolean;
  isCompressed?: boolean;
  initialEvent?: string;
}

declare class SSE extends EventEmitter {
  constructor(initial?: any | any[], options?: SSEOptions);
  init(req: Request, res: Response): void;
  updateInit(data: any | any[]): void;
  dropInit(): void;
  send(data: any, event?: string, id?: number | string): void;
  serialize(data: any[] | any): void;
}

export = SSE;
export default SSE;