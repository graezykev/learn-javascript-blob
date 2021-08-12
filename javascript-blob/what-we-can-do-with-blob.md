# 2. What we can do with Blob(s)

## meta info

get it's [name, size, type, last modified timestamp](./blob.js#L20) etc.

## text content

get it's [text content](./blob.js#L33) (if it is a text file).

## ArrayBuffer (byte array)

get it's [Array Buffer](./blob.js#L36) (also known as byte array), Let's elaborate `ArrayBuffer` below later, or you can refer to [Chapter 4](./what-is-array-buffer.md) right now.

## partial fragment of Blob

get [partial content](./blob.js#L39) of a file, namely, slice the file into pieces.

By doing this, we can make lots of imaginative things happend, such as sending a file to others in batches, I'll elaborate `Blob.prototype.slice()` later in [FileReader](./what-is-file-reader.md).

## readable stream

get a [readable stream](./blob.js#L42) of the file. Actually, this is another way to read blobs slice by slice (chunk by chunk). Similarly, I'll elaborate `Readable Stream` later.

[Next Chapter: How do we create Blob(s)](./how-do-we-create-blob.md)
