import { EventEmitter } from 'events';
import { Request, Response } from 'express';

/**
 * Options for SSE initialization
 */
export interface SSEOptions {
  /**
   * Determines if initial data should be serialized
   * @default true
   */
  isSerialized?: boolean;
  
  /**
   * Custom event name for initial data
   */
  initialEvent?: string;
  
  /**
   * Enable compression support
   */
  isCompressed?: boolean;
}

/**
 * Data structure for SSE events
 */
export interface SSEData {
  data: any;
  event?: string;
  id?: string | number;
}

/**
 * Server-Sent Event instance class
 * @extends EventEmitter
 */
declare class SSE extends EventEmitter {
  /**
   * Initial data to be served through SSE
   */
  initial: any[];
  
  /**
   * SSE options
   */
  options: SSEOptions;

  /**
   * Creates a new Server-Sent Event instance
   * @param initial Initial value(s) to be served through SSE
   * @param options SSE options
   */
  constructor(initial?: any | any[], options?: SSEOptions);

  /**
   * The SSE route handler - use as middleware in Express routes
   */
  init(req: Request, res: Response): void;

  /**
   * Update the data initially served by the SSE stream
   * @param data Array or single value containing data to be served on new connections
   */
  updateInit(data: any | any[]): void;

  /**
   * Empty the data initially served by the SSE stream
   */
  dropInit(): void;

  /**
   * Send data to the SSE
   * @param data Data to send into the stream
   * @param event Event name
   * @param id Custom event ID
   */
  send(data: any, event?: string, id?: string | number): void;

  /**
   * Send serialized data to the SSE
   * @param data Data to be serialized as a series of events
   */
  serialize(data: any | any[]): void;
}

export = SSE;