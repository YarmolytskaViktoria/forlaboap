import { API_BASE_URL } from "./config.js";
import type {
  ApiError,
  ProductListItemDto,
  CreateProductDto,
  UpdateProductDto,
  ListResponse,
} from "./dtos.js";

const TIMEOUT_MS = 10_000;
const MAX_RETRIES = 3;
const RETRY_STATUSES = [429, 503];

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL_MS = 30_000;

function getDemoUserId(): string {
  return localStorage.getItem("demoUserId") ?? "";
}

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);

  if (!entry) return null;

  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

function setCached(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export function invalidateCache(): void {
  cache.clear();
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  useCache = false
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  if (useCache) {
    const cached = getCached<T>(url);
    if (cached) return cached;
  }


  // --- Обробка помилки ---
  let lastError: ApiError | null = null;
  const isReadOnly = !options.method || options.method === "GET";


  // --- Таймаут та повторні спроби ---
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);


    // --- Перевірка ---
    let response: Response;

    try {
      response = await fetch(url, {
        ...options,
        headers: {
          "X-Demo-UserId": getDemoUserId(),
          ...(options.headers ?? {}),
        },
        signal: controller.signal,
      });
    } catch (e: unknown) {
      clearTimeout(timeoutId);


      // --- Помилка мережі ---
      throw {
        status: 0,
        message:
          e instanceof DOMException && e.name === "AbortError"
            ? "Запит перевищив таймаут (10с)"
            : "Помилка мережі або бекенд недоступний",
        details: e instanceof Error ? e.message : String(e),
      } satisfies ApiError;
    } finally {
      clearTimeout(timeoutId);
    }

    if (response.status === 204) {
      return null as T;
    }

    const rawText = await response.text();

    if (response.ok) {
      if (!rawText) return null as T;

      const data = JSON.parse(rawText) as T;

      if (useCache) setCached(url, data);

      return data;
    }

    if (
      isReadOnly &&
      RETRY_STATUSES.includes(response.status) &&
      attempt < MAX_RETRIES
    ) {
      const delay = 1000 * (attempt + 1);
      await new Promise((res) => setTimeout(res, delay));
      continue;
    }

    let payload: {
      message?: string;
      error?: {
        message?: string;
        details?: { field: string; message: string }[];
      };
    } | null = null;

    try {
      payload = rawText ? JSON.parse(rawText) : null;
    } catch {
      payload = null;
    }

    lastError = {
      status: response.status,
      message: payload?.error?.message ?? payload?.message ?? "HTTP помилка",
      details: rawText,
      errors: payload?.error?.details
        ? Object.fromEntries(
            payload.error.details.map((d) => [d.field, [d.message]])
          )
        : undefined,
    };

    throw lastError;
  }

  throw lastError ?? { status: 0, message: "Невідома помилка", details: "" };
}

// --- Fetch до ендпоінту (отримання списку)---
export async function getProducts(params?: {
  licenseType?: string;
  sortBy?: string;
  sortDir?: string;
  page?: number;
  pageSize?: number;
}): Promise<ListResponse<ProductListItemDto>> {
  const query = new URLSearchParams();

  if (params?.licenseType) query.set("licenseType", params.licenseType);
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.sortDir) query.set("sortDir", params.sortDir);
  if (params?.page) query.set("page", String(params.page));
  if (params?.pageSize) query.set("pageSize", String(params.pageSize));

  const qs = query.toString() ? `?${query.toString()}` : "";

  return await request<ListResponse<ProductListItemDto>>(
    `/products${qs}`,
    { method: "GET" },
    true
  );
}

// --- Fetch до ендпоінту (отримання продукту за ID) ---
export async function getProductById(id: string): Promise<ProductListItemDto> {
  return await request<ProductListItemDto>(
    `/products/${encodeURIComponent(id)}`,
    { method: "GET" },
    true
  );
}

export async function createProduct(
  dto: CreateProductDto
): Promise<ProductListItemDto> {
  invalidateCache();

  return await request<ProductListItemDto>("/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}

export async function updateProduct(
  id: string,
  dto: UpdateProductDto
): Promise<ProductListItemDto> {
  invalidateCache();

  return await request<ProductListItemDto>(
    `/products/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    }
  );
}

export async function deleteProduct(id: string): Promise<void> {
  invalidateCache();

  return await request<void>(`/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}