export interface ZipEntry {
	name: string
	data: Buffer | string
}

/**
 * Pack a list of files into a ZIP buffer.
 * Requires the `archiver` package: npm i archiver && npm i -D @types/archiver
 */
export async function createZip(entries: ZipEntry[]): Promise<Buffer> {
	const archiver = (await import('archiver')).default
	const { PassThrough } = await import('node:stream')

	const stream = new PassThrough()
	const chunks: Buffer[] = []
	stream.on('data', (chunk) => chunks.push(chunk))

	const archive = archiver('zip', { zlib: { level: 9 } })
	archive.pipe(stream)

	for (const entry of entries) {
		archive.append(entry.data, { name: entry.name })
	}

	await archive.finalize()

	return new Promise((resolve, reject) => {
		stream.on('end', () => resolve(Buffer.concat(chunks)))
		stream.on('error', reject)
		archive.on('error', reject)
	})
}
