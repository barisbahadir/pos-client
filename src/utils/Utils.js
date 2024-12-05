export const getErrorMessage = (err) => {
  // Hata objesinin response kısmını kontrol et
  if (err.response) {
    // Backend tarafından döndürülen hata mesajını al
    return err.response.data.message || 'Bir hata oluştu'
  }

  // Hata objesinde message varsa (örneğin ağ hatası)
  if (err.message) {
    return err.message
  }

  // Bilinmeyen bir hata
  return 'Bilinmeyen bir hata oluştu'
}

export const getFormattedDateTimeNow = () => {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0') // Aylar 0-11 arası, bu yüzden +1
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}
