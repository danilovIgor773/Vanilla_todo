import * as fs from 'node:fs';
import * as http from "node:http";
import * as path from "node:path";
import { _handleCORSSetup, _incrementTaskId, _handleNotAllowedMethod } from "./utils.mjs";
import { PORT, STATIC_DIR, DATA_DIR, TASKS_FILE, MIME_TYPES } from './config.mjs';

const getTodoTasks = async () => {
  const data = await fs.promises.readFile(path.join(DATA_DIR, TASKS_FILE), 'utf8');
  console.log('[getTodoTasks] data', data);
  return JSON.parse(data);
};

const handleGetTasks = async (req, res) => {
  const { url, method } = req;
  if (url === '/tasks' && method === 'GET') {
    const tasks = await getTodoTasks();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(tasks));
  }
};

const handleCreateTask = async (req, res) => {
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    const task = JSON.parse(body);
    const currentTasksList = await getTodoTasks();
    task.id = _incrementTaskId(currentTasksList);

    currentTasksList.push(task);

    await fs.promises.writeFile(path.join(DATA_DIR, TASKS_FILE), JSON.stringify(currentTasksList, null, 2));

    res.writeHead(201, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(currentTasksList));
  });
};

const handleDeleteTask = async (req, res) => {
  const taskId = parseInt(req.url.split('/').pop());

  let tasks = await getTodoTasks();
  tasks = tasks.filter(task => task.id !== taskId);
  console.log('[HEREhandleDeleteTask] TASKS', tasks);

  await fs.promises.writeFile(path.join(DATA_DIR, TASKS_FILE), JSON.stringify(tasks, null, 2));

  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(tasks));
};

const getFile = async (filePath) => {
  const fullPath = path.join(STATIC_DIR, filePath);

  try {
    const data = await fs.promises.readFile(fullPath);
    const contentType = MIME_TYPES[path.extname(filePath)] || MIME_TYPES.default;
    return { data, contentType, status: 200 };
  } catch (error) {
    const notFoundPath = path.join(STATIC_DIR, '404.html');
    const data = await fs.promises.readFile(notFoundPath);
    return { data, contentType: 'text/html', status: 404 };
  }
}

const server = http.createServer(async (req, res) => {
  const isCORSHandled = _handleCORSSetup(req, res);
  if(isCORSHandled) return;

  if (req.url.startsWith('/tasks')) {
    if(req.method === 'GET') {
      await handleGetTasks(req, res);
    } else if(req.method === 'POST') {
      await handleCreateTask(req, res);
    }  else if(req.method === 'DELETE') {
      await handleDeleteTask(req, res);
    } else {
      _handleNotAllowedMethod();
    }
  } else if (req.method === 'GET') {
    const filePath = req?.url === '/' ? '/index.html' : req?.url;
    const { data, contentType, status } = await getFile(filePath);
    res.writeHead(status, { 'Content-Type': contentType });
    res.end(data);
  } else {
    _handleNotAllowedMethod();
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
