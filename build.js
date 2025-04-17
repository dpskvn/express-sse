const fs = require('fs');

// Read the source file
const source = fs.readFileSync('./index.js', 'utf8');

// Replace require with import
const esmSource = source
  // Replace require statement with import
  .replace(
    "const EventEmitter = require('events').EventEmitter;",
    "import { EventEmitter } from 'events';"
  )
  // Replace strict mode directive (not needed in ESM)
  .replace("'use strict';", '')
  // Replace module.exports with export default
  .replace(/module\.exports = SSE;[\s\S]*$/, 'export default SSE;');

// Write the ESM version
fs.writeFileSync('./index.mjs', esmSource);

console.log('ESM version created successfully: index.mjs');