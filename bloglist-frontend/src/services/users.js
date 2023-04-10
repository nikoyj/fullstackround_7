import axios from 'axios'
const baseUrl = '/api/users'

export const getUsers = () => axios.get(baseUrl).then((res) => res.data)
