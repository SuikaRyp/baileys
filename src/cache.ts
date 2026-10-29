interface CacheEntry<T> {
	value: T
	expiresAt: number | null
}

export interface CacheOptions {
	/** Default time-to-live in milliseconds. Omit for no expiry. */
	ttl?: number
}

export interface Cache<T = unknown> {
	get(key: string): T | undefined
	set(key: string, value: T, ttl?: number): void
	has(key: string): boolean
	delete(key: string): boolean
	clear(): void
	size(): number
}

export function createCache<T = unknown>(options: CacheOptions = {}): Cache<T> {
	const store = new Map<string, CacheEntry<T>>()

	const isExpired = (entry: CacheEntry<T>) =>
		entry.expiresAt !== null && entry.expiresAt <= Date.now()

	return {
		get(key) {
			const entry = store.get(key)
			if (!entry) return undefined
			if (isExpired(entry)) {
				store.delete(key)
				return undefined
			}
			return entry.value
		},
		set(key, value, ttl = options.ttl) {
			store.set(key, {
				value,
				expiresAt: ttl ? Date.now() + ttl : null
			})
		},
		has(key) {
			const entry = store.get(key)
			if (!entry) return false
			if (isExpired(entry)) {
				store.delete(key)
				return false
			}
			return true
		},
		delete(key) {
			return store.delete(key)
		},
		clear() {
			store.clear()
		},
		size() {
			return store.size
		}
	}
}
