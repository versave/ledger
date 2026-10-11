// Thin fetch wrapper around the JSON API mounted at /api.

const BASE = '/api'

export class HttpError extends Error {
    constructor(
        public status: number,
        message: string,
    ) {
        super(message)
        this.name = 'HttpError'
    }
}

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
    const res = await fetch(BASE + path, options)

    if (res.status === 204) {
        return undefined as T
    }

    const body = await res.json().catch(() => ({}))

    if (!res.ok) {
        throw new HttpError(res.status, (body as { error?: string }).error ?? `HTTP ${res.status}`)
    }

    return body as T
}

const jsonBody = (method: string, data: unknown): RequestInit => ({
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
})

export const http = {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, data: unknown) => request<T>(path, jsonBody('POST', data)),
    patch: <T>(path: string, data: unknown) => request<T>(path, jsonBody('PATCH', data)),
    delete: (path: string) => request<void>(path, { method: 'DELETE' }),
}
