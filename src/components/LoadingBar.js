import { CSpinner } from '@coreui/react'
import React from 'react'

import IconsImg from 'src/assets/images/icons.webp'

const LoadingBar = () => (
  <div
    className="d-flex align-items-center justify-content-center"
    style={{
      height: '100%', // CCardBody'nin tüm yüksekliğini kapla
      width: '100%', // CCardBody'nin tüm genişliğini kapla
      flexDirection: 'column', // İçeriği dikey hizalama
      minHeight: '200px',
    }}
  >
    <CSpinner color="primary" />
    <p style={{ marginTop: '10px', color: '#333' }}>Yükleniyor...</p>
  </div>
)

export default LoadingBar
