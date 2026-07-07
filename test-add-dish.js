import http from 'http';
import FormData from 'form-data';

const form = new FormData();
form.append('name', 'Nuevo Platillo');
form.append('price', '15.00');
form.append('category', 'entrada');
form.append('description', 'Test add');

const options = {
  hostname: 'localhost',
  port: 3003,
  path: '/UrbanCentral/api/v1/dishes/add',
  method: 'POST',
  headers: form.getHeaders()
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

form.pipe(req);
