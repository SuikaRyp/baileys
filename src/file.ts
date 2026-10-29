export interface GetFileResult {
	buffer: Buffer
	contentType: string | null
	byteLength: number
}

/**
 * Download a file from a URL or read it from a local path, returning a Buffer.
 */
export async function getFile(source: string): Promise<GetFileResult> {
	if (/^https?:\/\//i.test(source)) {
		const res = await fetch(source)
		if (!res.ok) {
			throw new Error(`Failed to fetch file: ${res.status} ${res.statusText}`)
		}
		const arrayBuffer = await res.arrayBuffer()
		const buffer = Buffer.from(arrayBuffer)
		return {
			buffer,
			contentType: res.headers.get('content-type'),
			byteLength: buffer.byteLength
		}
	}

	const { readFile } = await import('node:fs/promises')
	const buffer = await readFile(source)
	return {
		buffer,
		contentType: null,
		byteLength: buffer.byteLength
	}
}
