import client from "./";

export const getMessages = async (page) => {
  try{
      const res = await client.get(`localhost something`)
      return res.data
  } catch (error) {
    throw error
  }
}

