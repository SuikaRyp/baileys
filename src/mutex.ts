export interface Mutex {
	/** Acquire the lock, run fn exclusively, then release. */
	runExclusive<T>(fn: () => Promise<T> | T): Promise<T>
}

export function createMutex(): Mutex {
	let locked = false
	const waiting: Array<() => void> = []

	const acquire = () =>
		new Promise<void>((resolve) => {
			if (!locked) {
				locked = true
				resolve()
			} else {
				waiting.push(resolve)
			}
		})

	const release = () => {
		const next = waiting.shift()
		if (next) {
			next()
		} else {
			locked = false
		}
	}

	return {
		async runExclusive(fn) {
			await acquire()
			try {
				return await fn()
			} finally {
				release()
			}
		}
	}
}
