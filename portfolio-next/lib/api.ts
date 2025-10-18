const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

let memoryToken = '';

export function setToken(token: string) {
  memoryToken = token;
  if (typeof window !== 'undefined') {
    (window as any).__MEM_TOKEN_SET__ = true;
  }
}

function authHeaders() {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (memoryToken) h['Authorization'] = 'Bearer ' + memoryToken;
  return h;
}

export async function apiGet<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...(init.headers || {}), ...authHeaders() },
    cache: 'no-store',
    credentials: 'include'
  });
  if (!res.ok) throw new Error(`GET ${path} ${res.status}`);
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    ...init,
    body: JSON.stringify(body),
    headers: { ...(init.headers || {}), ...authHeaders() },
    cache: 'no-store',
    credentials: 'include'
  });
  if (!res.ok) throw new Error(`POST ${path} ${res.status}`);
  return res.json() as Promise<T>;
}

export async function apiPut<T>(path: string, body: unknown, init: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    ...init,
    body: JSON.stringify(body),
    headers: { ...(init.headers || {}), ...authHeaders() },
    cache: 'no-store',
    credentials: 'include'
  });
  if (!res.ok) throw new Error(`PUT ${path} ${res.status}`);
  return res.json() as Promise<T>;
}

export async function apiDelete<T>(path: string, init: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    ...init,
    headers: { ...(init.headers || {}), ...authHeaders() },
    cache: 'no-store',
    credentials: 'include'
  });
  if (!res.ok) throw new Error(`DELETE ${path} ${res.status}`);
  return res.json() as Promise<T>;
}

/* Domain-specific helpers */
export type BlogPost = { id: string; title: string; slug: string; tags: string[]; cover?: string; body: string; createdAt?: string; updatedAt?: string; };
export async function getBlogList(): Promise<BlogPost[]> {
  try { return await apiGet<BlogPost[]>('/api/blog'); }
  catch { // fallback
    return [
      { id: '1', title: 'Welcome', slug: 'welcome', tags: ['intro'], body: 'This is a placeholder blog post.' }
    ];
  }
}
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try { return await apiGet<BlogPost>(`/api/blog/${encodeURIComponent(slug)}`); }
  catch { return { id: 'x', title: slug, slug, tags: [], body: 'Fallback content.' }; }
}

export type Project = { id?: string; title: string; slug?: string; tags?: string[]; url?: string; desc?: string; cover?: string; };
export async function getProjects(): Promise<Project[]> {
  try { return await apiGet<Project[]>('/api/projects'); }
  catch { return []; }
}

export async function login(email: string, password: string) {
  const data = await apiPost<{ token?: string }>('/api/auth/login', { email, password });
  if (data.token) setToken(data.token);
  return data;
}

/* Admin helpers */
export async function adminUpsertBlog(post: BlogPost) {
  return apiPost('/api/admin/blog', post);
}
export async function adminDeleteBlog(id: string) {
  return apiDelete(`/api/admin/blog/${encodeURIComponent(id)}`);
}
export async function adminUpsertProject(p: Project) {
  return apiPost('/api/admin/project', p);
}
export async function adminSiteMeta(meta: Record<string, unknown>) {
  return apiPost('/api/admin/meta', meta);
}