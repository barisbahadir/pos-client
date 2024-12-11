import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CModalFooter,
  CFormInput,
  CModalBody,
  CModalHeader,
  CModal,
  CTooltip,
} from '@coreui/react'
import './Sale.css'
import { FaShoppingCart } from 'react-icons/fa'
import ApiService from 'src/ApiService'
import LoadingBar from 'src/components/LoadingBar'
import { toast } from 'react-toastify'
import { AiOutlineBarcode } from 'react-icons/ai'
import { getErrorMessage, getFormattedDateTimeNow } from 'src/utils/Utils'
import CIcon from '@coreui/icons-react'
import { cilCash, cilCreditCard } from '@coreui/icons'
import PaymentTypes from '../../utils/PaymentTypes'

const Sale = () => {
  const [isLoading, setLoading] = useState(false)
  const [isSaveLoading, setSaveLoading] = useState(false)
  const [data, setData] = useState([])

  const [selectedCategoryId, setSelectedCategoryId] = useState(1)
  const [showFastPriceModal, setShowFastPriceModal] = useState(false)
  const [fastPriceValue, setFastPriceValue] = useState('')
  const [barcode, setBarcode] = useState('')
  const modalRef = useRef(null)
  const barcodeRef = useRef(null)

  const [cart, setCart] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await ApiService.get('/api/category/list')
        if (response != null && response != undefined && Array.isArray(response)) {
          setData(response)

          if (response[0]) {
            setSelectedCategoryId(response[0].id)
          }
        }
      } catch (err) {
        toast.error(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  function getProductsByCategoryId(id) {
    if (id !== undefined && data != undefined && data.length > 0) {
      const filteredData = data.filter((cat) => cat.id === id)

      if (
        filteredData !== undefined &&
        Array.isArray(filteredData) &&
        filteredData[0] !== undefined &&
        Array.isArray(filteredData[0].products)
      ) {
        return filteredData[0].products || []
      }
    }

    return []
  }

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId)
  }

  const handleFastPriceProduct = (price) => {
    const product = {
      id: Math.random(),
      name: `${price} TL Fiyatli Urun`,
      price: price,
      barcode: `CUSTOM-${price}`,
    }
    const cardItem = { ...product, quantity: 1 }

    handleAddToCart(cardItem)
  }

  const handleAddToCart = useCallback(
    (product) => {
      const existingProduct = cart.find((item) => item.id === product.id)
      if (existingProduct) {
        setCart(
          cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        )
      } else {
        setCart([...cart, { ...product, quantity: 1 }])
      }
    },
    [cart],
  )

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const handleChangeQuantity = (id, action) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: action === 'increase' ? item.quantity + 1 : item.quantity - 1,
            }
          : item,
      ),
    )
  }

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const calculateTotal = () => {
    const subTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
    const tax = 0
    return { subTotal, tax, total: subTotal + tax }
  }

  const { subTotal, tax, total } = calculateTotal()

  const handleInputChange = (e) => {
    setFastPriceValue(e.target.value)
  }

  const handleFastPriceModalShow = (show) => {
    if (show === true) {
      setFastPriceValue('')
      setShowFastPriceModal(true)
    } else {
      setShowFastPriceModal(false)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      // '+' tuşuna basıldığında modal'ı aç
      if (e.key === '+') {
        handleFastPriceModalShow(true)
      }
      // // 'Enter' tuşuna basıldığında modal'ı kapat
      // if (e.key === 'Enter') {
      //   handleSubmit(fastPriceValue)
      // }
    }

    // Sayfa genelinde tuşları dinlemeye başla
    window.addEventListener('keydown', handleKeyDown)

    // Bileşen unmount olduğunda event listener'ı kaldır
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Modal açıldığında input'a odaklanmak
  useEffect(() => {
    if (showFastPriceModal) {
      setTimeout(() => {
        modalRef.current?.focus() // Input'a odaklan
      }, 300) // Modal'ın görünür olmasından sonra 100ms bekleyin
    }
  }, [showFastPriceModal])

  useEffect(() => {
    barcodeRef.current?.focus()
  }, [barcode])

  const handleBarcodeChange = (e) => {
    setBarcode(e.target.value)
  }

  const handleBarcodeSubmit = () => {
    const numberValue = Number(barcode)
    handleFastPriceProduct(isNaN(numberValue) ? 1 : numberValue)
    setBarcode('') // Barkodu okuduktan sonra inputu temizle
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBarcodeSubmit()
    }
  }

  const handleCustomProductAdd = () => {
    const numberValue = Number(fastPriceValue)
    handleFastPriceProduct(isNaN(numberValue) ? 1 : numberValue)
    handleFastPriceModalShow(false) // Modal'ı kapat
  }

  const handleSaveTransaction = async (paymentType) => {
    setSaveLoading(true)
    try {
      const cardData = {
        paymentType: paymentType,
        transactionDate: getFormattedDateTimeNow(),
        transactionItems: cart.map((c) => {
          const item = {
            productName: c.name,
            price: c.price,
            quantity: c.quantity,
          }

          return item
        }),
      }

      const response = await ApiService.post('/api/transaction/add', cardData)

      if (response) {
        toast.success(`${total.toFixed(2)} TL tutarindaki alisveris sisteme kaydedildi.`)
        setCart([])
      }
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaveLoading(false)
    }
  }

  return (
    <CContainer fluid>
      <CRow className="g-3">
        <CCol md="3">
          <CCard className="mb-3">
            <CCardHeader>Barkod Oku</CCardHeader>
            <CCardBody>
              <div className="d-flex align-items-center">
                <CFormInput
                  ref={barcodeRef}
                  type="text"
                  value={barcode}
                  disabled={isSaveLoading}
                  onChange={handleBarcodeChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Barkod okutunuz."
                  className="me-2" // Sağda boşluk bırakır
                />
                <CTooltip content="Tüm ürünleri listele">
                  <CButton
                    style={{
                      backgroundColor: 'white', // Buton beyaz
                      border: '1px solid #ccc', // Buton çerçevesi gri
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AiOutlineBarcode color="darkgray" size="20px" /> {/* Koyu gri ikon */}
                  </CButton>
                </CTooltip>
              </div>
            </CCardBody>
          </CCard>
          <CCard>
            <CCardHeader>Kategoriler</CCardHeader>
            <CCardBody className="category-panel">
              {isLoading ? (
                <LoadingBar showCustom />
              ) : (
                <>
                  <div className="d-flex flex-column gap-2">
                    {data.map((category) => (
                      <CButton
                        key={Math.random()}
                        className="category-label"
                        style={{
                          cursor: 'pointer',
                          padding: '10px',
                          borderRadius: '5px',
                          backgroundColor:
                            selectedCategoryId === category.id ? '#007bff' : '#f0f0f0', // Seçili kategori rengi
                          color: selectedCategoryId === category.id ? 'white' : '#333',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                        }}
                        onClick={() => handleCategoryClick(category.id)} // Kategori tıklandığında state değişecek
                      >
                        {category.name}
                      </CButton>
                    ))}
                  </div>
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md="6">
          <CCard>
            <CCardHeader>Ürünler</CCardHeader>
            <CCardBody className="product-panel">
              {isLoading ? (
                <LoadingBar showCustom />
              ) : getProductsByCategoryId(selectedCategoryId).length > 0 ? (
                <div className="product-items">
                  {getProductsByCategoryId(selectedCategoryId).map((product) => (
                    <div
                      key={product.id} // Math.random yerine ürün ID'si kullanmak daha doğru olur
                      className="product-card"
                      onClick={() => handleAddToCart(product)}
                    >
                      <div className="product-content">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="product-image" />
                        ) : (
                          <div className="product-image-placeholder"></div>
                        )}
                        <div className="product-info">
                          <div className="product-name">{product.name}</div>
                          <div className="product-price">{product.price.toLocaleString()} TL</div>
                        </div>
                      </div>
                      <div className="add-to-cart-overlay">
                        <button className="add-to-cart">Sepete Ekle</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-products">Kategoriye eklenmiş hiçbir ürün yok</div>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md="3">
          <CCard className="cart-panel">
            <CCardHeader>Sepet</CCardHeader>
            <CCardBody>
              {cart.length === 0 ? ( // Sepet boşsa gösterilecek mesaj
                <div
                  className="empty-cart-message"
                  style={{ position: 'relative', textAlign: 'center', height: '100%' }}
                >
                  {/* Sepet ikonu */}
                  <FaShoppingCart
                    size={50} // İkonun boyutunu büyütüyoruz
                    color="#d1d1d4" // İkonu gri yapıyoruz
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)', // Ortalamak için
                    }}
                  />
                </div>
              ) : (
                <div>
                  {cart
                    .slice()
                    .reverse()
                    .map((item) => (
                      <div key={item.id} className="cart-item">
                        <div className="item-info">
                          <div className="item-name">{item.name}</div>
                          <div className="item-price">{item.price} TL</div>
                        </div>
                        <div className="item-controls">
                          <button
                            onClick={() => {
                              item.quantity === 1
                                ? handleRemoveFromCart(item.id)
                                : handleChangeQuantity(item.id, 'decrease')
                            }}
                          >
                            -
                          </button>
                          <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                          <button onClick={() => handleChangeQuantity(item.id, 'increase')}>
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CCardBody>
            <div className="cart-footer">
              {/* <CRow>
                <CCol xs="6">VERGISIZ TOPLAM:</CCol>
                <CCol xs="6" className="text-end">
                  {subTotal.toFixed(2)} TL
                </CCol>
              </CRow> */}
              {/* <CRow className="m-1 mt-0 mb-2">
                <CFormInput
                  ref={barcodeRef}
                  type="text"
                  value={barcode}
                  onChange={handleBarcodeChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Barkod giriniz veya okuyunuz..."
                />
              </CRow> */}
              <CRow>
                <CCol xs="6">VERGI:</CCol>
                <CCol xs="6" className="text-end">
                  {(total / 10).toFixed(2)} TL
                </CCol>
              </CRow>
              <CRow className="fw-bold">
                <CCol xs="6">TOPLAM:</CCol>
                <CCol xs="6" className="text-end">
                  {total.toFixed(2)} TL
                </CCol>
              </CRow>
              {/* <CRow>
                <CCol>
                  <CButton
                    color="info"
                    className="w-100 mt-3"
                    disabled={isSaveLoading}
                    onClick={() => handleFastPriceModalShow(true)}
                  >
                    Hizli Fiyat Ekle
                  </CButton>
                </CCol>
              </CRow> */}
              <CRow className="fw-bold mt-2" xs={{ gutterX: 2 }}>
                <CCol xs="6">
                  <CButton
                    color="danger"
                    className="w-100"
                    disabled={cart.length === 0 || isSaveLoading}
                    onClick={() => setCart([])}
                  >
                    Sepeti Bosalt
                  </CButton>
                </CCol>
                <CCol xs="6">
                  <CButton
                    color="info"
                    className="w-100"
                    disabled={isSaveLoading}
                    onClick={() => handleFastPriceModalShow(true)}
                  >
                    Hizli Fiyat
                  </CButton>
                </CCol>
              </CRow>
              <CRow className="fw-bold mt-2" xs={{ gutterX: 2 }}>
                <CCol xs="6">
                  <CButton
                    color="success"
                    className="w-100 d-flex align-items-center justify-content-center"
                    style={{ height: '50px' }} // Yükseklik ayarı
                    disabled={cart.length === 0 || isSaveLoading}
                    onClick={() => handleSaveTransaction(PaymentTypes.CASH)}
                  >
                    <CIcon icon={cilCash} className="me-2" /> {/* Nakit için ikon */}
                    Nakit
                  </CButton>
                </CCol>
                <CCol xs="6">
                  <CButton
                    color="warning"
                    className="w-100 d-flex align-items-center justify-content-center"
                    style={{ height: '50px' }} // Yükseklik ayarı
                    disabled={cart.length === 0 || isSaveLoading}
                    onClick={() => handleSaveTransaction(PaymentTypes.CARD)}
                  >
                    <CIcon icon={cilCreditCard} className="me-2" /> {/* Kart için ikon */}
                    Kredi Kartı
                  </CButton>
                </CCol>
              </CRow>
            </div>
          </CCard>
        </CCol>
      </CRow>

      <CModal
        alignment="center"
        visible={showFastPriceModal}
        onClose={() => handleFastPriceModalShow(false)}
        aria-labelledby="VerticallyCenteredExample"
        backdrop="static"
      >
        <CModalHeader closeButton>Hızlı Fiyat Girişi</CModalHeader>
        <CModalBody>
          <div>
            <label htmlFor="priceInput">Urun fiyatini giriniz:</label>
            <CFormInput
              id="priceInput"
              value={fastPriceValue}
              onChange={handleInputChange}
              placeholder="Fiyat girin"
              ref={modalRef}
              type="number"
              step="0.01" // Ondalık sayılara izin verir
              min="0" // Negatif sayılara izin vermez
            />
          </div>
          {fastPriceValue && (
            <div style={{ marginTop: '20px', fontSize: '30px' }}>
              <strong>Girilen Fiyat: {fastPriceValue} TL</strong>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CRow className="fw-bold">
            <CCol xs="4">
              <CButton color="warning" onClick={() => handleFastPriceModalShow(false)}>
                Kapat
              </CButton>
            </CCol>
            <CCol xs="8" className="text-end">
              <CButton color="info" onClick={() => handleCustomProductAdd()}>
                Urun Ekle
              </CButton>
            </CCol>
          </CRow>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default Sale
