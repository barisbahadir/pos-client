import { legacy_createStore as createStore } from 'redux'

import User from '../src/utils/User'

const initialState = {
  sidebarShow: true,
  theme: 'light',
  sidebarUnfoldable: false,
  user: new User(), // Kullanıcı bilgileri için User sınıfı
  token: localStorage.getItem('token') || null, // Token durumu
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'login': // Oturum açma işlemi
      localStorage.setItem('token', rest.token)
      return { ...state, token: rest.token }
    case 'logout': // Oturum kapatma işlemi
      localStorage.removeItem('token')
      return { ...state, token: null }
    case 'updateUser': {
      const updatedUser = { ...state.user }
      updatedUser.update(rest.details) // Kullanıcı bilgilerini güncelle
      return { ...state, user: updatedUser }
    }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
