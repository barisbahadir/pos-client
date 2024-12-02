import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import '../scss/App.css'

// routes config
import routes from '../routes'

const AppContent = () => {
  return (
    <CContainer className="px-4" fluid>
      <Suspense
        fallback={
          <div className="loading-overlay">
            <div className="loading-spinner">
              <CSpinner color="info" />
            </div>
          </div>
        }
      >
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="home" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
