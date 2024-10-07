import axios from 'axios'

export const getAllUsers = () => {
    return axios.get('http://127.0.0.1:8000/tasks/api/v1/AngusEats/')
}