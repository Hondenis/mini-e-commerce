import type { ApiErrorShape } from "@/types";

const BASE_URL = "https://fakestoreapi.com";
const DEFAULT_TIMEOUT = 12_000;

export class ApiError extends Error implements ApiErrorShape {
    status: number
    cause?: unknown;
    constructor(message: string, status: number, cause?: unknown) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.cause = cause;
    }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
    body?: unknown
    timeout?: number
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
    const { body, timeout = DEFAULT_TIMEOUT, headers, ...rest } = opts;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
        const res = await fetch(`${BASE_URL}${path}`, {
            ...rest,
            headers: {
                Accept: "application/json",
                ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
                ...headers
            },
            body: body !== undefined ? JSON.stringify(body) : undefined,
            signal: controller.signal,
        })

        if (!res.ok) {
            throw new ApiError(`Falha na requisição (${res.status})`, res.status)
        }

        // Alguns endpoints do FakeStore retornam código 200 com corpo vazio na requisição POST.
        const text = await res.text();
        if (!text) return undefined as T;
        return JSON.parse(text) as T;
    } catch (err) {
        if (err instanceof ApiError) throw err;
        if ((err as Error).name === "AbortError") {
            throw new ApiError("Tempo de requisição esgotado. Tente novamente", 408, err);
        }
        throw new ApiError("Não foi possível se conectar ao servidor.", 0, err);
    } finally {
        clearTimeout(timer);
    }
}

export const api = {
    get: <T,>(path: string, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'GET' }),
    post: <T,>(path: string, body?: unknown, opts?: RequestOptions) =>
        request<T>(path, { ...opts, method: 'POST', body }),
    put: <T,>(path: string, body?: unknown, opts?: RequestOptions) =>
        request<T>(path, { ...opts, method: 'PUT', body }),
    delete: <T,>(path: string, opts?: RequestOptions) =>
        request<T>(path, { ...opts, method: 'DELETE' }),
}