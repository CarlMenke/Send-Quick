import client from "./";

export const getMessages = async (page) => {
  try{
      const res = await client.get(`localhost something`)
      return res.data
  } catch (error) {
    throw error
  }
}

export const signup = async (name,password) =>{
  try {
    const res = await client.post('users/signup',{name:name, password:password})
    console.log(res.data)
    return res.data
  }catch (error){
    throw error
  }
}

