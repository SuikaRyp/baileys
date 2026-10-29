export interface MediaInfo {
	mime: string | null
	extension: string | null
}

/**
 * Detect the mime type and extension of a buffer by inspecting its magic bytes.
 * Requires the `file-type` package: npm i file-type
 */
export async function detectMediaInfo(buffer: Buffer): Promise<MediaInfo> {
	const { fileTypeFromBuffer } = await import('file-type')
	const result = await fileTypeFromBuffer(buffer)
	return {
		mime: result?.mime ?? null,
		extension: result?.ext ?? null
	}
}

/**
 * Extract a simple waveform (peak amplitudes per sample bucket) from a WAV buffer.
 * For compressed formats (mp3, ogg, opus), decode to WAV/PCM first — e.g. with
 * ffmpeg (`npm i fluent-ffmpeg` + ffmpeg binary) — before calling this function.
 */
export function getAudioWaveform(pcmBuffer: Buffer, buckets = 64): number[] {
	const samples = new Int16Array(
		pcmBuffer.buffer,
		pcmBuffer.byteOffset,
		pcmBuffer.byteLength / 2
	)

	const bucketSize = Math.max(1, Math.floor(samples.length / buckets))
	const waveform: number[] = []

	for (let i = 0; i < buckets; i++) {
		let peak = 0
		const start = i * bucketSize
		const end = Math.min(start + bucketSize, samples.length)
		for (let j = start; j < end; j++) {
			peak = Math.max(peak, Math.abs(samples[j]))
		}
		waveform.push(peak / 32768)
	}

	return waveform
}
