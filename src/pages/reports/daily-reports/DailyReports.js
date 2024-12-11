import React, { useEffect, useState } from 'react'
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CCollapse,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CContainer,
  CRow,
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
} from '@coreui/react'
import apiService from 'src/ApiService'
import { toast } from 'react-toastify'
import LoadingBar from 'src/components/LoadingBar'
import { getErrorMessage } from 'src/utils/Utils'

const DailyReports = () => {
  const filterStartDate = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toISOString()
    .split('T')[0]
  const filterEndDate = new Date().toISOString().split('T')[0]

  const [isLoading, setLoading] = useState(false)
  const [reports, setReports] = useState([])
  const [searchText, setSearchText] = useState('')
  const [startDate, setStartDate] = useState(filterStartDate)
  const [endDate, setEndDate] = useState(filterEndDate)
  // const [expandedRow, setExpandedRow] = useState(null)

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const parameters = {
        // searchText: searchText,
        startDate: `${startDate}T00:00:00`,
        endDate: `${endDate}T23:59:59`,
      }
      const response = await apiService.post('/api/reports/filter', parameters)
      if (response) {
        setReports(response)
      }
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [startDate, endDate])

  const getFormattedAmount = (amount) => (!!amount && amount > 0 ? `${amount} TL` : '-')

  return isLoading ? (
    <LoadingBar />
  ) : (
    <CContainer fluid>
      <CCard className="mb-4">
        <CCardHeader className="mb-4">Günlük Raporlar</CCardHeader>
        <CCardBody>
          <div>
            <CRow className="align-items-center">
              {/* Tarih Aralığı Seçimi */}
              <CCol md={6} className="me-auto mb-4">
                <CInputGroup>
                  <CInputGroupText>Tarih Aralığı</CInputGroupText>
                  <CFormInput
                    type="date"
                    value={startDate}
                    onChange={(e) =>
                      setStartDate(!e.target.value ? filterStartDate : e.target.value)
                    }
                  />
                  <CFormInput
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(!e.target.value ? filterEndDate : e.target.value)}
                  />
                </CInputGroup>
              </CCol>

              {/* <CCol md={4} className="ms-auto mb-4">
                <CInputGroup>
                  <CFormInput
                    disabled
                    placeholder="Ara..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <CButton
                    disabled
                    color="warning"
                    onClick={fetchTransactions}
                    className="d-flex align-items-center justify-content-center"
                  >
                    Filtrele
                  </CButton>
                </CInputGroup>
              </CCol> */}
            </CRow>

            {/* Tablo */}
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>No</CTableHeaderCell>
                  <CTableHeaderCell>Rapor Tarihi</CTableHeaderCell>
                  <CTableHeaderCell>Kartla Odemeler</CTableHeaderCell>
                  <CTableHeaderCell>Nakit Odemeler</CTableHeaderCell>
                  <CTableHeaderCell>Toplam</CTableHeaderCell>
                  {/* <CTableHeaderCell>Detay</CTableHeaderCell> */}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {reports.map((report, index) => (
                  <React.Fragment key={report.id}>
                    <CTableRow>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{report.reportDate}</CTableDataCell>
                      <CTableDataCell>{getFormattedAmount(report.cardSales)}</CTableDataCell>
                      <CTableDataCell>{getFormattedAmount(report.cashSales)}</CTableDataCell>
                      <CTableDataCell>
                        <b>{getFormattedAmount(report.totalAmount)}</b>
                      </CTableDataCell>
                      {/* <CTableDataCell>
                        <CButton
                          color="info"
                          size="sm"
                          onClick={() =>
                            setExpandedRow(expandedRow === report.id ? null : report.id)
                          }
                        >
                          Detay
                        </CButton>
                      </CTableDataCell> */}
                    </CTableRow>
                    {/* {expandedRow === report.id && (
                      <CTableRow>
                        <CTableDataCell colSpan={4}>
                          <CTable bordered>
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell>Ürün Adı</CTableHeaderCell>
                                <CTableHeaderCell>Barkod</CTableHeaderCell>
                                <CTableHeaderCell>Fiyat</CTableHeaderCell>
                                <CTableHeaderCell>Adet</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {report.transactionItems.map((item, index) => (
                                <CTableRow key={index}>
                                  <CTableDataCell>{item.productName}</CTableDataCell>
                                  <CTableDataCell>{item.barcode}</CTableDataCell>
                                  <CTableDataCell>
                                    <b>{`${item.price} TL`}</b>
                                  </CTableDataCell>
                                  <CTableDataCell>{item.quantity}</CTableDataCell>
                                </CTableRow>
                              ))}
                            </CTableBody>
                          </CTable>
                        </CTableDataCell>
                      </CTableRow>
                    )} */}
                  </React.Fragment>
                ))}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default DailyReports
