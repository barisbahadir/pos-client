# 1. Node.js imajını kullanarak uygulamayı derlemek için bir yapı aşaması oluşturuyoruz
FROM node:18 AS builder

# 2. Çalışma dizinini ayarla
WORKDIR /app

# 3. package.json ve yarn.lock dosyalarını kopyala
COPY package.json yarn.lock nginx.conf ./

# 4. Bağımlılıkları yükle
RUN yarn install

# 5. Tüm proje dosyalarını kopyala
COPY . .

# 6. React uygulamasını üretim için derle
RUN yarn build

# 7. Nginx'i kullanarak uygulamayı sunmak için ikinci aşamayı başlatıyoruz
FROM nginx:alpine

# 8. Nginx için özel konfigürasyonu kopyalayın
COPY nginx.conf /etc/nginx/nginx.conf

# 9. Derlenmiş dosyaları Nginx'in varsayılan dizinine kopyala
COPY --from=builder /app/build /usr/share/nginx/html

# 10. Nginx'i çalıştırmak için port aç
EXPOSE 80

# 11. Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"]
