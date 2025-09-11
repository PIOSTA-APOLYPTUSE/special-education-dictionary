# ⚡ 빠른 설정 가이드

## 🎯 GitHub + Vercel 자동 배포 설정

### 1️⃣ GitHub 저장소 생성

1. **[GitHub.com](https://github.com)** 접속 후 로그인
2. **"New repository"** 클릭
3. 저장소 설정:
   - **Repository name**: `special-education-dictionary`
   - **Description**: `특수교육 용어 사전 PWA 앱`
   - **Public** 선택
   - **README, .gitignore, license 추가 안함** (이미 있음)
4. **"Create repository"** 클릭

### 2️⃣ 로컬과 GitHub 연결

```bash
# 터미널에서 실행 (YOUR_USERNAME을 본인 계정명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/special-education-dictionary.git
git branch -M main
git push -u origin main
```

### 3️⃣ Vercel 자동 배포 설정

1. **[vercel.com](https://vercel.com)** 접속
2. **"Continue with GitHub"** 로 로그인
3. **"New Project"** 클릭
4. **GitHub 저장소 찾기**: `special-education-dictionary`
5. **"Import"** 클릭
6. **프로젝트 설정**:
   - Framework Preset: `Create React App`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`
7. **"Deploy"** 클릭

### 4️⃣ 완료! 🎉

✅ **배포 URL 확인**: `https://special-education-dictionary-xxx.vercel.app`
✅ **자동 배포 테스트**: 코드 수정 → commit → push → 자동 업데이트!

## 🔄 일반적인 수정 워크플로우

```bash
# 1. 코드 수정 (예: 새 용어 추가)
# src/components/SpecialEducationDictionary.jsx 편집

# 2. 변경사항 저장
git add .
git commit -m "✨ 새 용어 추가: 통합교육"
git push origin main

# 3. 자동 배포 시작! (1-2분 후 사이트 업데이트)
```

## 📱 PWA 설치 테스트

배포 완료 후:
1. **모바일**: Safari/Chrome에서 "홈 화면에 추가"
2. **데스크톱**: Chrome에서 주소창 옆 "설치" 아이콘 클릭

## 🛠️ 자주 사용할 명령어

```bash
npm start          # 로컬 개발 서버
npm run build      # 프로덕션 빌드 테스트
git status         # 변경사항 확인
git log --oneline  # 커밋 기록 확인
```

---

**문제가 있으면 GitHub Issues나 Vercel 대시보드에서 로그를 확인하세요!** 🚀