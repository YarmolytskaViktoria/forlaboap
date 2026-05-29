import { API_BASE_URL } from "./config.js";
const TIMEOUT_MS = 10000;
const MAX_RETRIES = 3;
const RETRY_STATUSES = [429, 503];
// --- Кеш ---
const cache = new Map();
const CACHE_TTL_MS = 30000;
function getCached(key) {
    const entry = cache.get(key);
    if (!entry)
        return null;
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
        cache.delete(key);
        return null;
    }
    return entry.data;
}
function setCached(key, data) {
    cache.set(key, { data, timestamp: Date.now() });
}
export function invalidateCache() {
    cache.clear();
}
// --- Request з retry ---
async function request(path, options = {}, useCache = false) {
    const url = `${API_BASE_URL}${path}`;
    if (useCache) {
        const cached = getCached(url);
        if (cached) {
            console.log("[CACHE HIT]", url);
            return cached;
        }
    }
    let lastError = null;
    const isReadOnly = !options.method || options.method === "GET";
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
        let response;
        try {
            response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });
        }
        catch (e) {
            clearTimeout(timeoutId);
            const err = {
                status: 0,
                message: e instanceof DOMException && e.name === "AbortError"
                    ? "Запит перевищив таймаут (10с)"
                    : "Помилка мережі або бекенд недоступний",
                details: e instanceof Error ? e.message : String(e),
            };
            throw err;
        }
        finally {
            clearTimeout(timeoutId);
        }
        if (response.status === 204) {
            return null;
        }
        const rawText = await response.text();
        if (response.ok) {
            if (!rawText)
                return null;
            try {
                const data = JSON.parse(rawText);
                if (useCache)
                    setCached(url, data);
                return data;
            }
            catch {
                return rawText;
            }
        }
        // Retry тільки для безпечних сценаріїв
        if (isReadOnly && RETRY_STATUSES.includes(response.status) && attempt < MAX_RETRIES) {
            const delay = 1000 * (attempt + 1);
            console.warn(`[RETRY] attempt ${attempt + 1}/${MAX_RETRIES} for ${url} (status ${response.status}), waiting ${delay}ms`);
            await new Promise((res) => setTimeout(res, delay));
            continue;
        }
        let payload = null;
        try {
            payload = rawText ? JSON.parse(rawText) : null;
        }
        catch {
            // залишаємо rawText
        }
        lastError = {
            status: response.status,
            message: payload?.error?.message ?? payload?.message ?? "HTTP помилка",
            details: rawText,
            errors: payload?.error?.details
                ? Object.fromEntries(payload.error.details.map((d) => [d.field, [d.message]]))
                : undefined,
        };
        throw lastError;
    }
    throw lastError ?? { status: 0, message: "Невідома помилка", details: "" };
}
// --- Products ---
export async function getProducts(params) {
    const query = new URLSearchParams();
    if (params?.licenseType)
        query.set("licenseType", params.licenseType);
    if (params?.sortBy)
        query.set("sortBy", params.sortBy);
    if (params?.sortDir)
        query.set("sortDir", params.sortDir);
    if (params?.page)
        query.set("page", String(params.page));
    if (params?.pageSize)
        query.set("pageSize", String(params.pageSize));
    const qs = query.toString() ? `?${query.toString()}` : "";
    return await request(`/products${qs}`, { method: "GET" }, true // useCache
    );
}
export async function getProductById(id) {
    return await request(`/products/${encodeURIComponent(id)}`, { method: "GET" }, true // useCache
    );
}
export async function createProduct(dto) {
    invalidateCache();
    return await request("/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}
export async function updateProduct(id, dto) {
    invalidateCache();
    return await request(`/products/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}
export async function deleteProduct(id) {
    invalidateCache();
    return await request(`/products/${encodeURIComponent(id)}`, {
        method: "DELETE",
    });
}
