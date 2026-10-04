const issue = (rule, severity, context, guidance) => ({ rule, severity, context, guidance });

export function auditDocument(html) {
  const issues = [];
  const match = html.match(/<html\b([^>]*)>/i);
  const lang = match?.[1].match(/\blang\s*=\s*["']?([^"'\s>]+)/i)?.[1];
  if (!lang) {
    issues.push(issue('document-language', 'error', '<html>', 'html 요소에 문서 언어를 나타내는 lang 속성을 추가하세요. 예: lang="ko"'));
  }
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1].replace(/<[^>]+>/g, '').trim();
  if (!title) {
    issues.push(issue('page-title', 'error', '<title>', 'head 안에 페이지 목적을 설명하는 비어 있지 않은 title을 추가하세요.'));
  }
  const h1Count = (html.match(/<h1\b[^>]*>/gi) ?? []).length;
  if (h1Count !== 1) {
    issues.push(issue('h1-count', 'error', '<h1>', `h1은 정확히 하나여야 합니다. 현재 ${h1Count}개입니다.`));
  }
  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
    const alt = tag.match(/\balt\s*=\s*["']([^"']*)["']/i)?.[1]?.trim();
    if (!alt) issues.push(issue('image-alt', 'error', tag, '의미 있는 이미지에는 내용을 설명하는 alt 텍스트를 제공하세요.'));
  }
  for (const tag of html.match(/<iframe\b[^>]*>/gi) ?? []) {
    const title = tag.match(/\btitle\s*=\s*["']([^"']*)["']/i)?.[1]?.trim();
    if (!title) issues.push(issue('iframe-title', 'error', tag, 'iframe에는 포함된 콘텐츠의 목적을 설명하는 비어 있지 않은 title을 제공하세요.'));
  }
  for (const match of html.matchAll(/<table\b([^>]*)>([\s\S]*?)<\/table>/gi)) {
    const attributes = match[1];
    const role = attributes.match(/\brole\s*=\s*["']?([^"'\s>]+)/i)?.[1]?.toLowerCase();
    const caption = match[2].match(/<caption\b[^>]*>([\s\S]*?)<\/caption>/i)?.[1].replace(/<[^>]+>/g, '').trim();
    const named = /\baria-label(?:ledby)?\s*=\s*["'][^"']*\S[^"']*["']/i.test(attributes);
    if (!['presentation', 'none'].includes(role) && !caption && !named) issues.push(issue('table-name', 'error', match[0], '데이터 표에는 내용을 설명하는 caption 또는 aria-label/aria-labelledby를 제공하세요.'));
  }
  const labelFors = [...html.matchAll(/<label\b[^>]*\bfor\s*=\s*["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]);
  for (const tag of html.match(/<(?:input|select|textarea)\b[^>]*>/gi) ?? []) {
    const type = tag.match(/\btype\s*=\s*["']?([^"'\s>]+)/i)?.[1]?.toLowerCase();
    const id = tag.match(/\bid\s*=\s*["']([^"']+)["']/i)?.[1];
    const named = /\baria-label(?:ledby)?\s*=\s*["'][^"']+[^"']*["']/i.test(tag) || (id && labelFors.includes(id));
    if (!['hidden', 'submit', 'button', 'reset'].includes(type) && !named) issues.push(issue('form-label', 'error', tag, '폼 컨트롤에 label을 for/id로 연결하거나 aria-label 또는 aria-labelledby를 제공하세요.'));
  }
  for (const match of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const text = match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const named = text || /\baria-label(?:ledby)?\s*=\s*["'][^"']*\S[^"']*["']/i.test(match[1]);
    if (!named) issues.push(issue('button-name', 'error', match[0], '버튼에는 보이는 텍스트 또는 aria-label/aria-labelledby로 접근 가능한 이름을 제공하세요.'));
  }
  for (const match of html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)) {
    const text = match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    if (!text || ['click here', 'more', 'read more'].includes(text)) issues.push(issue('link-text', 'warning', match[0], '링크 목적을 알 수 있는 구체적인 텍스트를 사용하세요. 예: 프로젝트 상세 보기'));
  }
  for (const match of html.matchAll(/<(a|button|input|select|textarea)\b[^>]*>/gi)) {
    const tag = match[0];
    const name = match[1].toLowerCase();
    const hasHref = name !== 'a' || /\bhref\s*=\s*["'][^"']+[^"']*["']/i.test(tag);
    const disabled = /\bdisabled(?:\s|=|>|$)/i.test(tag);
    if (hasHref && !disabled && /\baria-hidden\s*=\s*["']true["']/i.test(tag)) issues.push(issue('aria-hidden-focusable', 'error', tag, '키보드로 초점을 받을 수 있는 네이티브 컨트롤과 링크에는 aria-hidden="true"를 사용하지 마세요.'));
  }
  let previousLevel = 0;
  for (const match of html.matchAll(/<h([1-6])\b[^>]*>/gi)) {
    const level = Number(match[1]);
    if (previousLevel && level > previousLevel + 1) issues.push(issue('heading-skip', 'warning', match[0], `h${previousLevel} 다음에는 h${previousLevel + 1}을 사용해 제목 단계 건너뛰기를 피하세요.`));
    previousLevel = level;
  }
  const errors = issues.filter((item) => item.severity === 'error').length;
  const warnings = issues.filter((item) => item.severity === 'warning').length;
  return { issues, summary: { errors, warnings, passed: 11 - new Set(issues.map((item) => item.rule)).size }, passed: issues.length === 0 };
}
