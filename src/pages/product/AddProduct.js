import React, { useEffect, useState } from 'react'
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
  CTooltip,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../../utils/Utils'
import ApiService from '../../ApiService'
import { AiOutlineBarcode, AiOutlineDollar } from 'react-icons/ai'
import { FaBarcode } from 'react-icons/fa'
import './AddProduct.css'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

const AddProduct = () => {
  const navigate = useNavigate()

  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [imageBase64, setImageBase64] = useState(null)
  const [categories, setCategories] = useState([]) // Kategorileri tutan state

  // Form validation schema
  const schema = yup.object().shape({
    productName: yup.string().required('Ürün adı gereklidir'),
    category: yup.string().required('Kategori seçimi gereklidir'),
    barcode: yup.string().required('Barkod gereklidir'),
    price: yup
      .number()
      .typeError('Geçerli bir fiyat girin')
      .positive('Fiyat pozitif olmalı')
      .required('Fiyat gereklidir'),
    stockQuantity: yup
      .number()
      .transform((value, originalValue) =>
        typeof originalValue === 'string' && originalValue.trim() === '' ? undefined : value,
      )
      .min(1, 'Stok miktarı en az 1 olmalıdır')
      .notRequired('Stok miktarı gereklidir'),
    image: yup.mixed().notRequired('Resim gereklidir'),
  })

  // API'den kategorileri alma
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        setLoading(true)
        const response = await ApiService.get('/api/category/list')
        if (response != null && response != undefined && Array.isArray(response)) {
          setCategories(response)
          console.log(response)
        }
      } catch (err) {
        toast.error('Kategori listesi getirilirken bir hata olustu!' + getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      stockQuantity: 1,
    },
  })

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true)

    const parameters = {
      name: data.productName,
      barcode: data.barcode,
      price: data.price,
      stockQuantity: data.stockQuantity,
      image: imageBase64,
      category: {
        id: Number(data.category) || 1,
      },
    }

    try {
      const response = await ApiService.post('/api/product/add', parameters)

      if (response) {
        toast.success(`"${data.productName}" urunu kaydedildi`)
        navigate('/products')
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
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
    <CContainer className="pt-3" style={{ maxWidth: '800px' }}>
      <CCard>
        <CCardHeader>
          <b>Ürün Ekle</b>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit(onSubmit)}>
            <CRow>
              <CCol xs={12} md={6} className="mb-3">
                <CFormLabel htmlFor="productName" className="d-block">
                  Ürün Adı
                </CFormLabel>
                <CFormInput
                  id="productName"
                  type="text"
                  {...register('productName')}
                  invalid={!!errors.productName}
                />
                <CFormFeedback className="form-feedback">
                  {errors.productName?.message}
                </CFormFeedback>
              </CCol>
              <CCol xs={12} md={6} className="mb-3">
                <CFormLabel htmlFor="price" className="d-block">
                  Fiyat
                </CFormLabel>
                <CInputGroup>
                  <CInputGroupText>
                    <b>TL</b>
                  </CInputGroupText>
                  <CFormInput
                    id="price"
                    type="number"
                    step="0.01"
                    {...register('price')}
                    invalid={!!errors.price}
                  />
                </CInputGroup>
                <CFormFeedback className="form-feedback">{errors.price?.message}</CFormFeedback>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol xs={12} md={6} className="mb-3">
                <CFormLabel htmlFor="category">Kategori</CFormLabel>
                <CFormSelect
                  id="category"
                  {...register('category')}
                  invalid={!!errors.category}
                  disabled={isLoading}
                >
                  <option value="">Seçiniz..</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </CFormSelect>
                <CFormFeedback className="form-feedback">{errors.category?.message}</CFormFeedback>
              </CCol>
              <CCol xs={12} md={6} className="mb-3">
                <CFormLabel htmlFor="barcode" className="d-block">
                  Barkod
                </CFormLabel>
                <CInputGroup>
                  <CInputGroupText>
                    <FaBarcode size="1.5em" />
                  </CInputGroupText>
                  <CFormInput
                    id="barcode"
                    type="text"
                    {...register('barcode')}
                    invalid={!!errors.barcode}
                  />
                </CInputGroup>
                <CFormFeedback className="form-feedback">{errors.barcode?.message}</CFormFeedback>
              </CCol>
            </CRow>

            <CRow>
              <CCol xs={12} md={6} className="mb-3">
                <div className="mb-3">
                  <CFormLabel htmlFor="stockQuantity" className="d-block">
                    Stok Miktarı
                  </CFormLabel>
                  <CFormInput
                    id="stockQuantity"
                    type="number"
                    {...register('stockQuantity')}
                    min={1}
                    invalid={!!errors.stockQuantity}
                  />
                  <CFormFeedback className="form-feedback">
                    {errors.stockQuantity?.message}
                  </CFormFeedback>
                </div>

                <CFormLabel htmlFor="image" className="d-block">
                  Ürün Resmi
                </CFormLabel>
                <div className="mb-3 d-flex align-items-center">
                  <CFormInput
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    invalid={!!errors.image}
                    className="me-2"
                  />
                  <CTooltip content="Urun Resmini Sil">
                    <CButton
                      onClick={() => {
                        setImageBase64()
                        // setValue('image', '')
                      }}
                      style={{
                        backgroundColor: 'white', // Buton beyaz
                        border: '1px solid #ccc', // Buton çerçevesi gri
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTooltip>
                  <CFormFeedback className="form-feedback">{errors.image?.message}</CFormFeedback>
                </div>
              </CCol>

              <CCol xs={12} md={6} className="mb-3">
                {/* Yüklenmiş resmi gösteren alan */}
                <CFormLabel className="d-block">Resim Önizleme</CFormLabel>
                <div
                  style={{
                    border: '1px solid #ced4da',
                    borderRadius: '5px',
                    padding: '10px',
                    height: '150px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f9fa',
                  }}
                >
                  {imageBase64 ? (
                    <img
                      src={imageBase64}
                      alt="Yüklenen Resim"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <span style={{ color: '#6c757d' }}>Resim seçilmedi</span>
                  )}
                </div>
              </CCol>
            </CRow>

            <center>
              <CButton type="submit" color="warning" className="mt-3 w-25" disabled={isLoading}>
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
