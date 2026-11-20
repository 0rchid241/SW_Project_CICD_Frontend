# 서경인사이드 — Community Frontend

SW 전문인재양성 팀 프로젝트에서 개발한 커뮤니티 웹 서비스의 React 프론트엔드입니다.

게시판 탐색, 게시글 작성, 회원 관리 및 관리자 화면을 중심으로 구성했으며, Spring Boot 백엔드와 분리하여 개발했습니다.

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Framework | React |
| Build Tool | Vite |
| Routing | React Router |
| UI | Material UI (MUI), Emotion |
| Language | JavaScript |
| CI/CD | GitLab CI, Docker |

## 주요 화면 구성

### 게시판 및 게시글

- 게시판 목록 및 개별 게시판 화면
- 인기 게시글 목록
- 게시글 상세·작성·수정 페이지
- 사용자 프로필 페이지

### 회원 관련 화면

- 로그인 및 회원가입 페이지
- Google·Naver·Kakao OAuth 가입 관련 페이지
- 마이페이지
- OAuth 인증 결과 화면

### 관리자 화면

- 전체 관리자 대시보드
- 커뮤니티 관리자 대시보드
- 서비스 운영 관련 페이지

## 애플리케이션 구조

React Router를 사용해 서비스의 주요 화면을 라우트별로 분리했습니다.

게시판 화면에는 중첩 라우팅을 적용하여 개별 게시판 안에서 게시글 목록, 작성, 상세 및 수정 페이지를 구성했습니다.

Material UI 기반 다크 테마와 공통 레이아웃을 사용해 화면 스타일을 구성했습니다.

## 로컬 실행

Node.js와 npm이 설치된 환경에서 실행할 수 있습니다.

```bash
npm install
npm run dev
```

프로덕션용 빌드:

```bash
npm run build
```

ESLint 검사:

```bash
npm run lint
```

백엔드 API와 연동되는 화면은 해당 백엔드 실행 환경이 필요합니다.

## CI/CD

GitLab CI와 Docker를 이용한 프론트엔드 이미지 빌드 구성이 포함되어 있으며, 배포 관련 설정은 별도 Deploy 저장소에서 관리합니다.

## 관련 저장소

- [Community Backend](https://github.com/0rchid241/SW_Project_CICD_Backend)
- [Community Deploy](https://github.com/0rchid241/SW_Project_CICD_Deploy)
