# 9. Using Streams in more Powerful Ways

## Creating your own ReadableStream

In [A quick glimpse of Stream](./what-is-stream.md), we've been studying creating ReadableStreams from the fetch body, now we are going to create a custom stream by `ReadableStream()` constructor.

By creating a custom ReadableStream, we're able to fill it with our own chunks.

The generic syntax skeleton looks like this:

```javascript
const stream = new ReadableStream({
  start(controller) {

  },
  pull(controller) {

  },
  cancel() {

  },
  type,
  autoAllocateChunkSize
}, {
  highWaterMark,
  size()
})
```

The first parameter is required, which is an object contains 5 members, among which the `start` member is required.

I'm not going to elabrate all the 5 prameter members here, only the most important 3:

- `start(controller)` —— A method is called once, at the time the stream is constructed, inside this method you need to sets up the stream functionality.
- `pull(controller)` —— This method is called repeatedly until the stream’s internal queue is full, to continue enqueueing more chunks.
- `cancel()` —— If called, the stream sends a `stop` signal to the underlying data source, and release access to the stream source.
