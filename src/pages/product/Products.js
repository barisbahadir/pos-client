import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CImage,
  CRow,
  CCol,
  CButton,
  CContainer,
} from '@coreui/react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import apiService from '../../ApiService'
import { toast } from 'react-toastify'
import LoadingBar from '../../components/LoadingBar'

import defaultProduct from './../../assets/images/product.png'
import { getErrorMessage } from '../../utils/Utils'
import { useNavigate } from 'react-router-dom'

const ItemCards = () => {
  const navigate = useNavigate()

  const [isLoading, setLoading] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState()

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    const filteredData = categories.filter((cat) => cat.id === selectedCategoryId)
    if (
      filteredData !== undefined &&
      Array.isArray(filteredData) &&
      filteredData[0] !== undefined &&
      Array.isArray(filteredData[0].products)
    ) {
      setProducts(filteredData[0].products)
    }
  }, [selectedCategoryId])

  // API'den kategorileri alma
  // Kategorileri getiren fonksiyon
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await apiService.get('/api/category/list')
      if (response != null && response != undefined && Array.isArray(response)) {
        setCategories(response)

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

  // useEffect ile sayfa ilk yüklediğinde çalıştırılacak
  useEffect(() => {
    fetchCategories() // Sayfa yüklendiğinde kategori listesi alınıyor
  }, []) // Boş bağımlılık dizisi, sadece bir kez çalışmasını sağlar

  // Manuel tetikleme için bir buton
  const handleManualFetch = async () => {
    await fetchCategories() // Kullanıcı butona tıkladığında da kategori listesini al
  }

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId)
  }

  // Kartların sırasını değiştirme fonksiyonu
  const onDragEnd = (result) => {
    const { destination, source } = result
    if (!destination) return // Bırakma alanı yoksa işlem yapma

    if (destination.index === source.index) return // Aynı yerde bırakma yapılırsa işlem yapma

    const reorderedItems = Array.from(products)
    const [movedItem] = reorderedItems.splice(source.index, 1) // Taşınan öğeyi çıkar
    reorderedItems.splice(destination.index, 0, movedItem) // Taşınan öğeyi yeni konumda ekle

    setProducts(reorderedItems) // Yeni sıralamayı set et
  }

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true)

    const parameters = {
      categoryId: selectedCategoryId,
      orderedValues: products.map((p, i) => {
        const prod = {
          id: p.id,
          orderValue: i + 1,
        }
        return prod
      }),
    }

    try {
      const response = await apiService.post('/api/product/order-update', parameters)

      if (response) {
        toast.success(`Urunlerin siralamasi kaydedildi`)
        // navigate('/home')
      }
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
      await fetchCategories()
    }
  }

  return (
    <CContainer className="pos-container">
      <CRow>
        {/* Sol Kolon */}
        <CCol md="5">
          <CCard className="mb-3">
            <CCardHeader>
              <b>Urunler</b>
            </CCardHeader>
            <CCardBody>
              Satis ekraninda gosterilecek siralamayi belirleyebilir ve asagidaki Siralamayi Kaydet
              butonuyla degistirdiginiz siralamayi kaydedebilirsiniz.
              <CButton
                color="warning"
                className="mt-3 w-100"
                onClick={onSubmit}
                disabled={isLoading}
              >
                Sıralamayı Kaydet
              </CButton>
            </CCardBody>
          </CCard>
          <CCard className="mb-3">
            <CCardHeader>Kategoriler</CCardHeader>
            <CCardBody className="category-panel">
              {isLoading ? (
                <LoadingBar />
              ) : (
                <>
                  <div className="d-flex flex-column gap-2">
                    {categories.map((category) => (
                      <CButton
                        key={category.id}
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

        {/* Sağ Kolon */}
        <CCol md="7">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="vertical">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {products.map((item, index) => (
                    <Draggable key={item.id} draggableId={`item-${item.id}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #ddd',
                            borderRadius: '15px',
                            padding: '10px',
                            paddingRight: '15px',
                            background: '#ffffffd1',
                            gap: '10px',
                            // boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                          }}
                        >
                          <div
                            {...provided.dragHandleProps}
                            style={{
                              fontSize: '24px',
                              cursor: 'grab',
                              color: '#080a0c',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '10px',
                              paddingLeft: '8px',
                              paddingRight: '6px',
                            }}
                          >
                            ⋮⋮
                          </div>
                          <div
                            style={{
                              width: '120px',
                              height: '100px',
                              overflow: 'hidden',
                              border: '1px solid #ddd',
                              borderRadius: '10px',
                              backgroundColor: '#ffffffd1', // Gri arka plan
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <CImage
                              src={!!item.image ? item.image : defaultProduct}
                              alt={item.name}
                              style={{
                                objectFit: 'contain', // Görüntüyü çerçeveye orantılı sığdır
                                maxWidth: '100%',
                                maxHeight: '100%',
                              }}
                            />
                          </div>

                          {/* Yazılar */}
                          <div style={{ flex: '1', overflow: 'hidden' }}>
                            <p
                              style={{
                                fontSize: '15px',
                                color: '#080a0c',
                                margin: 0,
                                marginBottom: '5px',
                                fontWeight: 'bold',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                WebkitLineClamp: 2, // Maksimum 2 satırda sınırlama
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {item.name}
                            </p>
                            <p style={{ margin: 0, color: '#888', fontSize: '15px' }}>
                              Fiyat: <b>{item.price}</b> TL
                            </p>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                            }}
                            className="d-md-flex justify-content-md-end"
                          >
                            <CButton
                              color="info"
                              size="sm"
                              onClick={() =>
                                console.log(item.id + ' edit button clicked: ' + item.name)
                              }
                            >
                              Düzenle
                            </CButton>
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() =>
                                console.log(item.id + ' delete button clicked: ' + item.name)
                              }
                            >
                              Sil
                            </CButton>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ItemCards
