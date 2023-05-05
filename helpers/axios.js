import axios from 'axios';
export const instance = axios.create({
    baseURL: 'http://localhost:4000/api',
    timeout: 10000,
    headers: { 'Access-Control-Allow-Origin': '*' }
});