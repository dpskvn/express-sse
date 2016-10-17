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
   */
  constructor(initial) {
    super();

    if (initial) {
      this.initial = Array.isArray(initial) ? initial : [initial];
    } else {
      this.initial = [];
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

    // Increase number of event listeners on init
    this.setMaxListeners(this.getMaxListeners() + 2);

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
    });

    this.on('serialize', data => {
      let serializeSend = '';
      data.forEach(el => {
        serializeSend += `id: ${id}\ndata: ${JSON.stringify(el)}\n\n`;
        id += 1;
      });
      res.write(serializeSend);
    });

    if (this.initial) {
      this.serialize(this.initial);
    }

    // Remove listeners and reduce the number of max listeners on client disconnect
    req.on('close', () => {
      this.removeAllListeners('data');
      this.removeAllListeners('serialize');
      this.setMaxListeners(this.getMaxListeners() - 2);
    });
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
  send(data, event, id) {
    this.emit('data', {data, event, id});
  }

  serialize(data) {
    if (Array.isArray(data)) {
      this.emit('serialize', data);
    } else {
      this.send(data);
    }
  }
}

module.exports = SSE;
