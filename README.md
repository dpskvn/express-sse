event-stream
============

[![NPM](https://nodei.co/npm/express-sse.png?downloads=true)](https://nodei.co/npm/express-sse/)

An Express middleware for quick'n'easy server-sent events.

## About
`express-sse` is meant to keep things simple. You need to send server-sent events without too many complications and fallbacks? This is the library to do so.

## Installation:
`npm install express-sse`

## Usage example:
### Server:
```js
var SSE = require('express-sse');
var sse = new SSE(["array", "containing", "initial", "content", "(optional)"]);

...

app.get('/stream', sse.init);

...

sse.send(content);
sse.send(content, eventName);
sse.send(content, eventName, customID);
sse.updateInit(["array", "containing", "new", "content"]);
```

### Client:
```js
var es = new EventSource('/stream');

es.onmessage = function (event) {
  ...
};

es.addEventListener(eventName, function (event) {
  ...
});
```
