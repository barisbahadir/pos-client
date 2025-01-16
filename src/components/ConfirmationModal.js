import React from 'react'
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react'
import PropTypes from 'prop-types'

const ConfirmationModal = ({
  visible,
  onConfirm,
  onCancel,
  title = 'Onay',
  message = 'Bu işlemi yapmak istediğinizden emin misiniz?',
  confirmText = 'Evet',
  cancelText = 'Hayır',
  isLoading = false,
}) => {
  return (
    <CModal visible={visible} onClose={onCancel} alignment="center">
      <CModalHeader>{title}</CModalHeader>
      <CModalBody>{message}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onCancel} disabled={isLoading}>
          {cancelText}
        </CButton>
        <CButton color="danger" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Lütfen bekleyin...' : confirmText}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

ConfirmationModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  isLoading: PropTypes.bool,
}

export default ConfirmationModal
