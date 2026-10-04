import { auditDocument } from './audit.js';

const form = document.querySelector('#audit-form');
const input = document.querySelector('#html-input');
const report = document.querySelector('#report');

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function renderResults(result) {
  const status = result.passed ? '통과: 발견된 문제 없음' : '점검 필요';
  const issues = result.issues.length ? result.issues.map((item) => `<article class="issue"><span class="badge">${item.severity === 'error' ? '오류' : '경고'}</span><h3>${escapeHtml(item.rule)}</h3><code class="context">${escapeHtml(item.context)}</code><p>${escapeHtml(item.guidance)}</p></article>`).join('') : '<p>모든 기본 마크업 규칙을 통과했습니다.</p>';
  report.innerHTML = `<p class="status ${result.passed ? 'pass' : 'fail'}">${status}</p><div class="summary"><div class="metric">오류 ${result.summary.errors}</div><div class="metric">경고 ${result.summary.warnings}</div><div class="metric">통과 규칙 ${result.summary.passed}/7</div></div>${issues}`;
}

form.addEventListener('submit', (event) => { event.preventDefault(); renderResults(auditDocument(input.value)); });
renderResults(auditDocument(input.value));
