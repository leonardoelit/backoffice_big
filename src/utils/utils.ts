export function parseJwt(token: string) {
  if (!token) {
    return;
  }
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}

export function parseJwtCookie(token: string) {
  try {
    const base64Payload = token.split('.')[1];
    const decoded = atob(base64Payload);
    return JSON.parse(decoded);
  } catch (err) {
    console.log(err)
    return null;
  }
}
