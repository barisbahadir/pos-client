import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CRow,
  CCol,
  CFormFeedback,
  CFormSelect,
  CContainer,
  CInputGroupText,
  CInputGroup,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const AddProduct = () => {
  const [imageBase64, setImageBase64] = useState(null)

  // Form validation schema
  const schema = yup.object().shape({
    productName: yup.string().required('Ürün adı gereklidir'),
    barcode: yup.string().required('Barkod gereklidir'),
    price: yup
      .number()
      .typeError('Geçerli bir fiyat girin')
      .positive('Fiyat pozitif olmalı')
      .required('Fiyat gereklidir'),
    stockQuantity: yup
      .number()
      .min(1, 'Stok miktarı en az 1 olmalıdır')
      .required('Stok miktarı gereklidir'),
    image: yup.mixed().notRequired('Resim gereklidir'),
  })

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  })

  // Handle form submission
  const onSubmit = (data) => {
    const formData = {
      ...data,
      image: imageBase64, // Base64 encoded image
    }
    console.log('Form Data:', formData)
    // Veritabanına veya API'ye gönderim işlemi yapılabilir
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageBase64(reader.result)
        setValue('image', reader.result) // Set image in form data
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <CContainer className="pt-3">
      <CCard>
        <CCardHeader>
          <b>Ürün Ekle</b>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit(onSubmit)}>
            <CRow className="mb-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="productName">Ürün Adı</CFormLabel>
                <CFormInput
                  id="productName"
                  type="text"
                  {...register('productName')}
                  invalid={!!errors.productName}
                />
                <CFormFeedback>{errors.productName?.message}</CFormFeedback>
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="price">Fiyat</CFormLabel>
                <CInputGroup>
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput
                    id="price"
                    type="number"
                    step="0.01"
                    {...register('price')}
                    invalid={!!errors.price}
                  />
                </CInputGroup>
                <CFormFeedback>{errors.price?.message}</CFormFeedback>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="barcode">Barkod</CFormLabel>
                <CFormInput
                  id="barcode"
                  type="text"
                  {...register('barcode')}
                  invalid={!!errors.barcode}
                />
                <CFormFeedback>{errors.barcode?.message}</CFormFeedback>
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="stockQuantity">Stok Miktarı</CFormLabel>
                <CFormInput
                  id="stockQuantity"
                  type="number"
                  {...register('stockQuantity')}
                  invalid={!!errors.stockQuantity}
                />
                <CFormFeedback>{errors.stockQuantity?.message}</CFormFeedback>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol xs={12}>
                <CFormLabel htmlFor="image">Ürün Resmi</CFormLabel>
                <CFormInput
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  invalid={!!errors.image}
                />
                <CFormFeedback>{errors.image?.message}</CFormFeedback>
              </CCol>
            </CRow>

            <center>
              <CButton type="submit" color="warning" className="mt-3 w-25">
                Kaydet
              </CButton>
            </center>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default AddProduct
