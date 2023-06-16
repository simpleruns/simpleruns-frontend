import axios from 'axios';
export const instance = axios.create({
    // baseURL: 'https://simpleruns-backend.vercel.app/api',
    baseURL: 'http://170.64.154.214/api',
    // baseURL: 'http://localhost:4000/api',
    timeout: 50000,
    headers: { 'Access-Control-Allow-Origin': '*' }
});