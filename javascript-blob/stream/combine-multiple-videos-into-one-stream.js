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

// video segments (or let's say, chunks)
var queue = []
queue.push('./vinn-video=1660000.dash') // header
queue.push('./vinn-video=1660000-0.dash')
queue.push('./vinn-video=1660000-25600.dash')
queue.push('./vinn-video=1660000-51200.dash')

async function startStream() {
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

  const reader = readableStream.getReader()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    sourceBuffer.appendBuffer(value) // feed stream to MSE
  }
}

function fetchSegmentAndAppend(segmentUrl, callback) {
  fetchArrayBuffer(segmentUrl, function (buf) {
    callback(buf)
  })
}

function fetchArrayBuffer(url, callback) {
  var xhr = new XMLHttpRequest()
  xhr.open('get', url)
  xhr.responseType = 'arraybuffer'
  xhr.onload = function () {
    callback(xhr.response)
  };
  xhr.send()
}