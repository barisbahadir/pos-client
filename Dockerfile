# 1. Node.js'in resmi bir sürümünü temel alıyoruz
FROM node:18 AS builder

# 2. Çalışma dizinini ayarla
WORKDIR /app

# 3. package.json ve yarn.lock dosyalarını kopyala
COPY package.json yarn.lock ./

# 4. Projenin bağımlılıklarını kur
RUN yarn install

# 5. Proje dosyalarını kopyala
COPY . .

# 6. Üretim için projeyi derle
RUN yarn build

# 7. Hafif bir Nginx imajını kullanarak build dizinini sun
FROM nginx:alpine

# 8. Derlenmiş dosyaları Nginx'in varsayılan dizinine kopyala
COPY --from=builder /app/dist /usr/share/nginx/html

# 9. Nginx'i çalıştır
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
