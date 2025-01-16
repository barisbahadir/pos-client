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
import { cilLockLocked } from '@coreui/icons'
import { useDispatch } from 'react-redux'
import ApiService from 'src/ApiService'
import './Login.css'
import { toast } from 'react-toastify'
import { getErrorMessage } from 'src/utils/Utils'
import { getJwtDetails } from '../../utils/Utils'

const Login = () => {
  const [isLoading, setLoading] = useState(false)
  const [email, setEmail] = useState('bahadir')
  const [password, setPassword] = useState('bahadir')
  const [error, setError] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault() // Formun gönderilmesini engelle

    setLoading(true)
    try {
      const response = await ApiService.post('/api/auth/login', { email, password })

      // Başarılı giriş
      const { token } = response
      if (token) {
        toast.info('Hosgeldin ' + email)
        const jwtDetails = getJwtDetails(token)
        localStorage.setItem('token', token)
        dispatch({
          type: 'login',
          user: { email: response.email, role: response.role },
          token: token,
        })

        navigate('/sale') // Anasayfaya yönlendir
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
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
                      <b>BAHADIR</b> POS
                    </h1>
                    <p className="text-body-secondary text-center mb-4">Sisteme Giriş Yapın</p>
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
                      <CButton
                        type="submit"
                        color="warning"
                        className="px-4 w-100"
                        disabled={isLoading}
                      >
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
                      <CButton
                        color="light"
                        className="mt-3"
                        active
                        tabIndex={-1}
                        disabled={isLoading}
                      >
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
