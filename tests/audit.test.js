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

test('reports empty and generic link text', () => {
  const result = auditDocument('<html lang="ko"><head><title>소개</title></head><body><h1>소개</h1><a href="/work">click here</a></body></html>');
  assert.equal(result.issues.some((issue) => issue.rule === 'link-text'), true);
});

test('reports skipped heading levels', () => {
  const result = auditDocument('<html lang="ko"><head><title>소개</title></head><body><h1>소개</h1><h3>작업</h3></body></html>');
  assert.equal(result.issues.some((issue) => issue.rule === 'heading-skip'), true);
});

test('returns a pass state for conforming basic markup', () => {
  const result = auditDocument('<html lang="ko"><head><title>소개</title></head><body><h1>소개</h1><h2>작업</h2><img src="portrait.jpg" alt="프로필 사진"><label for="email">이메일</label><input id="email" type="email"><a href="/work">프로젝트 상세 보기</a></body></html>');
  assert.equal(result.passed, true);
  assert.equal(result.issues.length, 0);
});
