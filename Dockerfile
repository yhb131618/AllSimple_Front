# Node.js 버전 지정
FROM node:20 AS build
# Build stage
FROM node:18 AS build

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json (있다면) 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production

# 소스 코드 복사
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

