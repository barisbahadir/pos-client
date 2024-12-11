import jwt_decode from 'jwt-decode'

export const isJwtTokenValid = (token) => {
  if (!token) return false

  try {
    const decoded = jwt_decode(token)
    const expirationTime = decoded.exp * 1000 // Exp zamanını milisaniye cinsinden al
    const currentTime = Date.now()

    return currentTime < expirationTime // Geçerli mi?
  } catch (error) {
    console.error('Token çözülürken hata oluştu:', error)
    return false
  }
}

export const getJwtDetails = (token) => {
  if (!token) return null

  try {
    const decoded = jwt_decode(token)
    console.log(decoded)
    return decoded
  } catch (error) {
    console.error('Token detaylari getirilirken hata oluştu:', error)
    return null
  }
}

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

// EAN-13 barkod numarasını hesaplayan yardımcı fonksiyon
const calculateCheckDigit = (barcode) => {
  let total = 0

  // 12 basamağı sırayla al ve toplamı hesapla
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(barcode[i], 10)
    if (i % 2 === 0) {
      total += digit // Tek basamaklar (0, 2, 4, ...) 1 ile çarpılır
    } else {
      total += digit * 3 // Çift basamaklar (1, 3, 5, ...) 3 ile çarpılır
    }
  }

  // Denetim rakamını hesapla
  const checkDigit = (10 - (total % 10)) % 10
  return checkDigit
}

// EAN-13 barkod numarasını üreten fonksiyon
export const generateBarcodeNumber = () => {
  let barcode = ''

  // 12 basamağı rastgele oluştur
  for (let i = 0; i < 12; i++) {
    barcode += Math.floor(Math.random() * 10) // 0-9 arasında rastgele sayı
  }

  // Denetim rakamını hesapla
  const checkDigit = calculateCheckDigit(barcode)

  // EAN-13 numarasını oluştur (12 basamak + 1 check digit)
  return barcode + checkDigit
}
