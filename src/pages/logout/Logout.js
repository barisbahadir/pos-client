import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCardGroup, CCol, CContainer, CRow } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

const Logout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(5) // Geri sayım için durum

  useEffect(() => {
    // JWT'yi silmek
    dispatch({ type: 'logout' })
  }, [])

  useEffect(() => {
    // Geri sayımı başlat
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval) // Geri sayım bittiğinde arayı kes
          setLoading(false) // Yükleniyor durumu sona eriyor
          navigate('/login') // 5 saniye sonra login sayfasına yönlendir
        }
        return prev - 1
      })
    }, 1000) // Her 1 saniyede bir geri sayımı 1 azalt

    return () => clearInterval(countdownInterval) // Temizleme işlemi
  }, [navigate])

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <h1>Oturumunuz Kapatildi</h1>
                  {loading ? (
                    <p className="text-body-secondary">
                      Anasayfaya {countdown} saniye icinde yonlendirileceksiniz...
                    </p>
                  ) : (
                    <p className="text-body-secondary">Basariyla cikis yapildi.</p>
                  )}
                  <CButton color="primary" className="px-4" onClick={() => navigate('/login')}>
                    Anasayfaya Git
                  </CButton>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Logout
