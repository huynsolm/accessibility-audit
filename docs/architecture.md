# Architecture

## Runtime
정적 파일을 HTTP로 제공하는 브라우저 전용 ES 모듈 앱이다.

## Data flow
`textarea` HTML → `auditDocument(html)` → `{ issues, summary, passed }` → `renderResults()`.

## Source layout
- `src/audit.js`: DOMParser 기반의 순수(입력 문자열 기준) 규칙 검사와 결과 생성
- `src/app.js`: 이벤트 처리와 DOM 렌더링
- `tests/audit.test.js`: Node의 최소 DOM 없는 환경에서 문자열 기반 검사 회귀 테스트

## Commands
- `npm test`: Node built-in test runner
- `npm run lint`: Node syntax checks
