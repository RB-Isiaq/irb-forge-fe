export function setSessionCookie(value: boolean) {
  if (typeof document === "undefined") return;
  document.cookie = value
    ? "irb_session=1; path=/; max-age=604800; SameSite=Lax"
    : "irb_session=; path=/; max-age=0";
}
