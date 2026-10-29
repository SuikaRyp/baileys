/**
 * Encode text into a QR code PNG buffer.
 * Requires the `qrcode` package: npm i qrcode && npm i -D @types/qrcode
 */
export async function encodeQR(text: string, options?: { width?: number }): Promise<Buffer> {
	const QRCode = await import('qrcode')
	return QRCode.toBuffer(text, {
		width: options?.width ?? 512,
		margin: 1
	})
}
