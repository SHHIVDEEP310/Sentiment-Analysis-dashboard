import axios from 'axios'

// Empty string = use Vite proxy (same origin, no CORS)
const BASE_URL = ''

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log('API Error:', err.response?.status, err.response?.data)
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const register = (email, password) =>
  api.post('/auth/register', { email, password })

export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password })
  localStorage.setItem('token', res.data.access_token)
  return res.data
}

export const logout = () => {
  localStorage.removeItem('token')
}

export const isAuthenticated = () => !!localStorage.getItem('token')

export const predict = (text) =>
  api.post('/predict', { text })

export const getHistory = (page = 1, pageSize = 20) =>
  api.get('/history', { params: { page, page_size: pageSize } })

export const getStats = () =>
  api.get('/stats')

export default api