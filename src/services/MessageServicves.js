import client from "./";

export const getMessages = async (page) => {
  try{
    const res = await client.get(`localhost something`)
    return res.data
  }catch(error){
    throw error
  }
}

export const signup = async (name,password) =>{
  try{
    const res = await client.post('users/signup',{name:name, password:password})
    localStorage.setItem('token', res.data.token)
    return res.data
  }catch(error){
    throw error
  }
}

export const login = async (name,password) =>{
  try{
    const res = await client.post('users/login',{name:name, password:password})
    localStorage.setItem('token', res.data.token)
    return res.data
  }catch(error){
    throw error
  }
}

