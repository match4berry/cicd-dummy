const http = require('http');
const url = require('url');

// Health check handler
const healthHandler = (req, res) => {
  const response = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Server is healthy and running'
  };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(response, null, 2));
};

// Ping handler
const pingHandler = (req, res) => {
  const response = {
    message: 'pong',
    status: 'ok'
  };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(response, null, 2));
};

// 404 handler
const notFoundHandler = (req, res) => {
  const response = {
    error: 'Endpoint not found',
    status: 'error',
    available_endpoints: ['/health', '/ping']
  };

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(response, null, 2));
};

// Request router
const requestHandler = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Log the request
  console.log(`${new Date().toISOString()} - ${method} ${path}`);

  // Route handling
  if (method === 'GET') {
    switch (path) {
      case '/health':
        healthHandler(req, res);
        break;
      case '/ping':
        pingHandler(req, res);
        break;
      default:
        notFoundHandler(req, res);
    }
  } else {
    // Method not allowed
    const response = {
      error: 'Method not allowed',
      status: 'error',
      allowed_methods: ['GET']
    };
    
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response, null, 2));
  }
};

// Create and start server
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'localhost';

const server = http.createServer(requestHandler);

server.listen(PORT, HOST, () => {
  console.log('🚀 Server starting...');
  console.log(`📍 Server running at http://${HOST}:${PORT}`);
  console.log('📍 Available endpoints:');
  console.log('   GET /health - Health check');
  console.log('   GET /ping   - Ping endpoint');
  console.log('\n💡 Test with:');
  console.log(`   curl http://${HOST}:${PORT}/health`);
  console.log(`   curl http://${HOST}:${PORT}/ping`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});