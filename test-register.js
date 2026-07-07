import http from 'http';

const data = JSON.stringify({
  name: "Test",
  surname: "User",
  email: "test@example.com",
  password: "password123",
  phone: "1234567890",
  role: "ADMIN_ROLE"
});

const options = {
  hostname: 'localhost',
  port: 3003,
  path: '/UrbanCentral/api/v1/users/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Response: ${responseData}`);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
