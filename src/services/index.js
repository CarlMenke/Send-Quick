import axios from "axios";

const client = axios.create({baseURL:'http://localhost:3001/api/'})

client.interceptors.request.use(
    config =>{
        const token = localStorage.getItem('token')
        if(token){
            config.headers['authorization'] = `Bearer ${token}`
        }
        console.log(config)
        return config
    },
    (error) => {
        Promise.reject(error)
    }
)
export default client