import path from 'node:path';

export const PORT = 3000;
export const STATIC_DIR = path.resolve('client');
export const DATA_DIR = path.resolve('data');
export const TASKS_FILE = 'tasks.json';

export const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  default: 'application/octet-stream'
};
