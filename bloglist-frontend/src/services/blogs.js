import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

export const getAll = () => axios.get(baseUrl).then((res) => res.data)

export const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  }
  await axios.post(baseUrl, newObject, config).then((response) => response.data)
}

export const removeBlog = (id) => {
  const config = {
    headers: { Authorization: token }
  }
  axios.delete(`${baseUrl}/${id}`, config).then((response) => response.data)
}

export const update = (newObject) => {
  const config = {
    headers: { Authorization: token }
  }
  axios
    .put(`${baseUrl}/${newObject.id}`, newObject, config)
    .then((response) => response.data)
}

export default { getAll, setToken, create, update, removeBlog }
