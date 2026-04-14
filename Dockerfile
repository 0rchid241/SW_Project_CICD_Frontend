# 빌드환경
FROM node:24.14-alpine AS build
WORKDIR /app

# 의존성 설치 (캐싱 활용을 위해 package.json 먼저 복사)
COPY package.json package-lock.json ./
RUN npm install

# 소스 복사 및 빌드
COPY . .
RUN npm run build




# 실행 환경
# nginx에서 실행
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
