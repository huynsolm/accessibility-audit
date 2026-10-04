# Product Spec — 접근성 마크업 점검기

## Problem
웹 퍼블리셔가 게시 전 HTML의 기본 접근성 마크업 문제를 빠르게 확인할 수 있어야 한다.

## Input and output
- Input: 사용자가 붙여 넣은 하나의 HTML 문자열.
- Output: 한국어 요약(오류/경고/통과 수와 전체 통과 상태) 및 문제별 심각도, 요소/위치 맥락, 실행 가능한 안내.

## Rules
1. `html[lang]` 존재 및 비어 있지 않음
2. 비어 있지 않은 `title`
3. `h1` 정확히 하나
4. `img`의 `alt` 존재 및 비어 있지 않음
5. 입력/선택/텍스트영역 컨트롤에 연결된 `label`, `aria-label`, 또는 `aria-labelledby`
6. 링크 텍스트가 비어 있지 않고 `click here`, `more` 같은 일반 문구가 아님
7. 제목 레벨이 한 단계보다 크게 건너뛰지 않음

## Acceptance criteria
- HTML 붙여넣기와 점검 버튼이 작동한다.
- 결과는 결정적이며 네트워크, AI, 서버 없이 브라우저에서만 계산된다.
- 각 실패는 severity, context, Korean guidance를 포함한다.
- 규칙 위반이 없으면 통과 상태를 표시한다.

## Out of scope
URL 크롤링, AI API, 로그인, 서버/데이터베이스, 자동 수정, 원격 저장.
