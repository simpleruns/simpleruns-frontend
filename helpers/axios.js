
import axios from 'axios';
console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
if (process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: '.env' });
} else {
    require('dotenv').config({ path: '.env.development' });
}
console.log(process.env.BACKEND_SERVER_URL);
export const instance = axios.create({
    // baseURL: 'https://simpleruns-backend.vercel.app/api',
    // baseURL: 'http://170.64.154.214/api',
    baseURL: process.env.BACKEND_SERVER_URL,
    timeout: 50000,
    headers: { 'Access-Control-Allow-Origin': '*' }
});