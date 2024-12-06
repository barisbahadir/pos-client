import React, { useState } from 'react'
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

// Rastgele ürün verisi oluşturma fonksiyonu
const generateRandomItems = (n) => {
  const items = []

  for (let i = 0; i < n; i++) {
    const index = i + 1
    const randomItem = {
      name: 'Urun ' + index + ' ismi',
      id: index,
      barcode: Math.random().toString(36).substr(2, 9),
      price: (Math.random() * 1000).toFixed(2),
      stockQuantity: Math.floor(Math.random() * 1000) + 1,
      orderValue: 1,
      image: 'https://i0.shbdn.com/photos/54/97/64/x5_1209549764jar.jpg',
    }
    items.push(randomItem)
  }

  return items
}

const ItemCards = () => {
  const [items, setItems] = useState(generateRandomItems(12))

  // Kartların sırasını değiştirme fonksiyonu
  const onDragEnd = (result) => {
    const { destination, source } = result
    if (!destination) return // Bırakma alanı yoksa işlem yapma

    if (destination.index === source.index) return // Aynı yerde bırakma yapılırsa işlem yapma

    const reorderedItems = Array.from(items)
    const [movedItem] = reorderedItems.splice(source.index, 1) // Taşınan öğeyi çıkar
    reorderedItems.splice(destination.index, 0, movedItem) // Taşınan öğeyi yeni konumda ekle

    console.log('Yeni siralanmis items: \n' + reorderedItems.map((c) => `\n Urun ${c.id}`))

    setItems(reorderedItems) // Yeni sıralamayı set et
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
              <CButton color="warning" className="mt-3 w-100">
                Sıralamayı Kaydet
              </CButton>
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
                  {items.map((item, index) => (
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
                            paddingRight: '12px',
                            background: '#fff',
                            gap: '10px',
                            // boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                          }}
                        >
                          {/* Sürükleme İkonu */}
                          <div
                            {...provided.dragHandleProps}
                            style={{
                              fontSize: '24px',
                              cursor: 'grab',
                              color: '#black',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '10px',
                            }}
                          >
                            ⋮⋮
                          </div>

                          {/* Resim */}
                          <div
                            style={{
                              maxWidth: '130px',
                              maxHeight: '150px',
                              overflow: 'hidden',
                              border: '1px solid #ddd',
                              borderRadius: '10px',
                            }}
                          >
                            <CImage
                              src={item.image}
                              alt={item.name}
                              fluid
                              style={{
                                objectFit: 'cover',
                                width: '100%',
                                height: '100%',
                              }}
                            />
                          </div>

                          {/* Yazılar */}
                          <div style={{ flex: '1', overflow: 'hidden' }}>
                            <p
                              style={{
                                fontSize: '15px',
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

                          {/* Butonlar */}
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
