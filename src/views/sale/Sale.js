import React, { useState } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
} from '@coreui/react'
import { FaPlus, FaMinus, FaTrashAlt } from 'react-icons/fa'
import './Sale.css'

const Sale = () => {
  const productList = [
    {
      id: '1',
      name: 'Beef Burger',
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
            <CCardHeader>URUN KATEGORILERI</CCardHeader>
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
          <CCard>
            <CCardHeader>SEPET</CCardHeader>
            <CCardBody>
              {cart.length === 0 ? (
                <p>Sepete hic urun eklenmedi</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div>{item.name}</div>
                    <div>
                      <CButton onClick={() => handleChangeQuantity(item.id, 'decrease')}>
                        <FaMinus />
                      </CButton>
                      {item.quantity}
                      <CButton onClick={() => handleChangeQuantity(item.id, 'increase')}>
                        <FaPlus />
                      </CButton>
                    </div>
                    <div>{item.price * item.quantity} TL</div>
                    <CButton onClick={() => handleRemoveFromCart(item.id)} color="danger">
                      <FaTrashAlt />
                    </CButton>
                  </div>
                ))
              )}
              <div className="total">
                <span>TOPLAM: {totalAmount.toLocaleString()} TL</span>
              </div>
              <CButton color="success" className="proceed">
                SATIS YAP
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Sale
