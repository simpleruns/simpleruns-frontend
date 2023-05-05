import axios from 'axios';
export const instance = axios.create({
    baseURL: 'https://170.64.154.214/api',
    timeout: 10000,
    headers: { 'Access-Control-Allow-Origin': '*' }
});