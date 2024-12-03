import axios from 'axios'

// Ortam değişkeni ile API URL'ini alıyoruz
const API_URL = process.env.REACT_APP_API_URL // .env dosyasındaki REACT_APP_API_URL

// Axios instance'ı oluşturuyoruz
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// JWT token'ı header'a ekleyen bir interceptor ekliyoruz
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Yanıtları işlemek için interceptor ekliyoruz (hata yönetimi)
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Hata kodu 401 ise kullanıcıyı giriş sayfasına yönlendirebiliriz
    if (error.response && error.response.status === 401) {
      // Token geçersiz veya süresi dolmuşsa, kullanıcıyı login sayfasına yönlendirebiliriz.
      localStorage.removeItem('jwt_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

const ApiService = {
  get: (url, params = {}) => api.get(url, { params }),
  post: (url, data) => api.post(url, data),
  put: (url, data) => api.put(url, data),
  delete: (url) => api.delete(url),
}

export default ApiService
