const mimeCodec = 'video/mp4; codecs=avc1.42E01E, mp4a.40.2'
console.log(MediaSource.isTypeSupported(mimeCodec)) // Check that browser has support for media codec

const mediaSource = new MediaSource() // mediaSource.readyState === 'closed'
let sourceBuffer

// Attach media source to video element
const video = document.querySelector('video')
video.src = URL.createObjectURL(mediaSource)

// Wait for media source to be open
mediaSource.addEventListener('sourceopen', () => {
  sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)

  let init
  document.querySelector('button').onclick = () => {
    if (init) return
    init = true
    iter()
    video.play()
  }
})

// video segments (or let's say, chunks)
var queue = []
// duration = 10s
// queue.push('./a.mp4') // this does not work https://stackoverflow.com/questions/22996665/unable-to-get-mediasource-working-with-mp4-format-in-chrome
queue.push('./3.mp4')
// duration = 6s
queue.push('./test.mp4')
// duration = 60s
queue.push('./frag_bunny.mp4')

function iter() {
  url = queue.shift()
  if (url === undefined) {
    return
  }
  // Download segment and append to source buffer
  fetchSegmentAndAppend(url, err => {
    if (err) {
      console.error(err)
    } else {
      // iter() // fetch next segment right now
      setTimeout(iter, 15000) // fetch next segment in 15 seconds
    }
  })
}

function fetchSegmentAndAppend(segmentUrl, callback) {
  fetchArrayBuffer(segmentUrl, function (buf) {
    sourceBuffer.addEventListener('updateend', () => {

      // timestampOffset is important
      segmentUrl.indexOf('frag_bunny') !== -1 &&
        (sourceBuffer.timestampOffset += 60)

      segmentUrl.indexOf('test') !== -1 &&
        (sourceBuffer.timestampOffset += 6)
      
      segmentUrl.indexOf('3.mp4') !== -1 &&
        (sourceBuffer.timestampOffset += 11)

      callback()
    })
    sourceBuffer.addEventListener('error', ev => {
      callback(ev)
    })
    sourceBuffer.appendBuffer(buf)
  })
}

function fetchArrayBuffer(url, callback) {
  var xhr = new XMLHttpRequest()
  xhr.open('get', url)
  xhr.responseType = 'arraybuffer'
  xhr.onload = () => {
    callback(xhr.response)
  };
  xhr.send()
}

// references
// https://github.com/w3c/media-source/issues/190
// https://eyevinntechnology.medium.com/how-to-build-your-own-streaming-video-html-player-6ee85d4d078a
