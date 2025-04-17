'use strict';

import { jest } from '@jest/globals';
import express from 'express';
import EventSource from 'eventsource';
import SSE from '../index.mjs';

jest.setTimeout(10000); // Increase timeout to avoid timeouts on slower systems

describe('express-sse ESM version', () => {
  let app;
  let server;
  let es;

  beforeEach(done => {
    app = express();
    server = app.listen(3001, done);
  });

  afterEach(done => {
    if (es) {
      es.close();
      es = null;
    }
    server.close(done);
  });

  test('should send events using ESM import', done => {
    const sse = new SSE();
    app.get('/stream', sse.init);

    es = new EventSource('http://localhost:3001/stream');

    setTimeout(() => {
      sse.send('test message');
    }, 100);

    es.onmessage = e => {
      expect(JSON.parse(e.data)).toBe('test message');
      done();
    };
  });

  test('should allow sending custom events using ESM import', done => {
    const sse = new SSE();
    app.get('/', sse.init);

    es = new EventSource('http://localhost:3001/');

    setTimeout(() => {
      sse.send('test message', 'custom event');
    }, 100);

    es.addEventListener('custom event', event => {
      expect(JSON.parse(event.data)).toBe('test message');
      done();
    });
  });
});