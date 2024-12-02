import React, { useEffect, useRef, useState } from 'react'
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
} from '@coreui/react'
import './Sale.css'
import { FaShoppingCart } from 'react-icons/fa'

const Sale = () => {
  const productList = [
    {
      id: '1',
      name: 'Beef Burger Beef Burger Beef Burger Beef Burger Beef Burger Beef Burger Beef Burger',
      price: 45.5,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmgtKUXwKdnc0oTPL-EYE5cexEXHJ3nW20g&s',
    },
    {
      id: '2',
      name: 'Sandwich',
      price: 32,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmgtKUXwKdnc0oTPL-EYE5cexEXHJ3nW20g&s',
    },
    {
      id: '3',
      name: 'Iced Matcha Latte',
      price: 22,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmgtKUXwKdnc0oTPL-EYE5cexEXHJ3nW20g&s',
    },
    {
      id: '4',
      name: 'Cinnamon Roll',
      price: 20.99,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmgtKUXwKdnc0oTPL-EYE5cexEXHJ3nW20g&s',
    },
    {
      id: '5',
      name: 'Choco Glaze',
      price: 16,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmgtKUXwKdnc0oTPL-EYE5cexEXHJ3nW20g&s',
    },
    {
      id: '6',
      name: 'Choco Glaze 2',
      price: 5.75,
      imageUrl: '',
    },
    {
      id: '7',
      name: 'Beef Burger Beef Burger Beef Burger Beef Burger Beef Burger Beef Burger Beef Burger',
      price: 45.5,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmgtKUXwKdnc0oTPL-EYE5cexEXHJ3nW20g&s',
    },
    {
      id: '8',
      name: 'Sandwich',
      price: 32,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmgtKUXwKdnc0oTPL-EYE5cexEXHJ3nW20g&s',
    },
    {
      id: '9',
      name: 'Iced Matcha Latte',
      price: 22,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmgtKUXwKdnc0oTPL-EYE5cexEXHJ3nW20g&s',
    },
    {
      id: '10',
      name: 'Cinnamon Roll',
      price: 20.99,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmgtKUXwKdnc0oTPL-EYE5cexEXHJ3nW20g&s',
    },
    {
      id: '11',
      name: 'Choco Glaze',
      price: 16,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmgtKUXwKdnc0oTPL-EYE5cexEXHJ3nW20g&s',
    },
    {
      id: '0',
      name: 'Ozel Fiyatli Urun',
      price: 1.0,
      imageUrl: '',
    },
  ]

  const categories = ['Okul Kiyafetleri', 'Defterler', 'Kirtasiye', 'Oyuncak', 'Hediyelik Esya']

  const [cart, setCart] = useState([])
  const [products] = useState(productList)
  const [selectedCategory, setSelectedCategory] = useState('Okul Kiyafetleri')

  const [showFastPriceModal, setShowFastPriceModal] = useState(false)
  const [fastPriceValue, setFastPriceValue] = useState('')
  const inputRef = useRef(null) // Input'a referans oluşturduk

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
  }

  const handleFastPriceProduct = (price) => {
    const product = {
      id: Math.random(),
      name: price + ' TL Fiyatli Urun',
      price: price,
      imageUrl: '',
    }
    const cardItem = { ...product, quantity: 1 }

    handleAddToCart(cardItem)
  }

  const handleAddToCart = (product) => {
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
  }

  const handleRemoveFromCart = (id) => {
    console.log('triggered')
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      // '+' tuşuna basıldığında modal'ı aç
      if (e.key === '+') {
        setShowFastPriceModal(true)
      }
      // 'Enter' tuşuna basıldığında modal'ı kapat
      if (e.key === 'Enter') {
        handleSubmit()
      }
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
      inputRef.current?.focus() // Input'a odaklan
    }
  }, [showFastPriceModal])

  const handleSubmit = () => {
    if (!!fastPriceValue) {
      const numberValue = Number(fastPriceValue)
      handleFastPriceProduct(isNaN(numberValue) ? 1 : numberValue)
    }
    setShowFastPriceModal(false) // Modal'ı kapat
    setFastPriceValue('')
  }

  return (
    <CContainer fluid>
      <CRow sm={{ gutterX: 3 }}>
        <CCol sm="3">
          <CCard>
            <CCardHeader>Kategoriler</CCardHeader>
            <CCardBody className="category-panel">
              <div className="d-flex flex-column gap-2">
                {categories.map((category, index) => (
                  <CButton
                    key={index}
                    className="category-label"
                    style={{
                      cursor: 'pointer',
                      padding: '10px',
                      borderRadius: '5px',
                      backgroundColor: selectedCategory === category ? '#007bff' : '#f0f0f0', // Seçili kategori rengi
                      color: selectedCategory === category ? 'white' : '#333',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                    onClick={() => handleCategoryClick(category)} // Kategori tıklandığında state değişecek
                  >
                    {category}
                  </CButton>
                ))}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm="6">
          <CCard>
            <CCardHeader>Ürünler</CCardHeader>
            <CCardBody>
              <div className="product-items">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="product-card"
                    onClick={() => handleAddToCart(product)}
                  >
                    <div className="product-content">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="product-image" />
                      ) : (
                        <div className="product-image-placeholder"></div> // Resim yoksa bu divi göster
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
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm="3">
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
                  {/* Mesaj */}
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
              <CRow>
                <CCol>
                  <CButton
                    color="info"
                    className="w-100 mt-3"
                    onClick={() => setShowFastPriceModal(true)}
                  >
                    Hizli Fiyat Ekle
                  </CButton>
                </CCol>
              </CRow>
              <CRow className="fw-bold mt-2" sm={{ gutterX: 2 }}>
                <CCol xs="4">
                  <CButton
                    color="warning"
                    className="w-100"
                    disabled={cart.length === 0}
                    onClick={() => setCart([])}
                  >
                    Sil
                  </CButton>
                </CCol>
                <CCol xs="8" className="text-end">
                  <CButton color="success" className="w-100" disabled={cart.length === 0}>
                    SATIS YAP
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
        onClose={() => setShowFastPriceModal(false)}
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
              <CButton color="warning" onClick={() => setShowFastPriceModal(false)}>
                Kapat
              </CButton>
            </CCol>
            <CCol xs="8" className="text-end">
              <CButton color="info" onClick={() => handleSubmit()}>
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
