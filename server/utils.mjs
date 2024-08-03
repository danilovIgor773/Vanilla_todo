export const _handleCORSSetup = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true;
  }

  return false;
};

export const _incrementTaskId = (tasks) => {
  return `${tasks.length ? Math.max(...tasks.map(t => +t.id)) + 1 : 1}`;
};

export const _handleNotAllowedMethod = (req, res) => {
  res.writeHead(405, {'Content-type': 'text/plain'});
  res.end('Method Not Allowed');
};
