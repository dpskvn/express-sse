/**
 * Require the module dependencies
 */

var EventEmitter = require('events').EventEmitter;
var util = require('util');

/**
 * Creates a new Server-Sent Event instance
 * @param {Array} initial Initial value(s) to be served through SSE (optional)
 */

var SSE = function(initial) {
  this.initial = initial ? initial : [];

  EventEmitter.call(this);

  /**
   * The SSE route handler
   */

  this.init = function(req, res) {
    var id = 0;
    req.socket.setTimeout(Number.MAX_SAFE_INTEGER || Infinity);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    if (this.initial) {
      for (var i = 0; i < this.initial.length; i++) {
        res.write("id: " + id + "\n");
        res.write("data: " + JSON.stringify(this.initial[i]) + "\n\n");
        id += 1;
      }
    }
    this.on('data', function(data) {
      res.write("id: " + id + "\n");
      res.write("data: " + JSON.stringify(data) + "\n\n");
      id += 1;
    });
  }.bind(this);

  /**
   * Update the data initially served by the SSE stream
   * @param {Array} data Array containing data to be served on new connections
   */

  this.updateInit = function(data) {
    this.initial = data;
  }.bind(this);

  /**
   * Send data to the SSE
   * @param {Object} data Data to send into the stream
   */

  this.send = function(data) {
    this.emit('data', data);
  }.bind(this);
}

/**
 * Inherit from EventEmitter
 */

util.inherits(SSE, EventEmitter);

module.exports = SSE;