const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const content = 'GOOGLE_API_KEY=AIzaSyBC1Bp3UkvFPaM6imB69teuWcOm1obJhIc';

fs.writeFileSync(envPath, content, 'utf8');
console.log('Fixed .env file encoding.');
