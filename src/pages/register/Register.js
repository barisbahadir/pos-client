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
import ApiService from '../../ApiService'
import './Register.css'
import { toast } from 'react-toastify'

const Register = () => {
  // Form verilerini state olarak yönetiyoruz
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Kayıt işlemi
  const handleRegister = async (e) => {
    setError('')
    e.preventDefault()

    // Şifre ve şifre tekrarı kontrolü
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.')
      return
    }

    try {
      // Kayıt isteği
      const response = await ApiService.post('/api/auth/register', {
        email,
        password,
      })

      // Başarılı kayıt durumunda yönlendirme
      if (response) {
        toast.success('Kaydiniz basariyla olusturuldu')
        navigate('/login') // Giriş sayfasına yönlendir
      }
    } catch (err) {
      setError(getErrorMessage(err))
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
                  <CForm onSubmit={handleRegister}>
                    <h1 className="text-center mb-4" style={{ fontSize: '2rem' }}>
                      <b>BAHADIR</b> POS
                    </h1>
                    <p className="text-body-secondary text-center mb-4">Hesabınızı Oluşturun</p>
                    {error && <div className="alert alert-danger text-center">{error}</div>}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Şifre"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Şifreyi Tekrarla"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <div className="d-grid">
                      <CButton color="warning" type="submit">
                        Hesap Oluştur
                      </CButton>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-info py-5">
                <CCardBody className="text-center">
                  <div>
                    <h2 className="text-white mb-3">Zaten Hesabınız Var mı?</h2>
                    <p>Giriş yaparak hesabınıza erişebilirsiniz.</p>
                    <Link to="/login">
                      <CButton color="light" className="mt-3" active tabIndex={-1}>
                        Giriş Yap!
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

export default Register
