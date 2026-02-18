const http = require('http');

// Test GET /tasks
console.log('Testing GET /tasks...');
http.get('http://localhost:3001/tasks', (res) => {
  console.log(`Status: ${res.statusCode}`);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Response:', data);
    testPost();
  });
}).on('error', (err) => {
  console.error('GET Error:', err.message);
  process.exit(1);
});

// Test POST /tasks
function testPost() {
  console.log('\nTesting POST /tasks...');
  const postData = JSON.stringify({
    title: 'Test Task',
    description: 'Test Description',
    priority: 'High',
    assignedTo: 'test-dev',
    sprint: 'Sprint 1'
  });

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/tasks',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Response:', data);
      process.exit(0);
    });
  });

  req.on('error', (err) => {
    console.error('POST Error:', err.message);
    process.exit(1);
  });

  req.write(postData);
  req.end();
}
