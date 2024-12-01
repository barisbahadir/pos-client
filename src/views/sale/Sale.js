import React, { useState } from 'react'
import { CContainer, CRow, CCol, CButton, CCard, CCardBody, CCardHeader } from '@coreui/react'
import './Sale.css'

const Sale = () => {
  const productList = [
    {
      id: '1',
      name: 'Beef Burger Beef Burger Beef Burger Beef Burger Beef Burger Beef Burger Beef Burger',
      price: 45000,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmgtKUXwKdnc0oTPL-EYE5cexEXHJ3nW20g&s',
    },
    {
      id: '2',
      name: 'Sandwich',
      price: 32000,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmgtKUXwKdnc0oTPL-EYE5cexEXHJ3nW20g&s',
    },
    {
      id: '3',
      name: 'Iced Matcha Latte',
      price: 22000,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmgtKUXwKdnc0oTPL-EYE5cexEXHJ3nW20g&s',
    },
    {
      id: '4',
      name: 'Cinnamon Roll',
      price: 20000,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmgtKUXwKdnc0oTPL-EYE5cexEXHJ3nW20g&s',
    },
    {
      id: '5',
      name: 'Choco Glaze',
      price: 16000,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmgtKUXwKdnc0oTPL-EYE5cexEXHJ3nW20g&s',
    },
    {
      id: '6',
      name: 'Choco Glaze 2',
      price: 16000,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmgtKUXwKdnc0oTPL-EYE5cexEXHJ3nW20g&s',
    },
  ]

  const [cart, setCart] = useState([])
  const [products] = useState(productList)

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

  return (
    <CContainer>
      {/* <CRow>
        <CCard>
          <CCardHeader>URUN KATEGORILERI</CCardHeader>
          <CCardBody>Kategoriler gelecek</CCardBody>
        </CCard>
      </CRow> */}
      <CRow>
        <CCol sm="2">
          <CCard>
            <CCardHeader>Kategoriler</CCardHeader>
            <CCardBody>Kategoriler gelecek</CCardBody>
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
                    <img src={product.imageUrl} alt={product.name} className="product-image" />
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <div className="product-price">{product.price.toLocaleString()} TL</div>
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

        {/* Sağ Panel (Sepet) */}
        <CCol sm="4">
          <CCard className="cart-panel">
            <CCardHeader>Sepet</CCardHeader>
            <CCardBody>
              {cart.length === 0 ? ( // Sepet boşsa gösterilecek mesaj
                <div className="empty-cart-message">
                  <center>Sepete hicbir urun eklenmedi!</center>
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
                          <div className="item-price">{item.price} $</div>
                        </div>
                        <div className="item-controls">
                          <button onClick={() => handleDecrement(item.id)}>-</button>
                          <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                          <button onClick={() => handleIncrement(item.id)}>+</button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CCardBody>
            <div className="cart-footer">
              <CRow>
                <CCol xs="6">VERGISIZ TOPLAM:</CCol>
                <CCol xs="6" className="text-end">
                  {subTotal.toFixed(2)} TL
                </CCol>
              </CRow>
              <CRow>
                <CCol xs="6">VERGI (%10):</CCol>
                <CCol xs="6" className="text-end">
                  {tax.toFixed(2)} TL
                </CCol>
              </CRow>
              <CRow className="fw-bold">
                <CCol xs="6">TOPLAM:</CCol>
                <CCol xs="6" className="text-end">
                  {total.toFixed(2)} TL
                </CCol>
              </CRow>
              <CButton color="primary" className="w-100 mt-3" disabled={cart.length === 0}>
                SATIS YAP
              </CButton>
            </div>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Sale
