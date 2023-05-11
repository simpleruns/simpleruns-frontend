import axios from 'axios';
export const instance = axios.create({
    // baseURL: 'https://simpleruns-backend.vercel.app/api',
    baseURL: 'http://170.64.154.214/api',
    timeout: 10000,
    headers: { 'Access-Control-Allow-Origin': '*' }
});