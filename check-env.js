const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '.env');
console.log('Checking .env at:', envPath);

if (fs.existsSync(envPath)) {
    console.log('.env file exists.');
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    if (envConfig.GOOGLE_API_KEY) {
        console.log('GOOGLE_API_KEY found: Yes');
        console.log('Key length:', envConfig.GOOGLE_API_KEY.length);
        console.log('Key starts with:', envConfig.GOOGLE_API_KEY.substring(0, 5) + '...');
    } else {
        console.log('GOOGLE_API_KEY found: No');
    }
} else {
    console.log('.env file does NOT exist.');
}
