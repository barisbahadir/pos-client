import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  theme: 'light',
  sidebarUnfoldable: true,
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
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
