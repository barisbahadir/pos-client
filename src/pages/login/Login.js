import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useDispatch } from 'react-redux'
import ApiService from '../../ApiService'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('zeliha')
  const [password, setPassword] = useState('zeliha')
  const [error, setError] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault() // Formun gönderilmesini engelle

    try {
      const response = await ApiService.post('/api/auth/login', { email, password }) // email kullanıyoruz

      // Başarılı giriş
      const { token } = response
      if (token) {
        // Token'ı localStorage'a kaydediyoruz
        localStorage.setItem('token', token)

        dispatch({ type: 'login', token: token }) // Redux store'a token'ı kaydet
        navigate('/sale') // Anasayfaya yönlendir
      }
    } catch (err) {
      // Hata mesajını ekranda gösteriyoruz
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Login failed!')
      } else {
        setError('An error occurred. Please try again.')
      }
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center justify-content-center">
      <CContainer fluid>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup className="shadow-lg rounded-3">
              <CCard className="bg-white bg-opacity-75 p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1 className="text-center mb-4" style={{ fontSize: '2rem' }}>
                      Giris Yap
                    </h1>
                    <p className="text-body-secondary text-center mb-4">Sisteme giriş yapın</p>
                    {error && <div className="alert alert-danger text-center">{error}</div>}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        placeholder="E-Mail"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // email'i güncelliyoruz
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Şifre"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <div className="d-grid">
                      <CButton type="submit" color="warning" className="px-4 w-100">
                        Giriş Yap
                      </CButton>
                    </div>
                    {/* <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="warning" className="px-4 w-100">
                          Giriş Yap
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Şifreni mi unuttun?
                        </CButton>
                      </CCol>
                    </CRow> */}
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-info py-5">
                <CCardBody className="text-center">
                  <div>
                    <h2 className="text-white mb-3">Kaydol</h2>
                    <p>Sisteme kaydolup, uygulamayı hızlıca kullanmaya başlayabilirsiniz.</p>
                    <Link to="/register">
                      <CButton color="light" className="mt-3" active tabIndex={-1}>
                        Hızla Kaydol!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
