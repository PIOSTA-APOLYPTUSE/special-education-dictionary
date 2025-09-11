# 특수교육 용어 사전 📚

> 생활어를 전문용어로 쉽게 변환하고 법령 예문까지 확인할 수 있는 특수교육 용어 사전 앱

## ✨ 주요 기능

- **🔍 실시간 검색**: 생활어나 전문용어로 관련 정보 검색
- **⭐ 즐겨찾기**: 자주 사용하는 용어를 저장하고 관리
- **📝 사용자 용어 추가**: 나만의 용어를 추가하고 편집
- **📖 법령 예문**: 실제 법률과 공식문서에서 사용된 예문 제공
- **📱 PWA 지원**: 모바일에서 앱처럼 설치하여 사용 가능
- **💾 오프라인 지원**: 인터넷 연결 없이도 기본 기능 사용 가능

## 🚀 빠른 시작

### 1. 프로젝트 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

### 2. 앱 빌드

```bash
# 프로덕션 빌드
npm run build

# PWA용 빌드 (Service Worker 포함)
npm run build:pwa
```

### 3. 배포

#### Netlify 배포
1. [Netlify](https://netlify.com)에 가입
2. GitHub 저장소 연결
3. 빌드 명령어: `npm run build`
4. 빌드 디렉토리: `build`

#### Vercel 배포
1. [Vercel](https://vercel.com)에 가입
2. GitHub 저장소 연결
3. 자동 배포 설정 완료

#### GitHub Pages 배포
```bash
# gh-pages 패키지 설치
npm install --save-dev gh-pages

# package.json에 배포 스크립트 추가 후
npm run deploy
```

## 📱 PWA 설치 방법

### 모바일 (iOS/Android)
1. 웹 브라우저에서 앱 접속
2. **홈 화면에 추가** 또는 **앱 설치** 버튼 클릭
3. 홈 화면에서 앱 아이콘으로 실행

### 데스크톱 (Chrome/Edge)
1. 주소창 오른쪽 **설치** 아이콘 클릭
2. **설치** 버튼 클릭
3. 데스크톱에서 앱처럼 실행

## 🎯 포함된 용어 카테고리

- **장애 유형**: 언어장애, 발달장애, 지적장애, 감각장애 등
- **법제도**: 특수교육법, 운영위원회, 지원센터 관련
- **교육과정**: 기본교육과정, 전환교육, 개별화교육 등
- **평가도구**: SIS, GMFCS, 사회성 측정 등
- **교수방법**: AAC, 과제분석, 사회적 이야기 등

## 🛠️ 기술 스택

- **Frontend**: React 18, Lucide React (아이콘)
- **PWA**: Service Worker, Web App Manifest
- **Storage**: Local Storage (오프라인 데이터 저장)
- **CSS**: 커스텀 CSS (Tailwind CSS 스타일 적용)

## 📁 프로젝트 구조

```
LIVTOPRO/
├── public/
│   ├── index.html
│   ├── manifest.json          # PWA 매니페스트
│   ├── service-worker.js      # Service Worker
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── SpecialEducationDictionary.jsx
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   ├── index.css
│   ├── serviceWorkerRegistration.js
│   └── reportWebVitals.js
├── package.json
└── README.md
```

## 🔄 업데이트 방법

1. **새로운 용어 추가**
   - `src/components/SpecialEducationDictionary.jsx`의 `dictionary` 배열에 추가
   - `legalExamples` 필드에 법령 예문 추가

2. **스타일 수정**
   - `src/index.css`에서 CSS 클래스 수정
   - 컴포넌트 내부 클래스명 변경

## 📊 성능 최적화

- **코드 분할**: React.lazy를 사용한 동적 임포트
- **캐싱**: Service Worker를 통한 리소스 캐싱
- **압축**: 빌드 시 자동 압축 및 최적화
- **이미지 최적화**: WebP 형식 지원

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 기능 브랜치를 만듭니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 만듭니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원 및 문의

- **이슈 리포트**: GitHub Issues를 통해 버그나 기능 요청
- **이메일**: contact@special-education-dictionary.app
- **문서**: [Wiki](https://github.com/username/special-education-dictionary/wiki)

## 🎉 감사의 글

이 앱은 특수교육 현장의 선생님들과 학부모님들의 소중한 피드백을 바탕으로 만들어졌습니다. 
더 나은 특수교육 환경을 위해 함께 해주셔서 감사합니다! 🙏