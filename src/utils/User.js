export default class User {
  constructor({ /* id = null, */ email = '', role = '' } = {}) {
    // this.id = id
    this.email = email
    this.role = role
  }

  // Kullanıcıyı logout etmek için bir metot
  logout() {
    // this.id = null
    this.email = ''
    this.role = ''
  }

  // Kullanıcı bilgilerini güncellemek için bir metot
  update(details) {
    Object.assign(this, details)
  }
}
