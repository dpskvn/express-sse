'use strict';

/**
 * Require the module dependencies
 */

const EventEmitter = require('events').EventEmitter;

/**
 * Server-Sent Event instance class
 * @extends EventEmitter
 */
class SSE extends EventEmitter {
  /**
   * Creates a new Server-Sent Event instance
   * @param [array] initial Initial value(s) to be served through SSE
   * @param [object] options Options for SSE.
   */
  constructor(initial, options) {
    super();

    if (initial) {
      this.initial = Array.isArray(initial) ? initial : [initial];
    } else {
      this.initial = [];
    }
    
    if (options) {
      if(options.autoQueue) {
        options.isQueue = true;
        options.queueLength = typeof options.queueLength !== 'undefined' ? options.queueLength : 10;
      }
      this.options = options;
    } else {
      this.options = { isQueue: true, autoQueue: false };
    }

    this.init = this.init.bind(this);
  }

  /**
   * The SSE route handler
   */
  init(req, res) {
    let id = 0;
    req.socket.setTimeout(Number.MAX_SAFE_INTEGER || Infinity);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    this.on('data', data => {
      if (data.id) {
        res.write(`id: ${data.id}\n`);
      } else {
        res.write(`id: ${id}\n`);
        id += 1;
      }
      if (data.event) {
        res.write(`event: ${data.event}\n`);
      }
      res.write(`data: ${JSON.stringify(data.data)}\n\n`);
      if(!data.isInitial && this.options.autoQueue) {
        this.initial.push(data.data);
        if(this.options.queueLength > 0 && this.initial.length > this.options.queueLength) {
          this.initial.splice(0, this.initial.length - this.options.queueLength);
        }
      }
    });

    if (this.initial) {
      if(this.options.isQueue) {
        id = this.initial.reduce((msgId, data) => {
          this.send(data, null, msgId, true);
          return msgId + 1;
        }, id);
      } else {
        this.send(this.initial, null, id, true);
        id += 1;
      }
    }
  }

  /**
   * Update the data initially served by the SSE stream
   * @param {array} data array containing data to be served on new connections
   */
  updateInit(data) {
    this.initial = Array.isArray(data) ? data : [data];
  }

  /**
   * Send data to the SSE
   * @param {(object|string)} data Data to send into the stream
   * @param [string] event Event name
   * @param [(string|number)] id Custom event ID
   */
  send(data, event, id, isInitial) {
    this.emit('data', {data, event, id, isInitial});
  }
}

module.exports = SSE;
