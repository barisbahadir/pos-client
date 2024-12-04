import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCardGroup, CCol, CContainer, CRow } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import './Logout.css' // Login sayfasındaki CSS'yi dahil ediyoruz

const Logout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(5) // Geri sayım için durum

  useEffect(() => {
    toast('Çıkış yapıldı')

    // JWT'yi silmek
    dispatch({ type: 'logout' })

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
  }, [])

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center justify-content-center">
      <CContainer fluid>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup className="shadow-lg rounded-3">
              <CCard className="bg-white bg-opacity-75 p-4">
                <CCardBody>
                  <h1 className="text-center mb-4" style={{ fontSize: '2rem' }}>
                    Oturum Kapatıldı
                  </h1>
                  {loading ? (
                    <p className="text-body-secondary text-center mb-4">
                      Anasayfaya {countdown} saniye içinde yönlendirileceksiniz...
                    </p>
                  ) : (
                    <p className="text-body-secondary text-center mb-4">Başarıyla çıkış yapıldı.</p>
                  )}
                  <center>
                    <CButton color="primary" className="px-4" onClick={() => navigate('/login')}>
                      Anasayfaya Git
                    </CButton>
                  </center>
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
