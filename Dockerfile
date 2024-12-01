# 1. Node.js'in resmi bir sürümünü temel alıyoruz
FROM node:18 AS builder

# 2. Çalışma dizinini ayarla
WORKDIR /app

# 3. package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# 4. Projenin bağımlılıklarını kur
RUN npm install

# 5. Proje dosyalarını kopyala
COPY . .

# 6. Üretim için projeyi derle
RUN npm run build

# 7. Hafif bir Nginx imajını kullanarak build dizinini sun
FROM nginx:alpine

# 9. Derlenmiş dosyaları Nginx'in varsayılan dizinine kopyala
COPY --from=builder /app/dist /usr/share/nginx/html

# 10. Nginx'i çalıştır
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
