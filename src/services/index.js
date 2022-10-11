import axios from "axios";
const client = axios.create({baseURL:'https://sendfast.herokuapp.com/api'})

client.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if(token){
            config.headers['authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => {Promise.reject(error)}
)

export default client