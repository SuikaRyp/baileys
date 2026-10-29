export interface Queue {
	/** Add a task to the queue; tasks run one at a time, in order. */
	enqueue<T>(task: () => Promise<T> | T): Promise<T>
	size(): number
}

export function createQueue(): Queue {
	let tail: Promise<unknown> = Promise.resolve()
	let pending = 0

	return {
		enqueue<T>(task: () => Promise<T> | T): Promise<T> {
			pending++
			const run = tail.then(task, task)
			tail = run.catch(() => undefined).finally(() => {
				pending--
			})
			return run
		},
		size() {
			return pending
		}
	}
}
