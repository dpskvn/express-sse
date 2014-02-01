#event-stream

An Express middleware for quick'n'easy server-sent events.

##Usage example:
###Server:
```
var SSE = require('express-sse');
var sse = new SSE();

...

app.get('/stream', sse.init);

...

sse.send(content);
```

###Client:
```
var es = new EventSource('/stream');

es.onmessage = function (event) {
  ...
};
```