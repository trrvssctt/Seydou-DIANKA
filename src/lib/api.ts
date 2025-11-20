// Use Vite env var `VITE_API_BASE` to configure API base in production.
// Example (Vercel): set VITE_API_BASE to "https://api.example.com/api"
const API_BASE = import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? 'http://localhost:4000/api' : '/api');

export function setToken(token: string) {
  localStorage.setItem('auth_token', token);
}
export function getToken() {
  return localStorage.getItem('auth_token');
}
export function logout() {
  localStorage.removeItem('auth_token');
}

export async function apiPost(path: string, body: any, auth = false) {
  const headers: any = { 'Content-Type': 'application/json' };
  if (auth) {
    const t = getToken();
    if (t) headers['Authorization'] = `Bearer ${t}`;
  }
  const res = await fetch(API_BASE + path, { method: 'POST', headers, body: JSON.stringify(body) });
  return res;
}

export async function apiGet(path: string, auth = false) {
  const headers: any = {};
  if (auth) {
    const t = getToken();
    if (t) headers['Authorization'] = `Bearer ${t}`;
  }
  const res = await fetch(API_BASE + path, { headers });
  return res;
}

export async function apiPut(path: string, body: any, auth = false) {
  const headers: any = { 'Content-Type': 'application/json' };
  if (auth) {
    const t = getToken();
    if (t) headers['Authorization'] = `Bearer ${t}`;
  }
  const res = await fetch(API_BASE + path, { method: 'PUT', headers, body: JSON.stringify(body) });
  return res;
}

export async function apiDelete(path: string, auth = false) {
  const headers: any = {};
  if (auth) {
    const t = getToken();
    if (t) headers['Authorization'] = `Bearer ${t}`;
  }
  const res = await fetch(API_BASE + path, { method: 'DELETE', headers });
  return res;
}

export async function apiPatch(path: string, body: any, auth = false) {
  const headers: any = { 'Content-Type': 'application/json' };
  if (auth) {
    const t = getToken();
    if (t) headers['Authorization'] = `Bearer ${t}`;
  }
  const res = await fetch(API_BASE + path, { method: 'PATCH', headers, body: JSON.stringify(body) });
  return res;
}
