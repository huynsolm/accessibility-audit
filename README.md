# 접근성 마크업 점검기

브라우저에서만 실행되는 정적 HTML 접근성 점검 MVP입니다. HTML을 붙여 넣으면 한국어 결과 보고서를 표시합니다.

## Run
```bash
python3 -m http.server 8000
```
브라우저에서 `http://localhost:8000`을 엽니다.

## Verify
```bash
npm test
npm run lint
```

## Rules
문서 언어, 페이지 제목, h1 개수, 이미지 alt, 폼 레이블, 링크 텍스트, 제목 단계 건너뛰기를 점검합니다.

범위는 붙여 넣은 HTML만입니다. URL 크롤링, API, 서버, 데이터베이스는 사용하지 않습니다.
