import http from 'http';
import FormData from 'form-data';

const form = new FormData();
form.append('name', 'Lomo Saltado');
form.append('price', '25.50');
form.append('category', 'plato fuerte');
form.append('description', 'Delicioso');

const options = {
  hostname: 'localhost',
  port: 3003,
  path: '/UrbanCentral/api/v1/dishes/update/6a4c49c4f4a48fb954ba48f6',
  method: 'PUT',
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
