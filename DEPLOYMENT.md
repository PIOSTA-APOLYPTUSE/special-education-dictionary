# 🚀 배포 가이드

## GitHub + Vercel 자동 배포 설정

### 1단계: GitHub 저장소 생성

```bash
# Git 초기화 (이미 완료)
git init

# 파일 추가
git add .
git commit -m "🎉 Initial commit: Special Education Dictionary App"

# GitHub에 저장소 생성 후
git remote add origin https://github.com/[USERNAME]/special-education-dictionary.git
git branch -M main
git push -u origin main
```

### 2단계: Vercel 배포 설정

#### 방법 A: Vercel 웹사이트에서 설정 (추천)

1. **[vercel.com](https://vercel.com)** 접속
2. **GitHub 계정으로 로그인**
3. **"New Project"** 클릭
4. **GitHub 저장소 선택**
5. **Deploy** 클릭 ✅

#### 방법 B: CLI로 설정

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 프로젝트 배포
vercel --prod
```

### 3단계: 자동 배포 확인

✅ **이제 다음과 같이 자동 배포됩니다:**

- **main 브랜치 push** → 자동으로 프로덕션 배포
- **다른 브랜치 push** → 미리보기 배포
- **Pull Request** → 미리보기 링크 자동 생성

## 🔄 수정 및 업데이트 워크플로우

### 일반적인 수정 작업

```bash
# 1. 코드 수정
# src/components/SpecialEducationDictionary.jsx 파일 수정

# 2. 변경사항 커밋
git add .
git commit -m "✨ 새로운 용어 추가: 통합교육"

# 3. GitHub에 푸시 (자동 배포 트리거)
git push origin main
```

### 새로운 기능 개발

```bash
# 1. 새 브랜치 생성
git checkout -b feature/새기능

# 2. 코드 개발 및 커밋
git add .
git commit -m "🚧 새 기능 개발 중"

# 3. GitHub에 푸시 (미리보기 배포 생성)
git push origin feature/새기능

# 4. Pull Request 생성
# GitHub에서 PR 생성 → 미리보기 링크 자동 생성

# 5. main으로 머지 (프로덕션 배포)
git checkout main
git merge feature/새기능
git push origin main
```

## 📊 배포 상태 모니터링

### Vercel 대시보드에서 확인 가능한 것들:
- ✅ 배포 성공/실패 상태
- 📈 성능 메트릭
- 🔍 에러 로그
- 📱 모바일/데스크톱 미리보기

### GitHub Actions에서 확인 가능한 것들:
- 🧪 테스트 결과
- 🏗️ 빌드 성공/실패
- 💡 Lighthouse 성능 점수

## ⚡ 빠른 수정 시나리오

### 📝 용어 추가하기

```javascript
// src/components/SpecialEducationDictionary.jsx
const dictionary = [
  // 기존 용어들...
  {
    id: 새ID,
    livingWord: "새로운 생활어",
    professionalTerm: "새로운 전문용어",
    category: "카테고리",
    definition: "정의 설명",
    examples: ["예시1", "예시2"],
    legalExamples: ["법령 예문"]
  }
];
```

```bash
git add .
git commit -m "✨ 용어 추가: 새로운 용어"
git push origin main
# → 자동 배포! 🚀
```

### 🎨 디자인 수정하기

```css
/* src/index.css */
.bg-blue-500 { 
  background-color: #새로운색상; 
}
```

```bash
git add .
git commit -m "🎨 UI 색상 변경"
git push origin main
# → 자동 배포! 🚀
```

## 🔧 유용한 명령어들

```bash
# 로컬 개발 서버 실행
npm start

# 프로덕션 빌드 테스트
npm run build

# Vercel 로컬 테스트
npm run dev

# 직접 배포 (수동)
npm run deploy

# 코드 품질 검사
npm run lint

# 테스트 실행
npm test
```

## 🌟 프로 팁

### 1. **브랜치 전략**
```bash
main        # 프로덕션 (자동 배포)
develop     # 개발용 (미리보기 배포)
feature/*   # 기능 개발 (미리보기 배포)
hotfix/*    # 긴급 수정
```

### 2. **커밋 메시지 규칙**
```bash
✨ feat: 새 기능 추가
🐛 fix: 버그 수정
📚 docs: 문서 수정
🎨 style: UI/스타일 변경
♻️ refactor: 코드 리팩토링
🧪 test: 테스트 추가
```

### 3. **환경 변수 설정**
Vercel 대시보드에서:
- Settings → Environment Variables
- `REACT_APP_VERSION` 등 추가 가능

## 🚨 트러블슈팅

### 배포 실패 시
1. **Vercel 대시보드** → Functions 탭에서 에러 로그 확인
2. **GitHub Actions** → 실패한 워크플로우 확인
3. **로컬에서 빌드 테스트**: `npm run build`

### 성능 이슈 시
1. **Lighthouse 점수 확인**
2. **번들 사이즈 분석**: `npm run build` 후 결과 확인
3. **이미지 최적화** 및 **코드 분할** 적용

이제 코드만 수정하고 push하면 자동으로 배포됩니다! 🎉