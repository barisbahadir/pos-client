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
  CContainer,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { getErrorMessage } from 'src/utils/Utils'
import ApiService from 'src/ApiService'
import './AddCategory.css'
import { useNavigate, useParams } from 'react-router-dom'

const AddCategory = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Form validation schema
  const schema = yup.object().shape({
    name: yup.string().required('Kategori adı gereklidir'),
  })

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await ApiService.post('/api/category/add', {
        name: data.name,
      })

      if (response) {
        toast.success(`"${data.name}" kategorisi kaydedildi`)
        navigate('/categories')
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <CContainer className="pos-container">
      <CCard>
        <CCardHeader>
          <b>Kategori Ekle</b>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit(onSubmit)}>
            <CRow>
              <CCol xs={12} md={12} className="mb-3 mt-3">
                <CFormLabel htmlFor="name" className="d-block">
                  Kategori Adı
                </CFormLabel>
                <CFormInput id="name" type="text" {...register('name')} invalid={!!errors.name} />
                <CFormFeedback className="form-feedback">{errors.name?.message}</CFormFeedback>
              </CCol>
            </CRow>

            <center>
              <CButton type="submit" color="warning" className="m-3 w-50" disabled={isLoading}>
                Kaydet
              </CButton>
            </center>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default AddCategory
