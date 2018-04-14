#!/usr/bin/env node

'use strict';

var currentNodeVersion = process.versions.node;
var semver = currentNodeVersion.split('.');
var major = semver[0];

if (major < 4) {
  console.error('NODE VERSION TOO OLD!');
  process.exit(1);
}

require('./lib');
