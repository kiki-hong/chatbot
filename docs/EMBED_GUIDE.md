# 챗봇 연동 가이드

**한의학 AI 컨설턴트**를 귀하의 웹사이트(한의원 홈페이지, 건강 블로그 등)에 연동하는 방법입니다.

## 1. 위젯 스크립트 (추천)
웹사이트 우측 하단에 챗봇 아이콘을 띄우는 방식입니다.

HTML 파일의 `<head>` 태그 안쪽이나 `</body>` 태그 바로 앞에 아래 스크립트를 추가하세요.

```html
<script 
  src="https://your-chatbot-domain.com/embed.js" 
  data-source-id="your-website-id"
  data-domain="https://your-chatbot-domain.com"
  data-bottom="80px"
  data-right="20px"
  async
></script>
```

*(참고: 배포된 도메인 주소에 따라 `src`와 `data-domain`을 수정해야 합니다.)*

## 2. Iframe 임베드 (삽입)
페이지의 특정 영역에 채팅창을 직접 삽입하는 방식입니다.

```html
<iframe 
  src="https://your-chatbot-domain.com/embed?source=your-website-id"
  width="100%"
  height="600px"
  frameborder="0"
  style="border: 1px solid #e2e8f0; border-radius: 12px;"
></iframe>
```

## 3. 직접 링크 / 팝업
버튼을 클릭했을 때 새 창으로 챗봇을 띄우는 방식입니다.

```javascript
function openChatPopup() {
  window.open(
    'https://your-chatbot-domain.com/embed?source=popup', 
    'NaturalMedBot', 
    'width=400,height=600,resizable=yes,scrollbars=yes'
  );
}
```

## 4. 카카오톡 / SNS 공유 링크
카카오톡, 문자, 블로그 등에 **챗봇으로 바로 연결되는 링크**를 공유하고 싶다면 아래 주소를 사용하세요.
이 링크를 클릭하면 챗봇이 전체 화면으로 열립니다.

- **기본 링크**: `https://your-chatbot-domain.com/embed`
- **출처 추적용 링크** (예: 카카오톡에서 유입): `https://your-chatbot-domain.com/embed?source=kakao`

