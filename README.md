#event-stream

[![NPM](https://nodei.co/npm/express-sse.png?downloads=true)](https://nodei.co/npm/express-sse/)

An Express middleware for quick'n'easy server-sent events.

##Installation:
`npm install express-sse`

##Usage example:
###Server:
```
var SSE = require('express-sse');
var sse = new SSE(["array", "containing", "initial", "content", "(optional)"]);

...

app.get('/stream', sse.init);

...

sse.send(content);
sse.updateInit(["array", "containing", "new", "initial", "content"]);
```

###Client:
```
var es = new EventSource('/stream');

es.onmessage = function (event) {
  ...
};
```