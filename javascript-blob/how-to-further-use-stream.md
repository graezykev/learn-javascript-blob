# 9. Build your Stream - Make Amazting Happens

## Creating your own ReadableStream

In [A quick glimpse of Stream](./what-is-stream.md), we've been studying creating ReadableStreams from the fetch body, now we are going to create a custom stream by `ReadableStream()` constructor.

By creating a custom ReadableStream, we're able to fill it with our own chunks.

The generic syntax skeleton looks like below:

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

I'm not going to elabrate all the 5 prameter members here, only the most important 3 of them:

- `start(controller)` —— A method is called once, at the time the stream is constructed, inside this method you need to sets up the stream functionality.

  Inside `start` method, we use `controller.enqueue()` to enqueue ArrayBuffers of others into the internal queue.

- `pull(controller)` —— This method is called repeatedly until the stream’s internal queue is full, to continue enqueueing more chunks.

- `cancel()` —— If called, the stream sends a `stop` signal to the underlying data source, and release access to the stream source.

## Build Your own Chunks

In the example below, we're going to combine many videos into one and play them in one `<video />`, depending on the powerfull `ReadableStream` and [MSE (Media Source Extensions)](https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API).

### MSE (Media Source Extensions): A short introduction

Of course, you may not understand what `MSE` is, we don't want to interpret too much here, since that will take a long time, what you only need to know is **a `MediaSource` is a container aways ready to receive video streams**.

All web developers know how to play videos:

```html
<video src="https://test.xxx.com/yyy.mp4" />
```

This allow us to download a `.mp4` video and play it on webpages.

However, if the `.mp4` video is very large, for instance, a video of 100 Gigabytes, it definitely takes a long time on loading.

Or, let's say we are playing a `livestream` on web, it's impossible to put the videos that havn't arrived into a `.mp4` file.

`MediaSource` make it possible to play while downloading at the same time, by splitting a video into small pieces (chunks), and download and play them one by one.

```javascript
// you don't need to understand too much about the codes below

let mediaSource
let sourceBuffer

function initMediaSourceExtention() {
  const mimeCodec = 'video/mp4; codecs="avc1.4D401F"'
  console.log(MediaSource.isTypeSupported(mimeCodec)) // Check that browser has support for media codec

  mediaSource = new MediaSource() // mediaSource.readyState === 'closed'

  // Attach media source to video element
  const video = document.querySelector('video')
  video.src = URL.createObjectURL(mediaSource)

  // Wait for media source to be open
  mediaSource.addEventListener('sourceopen', () => {
    sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)

    let init // init only once
    document.querySelector('button').onclick = function () {
      if (init) return
      init = true

      startStream()
      video.play()
    }
  })
}

initMediaSourceExtention()
```

### Step by Step

See all codes of how to [combine multiple videos into one stream](./stream/combine-multiple-videos-into-one-stream.js), we're going to explain the main steps below.

Our way of doing this is, firstly, we may prepare several (mp4) videos files' url, In this scenario, these videos, become the chunks of our `ReadableStream`.

```javascript
// video segments (or let's say, chunks)
var queue = []
queue.push('./vinn-video=1660000.dash') // header
queue.push('./vinn-video=1660000-0.dash')
queue.push('./vinn-video=1660000-25600.dash')
queue.push('./vinn-video=1660000-51200.dash')
```

Then, we construct a new `ReadableStream`, and continuously fetch the video files.

Whenever a video content (ArrayBuffer) is received, enqueue it into the `ReadableStream`'s internal queque.

```javascript
const readableStream = new ReadableStream({
  start(controller) {
    function iter() {
      url = queue.shift()
      if (url === undefined) {
        return
      }
      fetchSegmentAndAppend(url, function (buf) {
        controller.enqueue(buf)
        setTimeout(iter) // continue to fetch next segment
      })
    }
    iter()
  }
})
```

On the other side, feed the `ReadableStream` to a `MediaSource`.

```javascript
const reader = readableStream.getReader()

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  sourceBuffer.appendBuffer(value) // feed stream to MSE
}
```

![combine-chunks](https://tva1.sinaimg.cn/large/008i3skNgy1gujsb193qoj629b0dmdik02.jpg)

### In a nutshell

## More Stream Applications

### HLS(HTTP Live Streaming) and `.m3u8` and `.ts` - `hls.js`

### `YouTube` playbacks

Let's take a look at what happen when watching a YouTube video.

As time goes by, the page keep loading some playback files.

![comment3](https://tva1.sinaimg.cn/large/008i3skNgy1guksawsfgag616f0mekjz02.gif)

Not like `hls.js` downloads `.ts` file one by one, YouTube downloads playbacks one by one.

Actually, those playbacks are also small video segments (`audio/webm`) of the whole video.

![image-2021091824530755 pm](https://tva1.sinaimg.cn/large/008i3skNgy1guks30npthj618w0mbn3q02.jpg)

In principle, it's a much better way to play along with downloading video segments, instead of downloading a whole large video at a time, it's `Stream` make all these happen.
