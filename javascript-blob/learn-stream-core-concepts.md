# 8. Learn stream core concepts

In last chapter [A quick glimpse of Stream](./what-is-stream.md), we demonstrated how `Stream` works: The `response` body returned by a successful `fetch` request can be exposed as a `ReadableStream`, and you can then read it using a reader created with `ReadableStream.getReader()`, then you can get chunk datas (`Uint8Array`) by `reader.read()`. Finally, assemble the chunks into a `Blob`.

## ReadableStream Main Concepts

Before you can handle the plenty of Stream APIs, there're some basic concepts you need to know first.

### Constructor: Stream Source

A ReadableStream is a data source that flows from an underlying source, somewhere from the Internet or on your local computer.

There are two types of underlying source:

- `Push sources` constantly push data at you when you’ve accessed them, and it is up to you to start, pause, or cancel access to the stream. Examples include video streams and TCP/Web sockets.

- `Pull sources` require you to explicitly request data from them once connected to. Examples include a file access operation via a `Fetch` or `XHR` call.

The `Response.body` from a `fetch` request, is a ready-to-use `ReadableStream`, besides, you can make your own Streams using the [`ReadableStream()`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/ReadableStream) constructor.

### Chunks

A `Stream` consist of `chunks`.

A chunk can be `a single byte`, or it can be a certain number of bytes like a `typed array`(`Unit8Array`).

A single stream can contain chunks of different **sizes** and **types**.

The chunks inside a stream is **enqueued**, namely, there's an internal queue to save the unread chunks, and the chunks must be read according to their sequence, we'll talk about `queuing strategies` in this chapter later.

### Reader

The reader is what you use to read chunks inside a stream, it processes one chunk at a time.

### Consumer & Controller

The reader plus the other processing code that goes along with it is called a `consumer`.

For example, in the last chapter [A quick glimpse of Stream](./what-is-stream.md), we collected the chunks and made a Blob, and feed it to the `<video />`, was a way of consuming the stream.

Usually, you use a reader to start, pause, close, or cancel the stream, these associated logic allow you to control the stream, which, we call it `Controller`.

### Lock

Only one reader can read a stream at a time, that is to say, on a reader starts to read a stream, the reader is `locked` to the stream.

If you want another reader to read the stream, you need to cancel the former reader first.

### Teeing

Though only one reader can read one stream, we can still split one stream into two, which is `teeing` a stream via the `ReadableStream.tee` API.

Teeing is a way to copy the original stream, which outputs two identical copied streams.

## WritableStream

A readable stream is a destination from which you can read data, relatively speaking, a `writable stream` is what into which you can write data.

In contrast to **Reader** and **Consumer** of ReadableStream, `WritableStream` has **Writer**, **Producer**. In addition, **Controller**, **lock**, **internal queue**, are also common strategies working inside writable stream.

## Transform streams

A `TransformStream` consists of a pair of `WritableStream` and `ReadableStream`.

In general, a transform stream defines algorithms for the specific transformation of streams.

Here are some scenario examples transform streams may come on stage:

- A GZIP compressor, to which uncompressed bytes are written and from which compressed bytes are read;
- A Video decoder, to which encoded bytes are written and from which uncompressed video frames are read;
- A CSV-to-JSON converter, to which strings representing lines of a CSV file are written and from which corresponding JavaScript objects are read.

Whatever kind of transform stream it is, the core use of `TransformStream` is **transforming** datas the ritable side provides, to the readable side.

## Pipe chains

It's possible to pipe streams into one another.

## Queuing strategies

I've mention above there's an internal queue to keep track of the unread chunks.

**`High water mark`**, is the largest total chunk size that the queue can realistically manage, and the gap between `high water mark` and total size of chunks in queue is call **`desired size`**, which is the size of chunks the queue can still accept.

`Desired size` = `high water mark` - `total size of chunks in queue`.

The queue will keep calculating desired size while receiveing chunks, if it fall to zero, means that the queue is full, namely the chunks are being generated too fast, may results in problems.

When high water mark is reached, **`backpressure`** is applied.

## Backpressue

`Backpressue` is another important concept is stream, who regulates the speed of reading/writing.

When the queue reaches high water mark, the stream sends a `signal` to the original source to slow down delivery of data as appropriate, that is to say, 'I'm busy now, you're sending me data faster than I can cope with'.

The API `ReadableStreamDefaultController.desiredSize` is used to query the desired size, if it is too low, our ReadableStream can tell its underlying source to stop sending data. Later, if the strem wants to receive data again, we can use `readableStream.pull()` to the underlying source to feed data again.

[Next Chapter: Using Stream](./how-to-further-use-stream.md)
