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

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()

    // // Mock bir doğrulama işlemi
    // if (username === 'admin' && password === 'password') {
    //   const mockToken = 'mock-jwt-token' // Gerçek bir API'de backend'den gelir
    //   dispatch({ type: 'login', token: mockToken }) // Redux store'a token'ı kaydet
    //   navigate('/') // Anasayfaya yönlendir
    // } else {
    //   alert('Kullanıcı adı veya şifre yanlış!') // Basit bir hata mesajı
    // }

    // Mock bir doğrulama işlemi
    const mockToken = 'mock-jwt-token' // Gerçek bir API'de backend'den gelir
    dispatch({ type: 'login', token: mockToken }) // Redux store'a token'ı kaydet
    navigate('/sale') // Anasayfaya yönlendir
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center justify-content-center">
      <CContainer>
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
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Kullanıcı Adı"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                    <CRow>
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
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-info py-5" style={{ width: '44%' }}>
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
