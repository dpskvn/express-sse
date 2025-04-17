'use strict';

const express = require('express');
const EventSource = require('eventsource');

const SSE = require('../index');

jest.setTimeout(10000); // Increase timeout to avoid timeouts on slower systems

describe('express-sse', () => {
  let app;
  let server;
  let es;

  beforeEach(done => {
    app = express();
    server = app.listen(3000, done);
  });

  afterEach(done => {
    if (es) {
      es.close();
      es = null;
    }
    server.close(done);
  });

  test('should send events', done => {
    const sse = new SSE();
    app.get('/stream', sse.init);

    es = new EventSource('http://localhost:3000/stream');

    setTimeout(() => {
      sse.send('test message');
    }, 100);

    es.onmessage = e => {
      expect(JSON.parse(e.data)).toBe('test message');
      done();
    };
  });

  test('should allow sending custom events', done => {
    const sse = new SSE();
    app.get('/', sse.init);

    es = new EventSource('http://localhost:3000/');

    setTimeout(() => {
      sse.send('test message', 'custom event');
    }, 100);

    es.addEventListener('custom event', event => {
      expect(JSON.parse(event.data)).toBe('test message');
      done();
    });
  });

  test('should allow sending custom IDs', done => {
    const sse = new SSE();
    app.get('/', sse.init);

    es = new EventSource('http://localhost:3000/');

    setTimeout(() => {
      sse.send('test message', null, 1337);
    }, 100);

    es.onmessage = e => {
      expect(JSON.parse(e.data)).toBe('test message');
      expect(e.lastEventId).toBe('1337');
      done();
    };
  });

  test('should allow for serialization of arrays', done => {
    const sse = new SSE();
    app.get('/', sse.init);

    es = new EventSource('http://localhost:3000/');

    setTimeout(() => {
      sse.serialize([1, 2, 3, 4, 5]);
    }, 100);

    let counter = 0;

    es.onmessage = e => {
      counter++;
      if (counter === 5) {
        done();
      }
    };
  });

  test('should send a single event if a non-array is passed to serialize', done => {
    const sse = new SSE();
    app.get('/stream', sse.init);

    es = new EventSource('http://localhost:3000/stream');

    setTimeout(() => {
      sse.serialize('test message');
    }, 100);

    es.onmessage = e => {
      expect(JSON.parse(e.data)).toBe('test message');
      done();
    };
  });

  test('should serve initial data', done => {
    const sse = new SSE('initial message');
    app.get('/', sse.init);

    es = new EventSource('http://localhost:3000/');

    es.onmessage = e => {
      expect(JSON.parse(e.data)).toBe('initial message');
      done();
    };
  });

  test('should serialize initial data by default (isSerialized = true)', done => {
    const sse = new SSE([1, 2, 3, 4, 5]);
    app.get('/', sse.init);

    es = new EventSource('http://localhost:3000/');

    let counter = 0;

    es.onmessage = e => {
      counter++;
      if (counter === 5) {
        done();
      }
    };
  });

  test('should send initial data as array if isSerialized is false', done => {
    const sse = new SSE([1, 2, 3, 4, 5], { isSerialized: false });
    app.get('/', sse.init);

    es = new EventSource('http://localhost:3000/');

    es.onmessage = e => {
      expect(e.data).toBe(JSON.stringify([1, 2, 3, 4, 5]));
      done();
    };
  });

  test('should be able to update initial data', done => {
    const sse = new SSE(null, { isSerialized: false });
    app.get('/', sse.init);

    sse.updateInit([1, 2, 3, 4, 5]);

    es = new EventSource('http://localhost:3000/');

    es.onmessage = e => {
      expect(e.data).toBe(JSON.stringify([1, 2, 3, 4, 5]));
      done();
    };
  });

  test('should update initial data even if a non-array is passed', done => {
    const sse = new SSE(null);
    app.get('/', sse.init);

    sse.updateInit(1);

    es = new EventSource('http://localhost:3000/');

    es.onmessage = e => {
      expect(JSON.parse(e.data)).toBe(1);
      done();
    };
  });

  test('should allow dropping the initial data', done => {
    const sse = new SSE([1, 2, 3]);
    app.get('/', sse.init);

    sse.dropInit();

    setTimeout(() => {
      sse.send(1);
    }, 100);

    es = new EventSource('http://localhost:3000/');

    es.onmessage = e => {
      expect(JSON.parse(e.data)).toBe(1);
      done();
    };
  });

  test('should not send an event for an empty array if isSerialized is false', done => {
    const sse = new SSE([1, 2, 3], { isSerialized: false });
    app.get('/', sse.init);

    sse.dropInit();

    setTimeout(() => {
      sse.send(1);
    }, 100);

    es = new EventSource('http://localhost:3000/');

    es.onmessage = e => {
      expect(JSON.parse(e.data)).toBe(1);
      done();
    };
  });

  test('should send a custom initial event if the option is defined', done => {
    const sse = new SSE([1, 2, 3], { isSerialized: false, initialEvent: 'custom initial event' });
    app.get('/', sse.init);

    es = new EventSource('http://localhost:3000');

    es.addEventListener('custom initial event', event => {
      expect(event.data).toBe(JSON.stringify([1, 2, 3]));
      done();
    });
  });
});
