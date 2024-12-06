import { CContainer, CSpinner } from '@coreui/react'
import React from 'react'
import PropTypes from 'prop-types'

const LoadingBar = ({ showCustom = false }) => (
  <div
    className="d-flex align-items-center justify-content-center"
    style={{
      height: '100%', // CCardBody'nin tüm yüksekliğini kapla
      width: '100%', // CCardBody'nin tüm genişliğini kapla
      flexDirection: 'column', // İçeriği dikey hizalama
      minHeight: showCustom ? '200px' : '600px',
    }}
  >
    <CSpinner color="info" />
    <p style={{ marginTop: '10px', color: '#333' }}>Yükleniyor...</p>
  </div>
)

LoadingBar.propTypes = {
  showCustom: PropTypes.bool, // showBIG, boolean türünde olmalı
}

export default LoadingBar
