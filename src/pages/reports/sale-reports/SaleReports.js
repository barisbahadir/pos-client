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
import '@coreui/coreui/dist/css/coreui.min.css'
import apiService from 'src/ApiService'
import { toast } from 'react-toastify'
import LoadingBar from 'src/components/LoadingBar'
import { getErrorMessage } from 'src/utils/Utils'
import PaymentTypes from 'src/utils/PaymentTypes'

const SaleReports = () => {
  const filterStartDate = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toISOString()
    .split('T')[0]
  const filterEndDate = new Date().toISOString().split('T')[0]

  const [isLoading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [searchText, setSearchText] = useState('')
  const [startDate, setStartDate] = useState(filterStartDate)
  const [endDate, setEndDate] = useState(filterEndDate)
  const [expandedRow, setExpandedRow] = useState(null)

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const parameters = {
        searchText: searchText,
        startDate: `${startDate}T00:00:00`,
        endDate: `${endDate}T23:59:59`,
      }
      const response = await apiService.post('/api/transaction/filter', parameters)
      if (response) {
        setTransactions(response)
      }
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return isLoading ? (
    <LoadingBar />
  ) : (
    <CContainer className="pos-container">
      <CCard className="mb-4">
        <CCardHeader className="mb-4">Satış Raporları</CCardHeader>
        <CCardBody>
          <div>
            <CRow className="align-items-center mb-4">
              {/* Tarih Aralığı Seçimi */}
              <CCol md={6} className="mb-3 mb-md-0">
                <CInputGroup>
                  <CInputGroupText>Tarih Aralığı</CInputGroupText>
                  <CFormInput
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <CFormInput
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </CInputGroup>
              </CCol>

              {/* Arama ve Filtre Butonu */}
              <CCol md={4} className="mb-3 mb-md-0">
                <CFormInput
                  placeholder="Ara..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </CCol>
              <CCol md={2}>
                <CButton color="warning" className="w-100" onClick={fetchTransactions}>
                  Filtrele
                </CButton>
              </CCol>
            </CRow>

            {/* Tablo */}
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Kayit No</CTableHeaderCell>
                  <CTableHeaderCell>Satış Tarihi</CTableHeaderCell>
                  <CTableHeaderCell>Odeme Tipi</CTableHeaderCell>
                  <CTableHeaderCell>Satış Tutarı</CTableHeaderCell>
                  <CTableHeaderCell>Detay</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {transactions.map((transaction) => (
                  <React.Fragment key={transaction.id}>
                    <CTableRow>
                      <CTableDataCell>{transaction.id}</CTableDataCell>
                      <CTableDataCell>{transaction.transactionDate}</CTableDataCell>
                      <CTableDataCell>
                        {transaction.paymentType === PaymentTypes.CARD ? 'Kredi Karti' : 'Nakit'}
                      </CTableDataCell>
                      <CTableDataCell>
                        <b>{`${transaction.totalAmount} TL`}</b>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="info"
                          size="sm"
                          onClick={() =>
                            setExpandedRow(expandedRow === transaction.id ? null : transaction.id)
                          }
                        >
                          Detay
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                    {/* Expandable Satır */}
                    {expandedRow === transaction.id && (
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
                              {transaction.transactionItems.map((item, index) => (
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
                    )}
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

export default SaleReports
