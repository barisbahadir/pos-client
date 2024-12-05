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
