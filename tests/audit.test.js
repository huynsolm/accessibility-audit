import test from 'node:test';
import assert from 'node:assert/strict';
import { auditDocument } from '../src/audit.js';

test('reports a missing document language', () => {
  const result = auditDocument('<html><head><title>소개</title></head><body><h1>소개</h1></body></html>');
  assert.equal(result.issues.some((issue) => issue.rule === 'document-language'), true);
});

test('reports a missing or empty page title', () => {
  const result = auditDocument('<html lang="ko"><head><title> </title></head><body><h1>소개</h1></body></html>');
  assert.equal(result.issues.some((issue) => issue.rule === 'page-title'), true);
});

test('reports when the h1 count is not exactly one', () => {
  const result = auditDocument('<html lang="ko"><head><title>소개</title></head><body><h2>소개</h2></body></html>');
  assert.equal(result.issues.some((issue) => issue.rule === 'h1-count'), true);
});

test('reports images without meaningful alternative text', () => {
  const result = auditDocument('<html lang="ko"><head><title>소개</title></head><body><h1>소개</h1><img src="portrait.jpg" alt=""></body></html>');
  assert.equal(result.issues.some((issue) => issue.rule === 'image-alt'), true);
});

test('reports form controls without an accessible label', () => {
  const result = auditDocument('<html lang="ko"><head><title>문의</title></head><body><h1>문의</h1><input type="email" id="email"></body></html>');
  assert.equal(result.issues.some((issue) => issue.rule === 'form-label'), true);
});

test('reports iframes without a non-empty title', () => {
  const result = auditDocument('<html lang="ko"><head><title>소개</title></head><body><h1>소개</h1><iframe src="/video" title=" "></iframe></body></html>');
  assert.equal(result.issues.some((issue) => issue.rule === 'iframe-title'), true);
});

test('reports data tables without a caption or accessible name', () => {
  const result = auditDocument('<html lang="ko"><head><title>성적</title></head><body><h1>성적</h1><table><tr><th>과목</th><td>국어</td></tr></table></body></html>');
  assert.equal(result.issues.some((issue) => issue.rule === 'table-name'), true);
});

test('reports buttons without an accessible name', () => {
  const result = auditDocument('<html lang="ko"><head><title>소개</title></head><body><h1>소개</h1><button><svg aria-hidden="true"></svg></button></body></html>');
  assert.equal(result.issues.some((issue) => issue.rule === 'button-name'), true);
});

test('reports focusable native controls and links hidden from assistive technology', () => {
  const result = auditDocument('<html lang="ko"><head><title>소개</title></head><body><h1>소개</h1><a href="/work" aria-hidden="true">작업</a></body></html>');
  assert.equal(result.issues.some((issue) => issue.rule === 'aria-hidden-focusable'), true);
});

test('reports empty and generic link text', () => {
  const result = auditDocument('<html lang="ko"><head><title>소개</title></head><body><h1>소개</h1><a href="/work">click here</a></body></html>');
  assert.equal(result.issues.some((issue) => issue.rule === 'link-text'), true);
});

test('reports skipped heading levels', () => {
  const result = auditDocument('<html lang="ko"><head><title>소개</title></head><body><h1>소개</h1><h3>작업</h3></body></html>');
  assert.equal(result.issues.some((issue) => issue.rule === 'heading-skip'), true);
});

test('returns a pass state for conforming basic markup', () => {
  const result = auditDocument('<html lang="ko"><head><title>소개</title></head><body><h1>소개</h1><h2>작업</h2><img src="portrait.jpg" alt="프로필 사진"><label for="email">이메일</label><input id="email" type="email"><a href="/work">프로젝트 상세 보기</a><iframe src="/video" title="소개 영상"></iframe><table><caption>프로젝트 목록</caption><tr><th>이름</th><td>접근성 점검기</td></tr></table><button aria-label="메뉴 열기"><svg aria-hidden="true"></svg></button></body></html>');
  assert.equal(result.passed, true);
  assert.equal(result.issues.length, 0);
  assert.equal(result.summary.passed, 11);
});
