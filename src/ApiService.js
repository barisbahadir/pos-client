import axios from 'axios'

// Ortam değişkeni ile API URL'ini alıyoruz
const API_URL = 'https://pos-api.up.railway.app'

// Axios instance'ı oluşturuyoruz
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token geçerliliğini kontrol eden fonksiyon
const getAuthToken = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    return null
  }
  // Burada token geçerliliği kontrol edilebilir (örneğin expiration date)
  return token
}

// JWT token'ı header'a ekleyen bir interceptor ekliyoruz
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
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
    // Hata kodu 401 veya 403 ise kullanıcıyı giriş sayfasına yönlendirebiliriz
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Token geçersiz veya süresi dolmuşsa, kullanıcıyı login sayfasına yönlendirebiliriz.
      localStorage.removeItem('token')
      window.location.href = '/logout'
    } else if (error.response && error.response.status === 500) {
      // Sunucu hatasında kullanıcıyı bilgilendirebiliriz
      // alert('Something went wrong on the server, please try again later.')
    }
    return Promise.reject(error)
  },
)

// Dinamik bir API istek fonksiyonu
const request = async (method, url, data = {}, params = {}) => {
  try {
    const response = await api({
      method,
      url,
      data,
      params,
    })
    return response.data
  } catch (error) {
    throw error
  }
}

const ApiService = {
  get: (url, params = {}) => request('get', url, {}, params),
  post: (url, data) => request('post', url, data),
  put: (url, data) => request('put', url, data),
  delete: (url) => request('delete', url),
}

export default ApiService
