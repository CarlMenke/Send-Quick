import axios from 'axios';
const client = axios.create({ baseURL: 'https://sendfast.herokuapp.com/api' });

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['authorization'] = `Bearer ${token}`;
      config.headers['withCredentials'] = true;
      config.headers["'Access-Control-Allow-Origin'"] =
        'https://sendfast.herokuapp.com';
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default client;
