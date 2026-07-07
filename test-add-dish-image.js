import http from 'http';
import FormData from 'form-data';
import fs from 'fs';

const form = new FormData();
form.append('name', 'Platillo con Imagen');
form.append('price', '20.00');
form.append('category', 'postre');
form.append('description', 'Test add with image');

// Create a dummy image
fs.writeFileSync('dummy.jpg', Buffer.from('fake image content'));
form.append('image', fs.createReadStream('dummy.jpg'));

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
