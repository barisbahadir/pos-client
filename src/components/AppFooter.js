import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1">2025 - Tum haklari saklidir. </span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by BARIS BAHADIR SAVUR</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
