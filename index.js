/**
 * Require the module dependencies
 */
 
var EventEmitter = require('events').EventEmitter;
var util = require('util');

/**
 * Creates a new Server-Sent Event instance
 */

var SSE = function() {
  EventEmitter.call(this);
  
  this.init = function (req, res) {
    var id = 0;
    req.socket.setTimeout(Infinity);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    this.on('data', function(data) {
      res.write("id: " + id + "\n");
      res.write("data: " + JSON.stringify(data) + "\n\n");
      id += 1;
    });
  }.bind(this);
}

/**
* Inherit from EventEmitter
*/

util.inherits(SSE, EventEmitter);

/**
* Send data to the SSE
* @param {Object} data Data to send into the stream
*/

SSE.prototype.send = function(data) {
  this.emit('data', data);
};

module.exports = SSE;