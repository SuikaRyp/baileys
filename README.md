# @suikaaxsantanic/starforge

Utility toolkit — cache, mutex, queue, file fetching, QR, zip, and media helpers.

## Install

```bash
npm i @suikaaxsantanic/starforge
```

Some helpers need optional peer packages, installed only if you use them:

```bash
npm i qrcode archiver file-type
```

## Usage

```ts
import { createCache, createMutex, createQueue, getFile, encodeQR, createZip, detectMediaInfo } from '@suikaaxsantanic/starforge'

const cache = createCache({ ttl: 60_000 })
cache.set('key', 'value')

const mutex = createMutex()
await mutex.runExclusive(async () => {
   // exclusive section
})

const queue = createQueue()
await queue.enqueue(async () => {
   // runs one at a time, in order
})

const { buffer } = await getFile('https://example.com/file.png')

const qrPng = await encodeQR('hello world')

const zipBuffer = await createZip([
   { name: 'hello.txt', data: 'Hello, world!' }
])

const info = await detectMediaInfo(buffer)
```

## Build

```bash
npm run build
```

## Publish

```bash
npm login
npm publish
```

## License

MIT © Suikaaxsantanic
