import DOMPurify from "dompurify";

const ALLOWED_TAGS = ["p", "br", "strong", "em", "u", "s", "span", "ul", "ol", "li", "blockquote", "mark"];
const ALLOWED_ATTR = ["style", "data-marker", "class"];

export const sanitizeHtml = (html: string): string =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: true,
  });

/**
 * Wrap a legacy plain-text string into `<p>` HTML. If the value already looks
 * like HTML (contains a tag), pass through untouched (still sanitized at render).
 */
export const toRichHtml = (value: string | undefined | null): string => {
  if (!value) return "";
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(value);
  if (looksLikeHtml) return value;
  return value
    .split(/\n+/)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");
};

export const htmlToPlain = (html: string): string => {
  const tmp = document.createElement("div");
  tmp.innerHTML = sanitizeHtml(html);
  return tmp.textContent ?? "";
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const isHtmlEmpty = (html: string | undefined): boolean => {
  if (!html) return true;
  const plain = html.replace(/<[^>]+>/g, "").trim();
  return plain.length === 0;
};
