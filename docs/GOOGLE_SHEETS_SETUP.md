# 구글 시트 연동 설정 가이드

챗봇의 상담 로그를 구글 시트에 자동으로 저장하기 위한 설정 가이드입니다.

## 1단계: 구글 클라우드 프로젝트 설정
1. [Google Cloud Console](https://console.cloud.google.com/)에서 새 프로젝트 생성 (예: `natural-med-bot`).
2. **"Google Sheets API"** 검색 및 활성화.

## 2단계: 서비스 계정 생성
1. **"IAM 및 관리자" > "서비스 계정"** 이동.
2. 새 서비스 계정 생성 (예: `logger@...`).
3. 생성된 이메일 주소 복사.

## 3단계: 키(Key) 생성
1. 서비스 계정 상세 페이지 > **"키"** 탭.
2. **"키 추가" > "JSON"** 선택하여 파일 다운로드.

## 4단계: 구글 시트 공유
1. 로그를 저장할 구글 시트 생성.
2. **"공유"** 버튼 클릭 후, 2단계에서 복사한 이메일 주소 추가.
3. 권한을 **"편집자"**로 설정.

## 5단계: 환경 변수 설정
`.env.local` 파일에 다운로드 받은 JSON 키 정보를 입력합니다.

```env
GOOGLE_SHEETS_CLIENT_EMAIL="client_email_값"
GOOGLE_SHEETS_PRIVATE_KEY="private_key_값_전체"
```

> **Tip**: `private_key`의 줄바꿈 문자(`\n`)도 그대로 포함해야 합니다.
