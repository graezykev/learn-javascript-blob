# 3. How do we create Blob(s)

## local files

As we mention above, we can get a Blob by `<input type="file" />`.

There're many other ways to create a Blob.

## DOM string

by specific [text](./create-blob.js#L2), usually used to create text files.

## another Blob(file)

by an existing [Blob(file)](./create-blob.js#L7), this example is kind of like cloning a file.

## ArrayBuffer

by [ArrayBuffer](./create-blob.js#L12). In this example, we get the `ArrayBuffer` from a file, then use the `ArrayBuffer` inside the `constructor` method of `Blob`.

## ArrayBufferView (Uint8Array etc.)

by [ArrayBufferView(of a file)](./create-blob.js#L17). In this example, we build an `Uint8Array` from the `ArrayBuffer` of a file, then use the `Uint8Array` inside the `constructor` method of `Blob`.

by [ArrayBufferView(of some some specific text)](./create-blob.js#L22). In this example, we use a UTF8 text encoder to **transfer text into an `Uint8Array`**, then use the `Uint8Array` inside the `constructor` method of `Blob`.

[Next Chapter: ArrayBuffer](./what-is-array-buffer.md)
