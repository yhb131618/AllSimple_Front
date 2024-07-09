# Node.js 버전 지정
FROM node:18 AS build

# 앱 디렉토리 생성 및 설정
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy the rest of the application code
COPY . .


# 애플리케이션 빌드
RUN npm run build

# production 환경에서 실행할 최종 이미지
FROM nginx:1.21.5-alpine

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 애플리케이션 파일 복사
COPY --from=build /app/build /usr/share/nginx/html

# 포트 노출
EXPOSE 80

# 컨테이너 시작 시 Nginx 실행
CMD ["nginx", "-g", "daemon off;"]

