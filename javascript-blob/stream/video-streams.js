const mimeCodec = 'video/mp4; codecs="avc1.4D401F"'
console.log(MediaSource.isTypeSupported(mimeCodec)) // Check that browser has support for media codec

const mediaSource = new MediaSource() // mediaSource.readyState === 'closed'
let sourceBuffer

// Attach media source to video element
const video = document.querySelector('video')
video.src = URL.createObjectURL(mediaSource)

// Wait for media source to be open
mediaSource.addEventListener('sourceopen', handleSourceOpen)

function handleSourceOpen() {
  sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)

  let init
  document.querySelector('button').onclick = function () {
    if (init) return
    init = true
    iter()
    video.play()
  }
}

// video segments
var queue = []
queue.push('https://testcontent.eyevinn.technology/mse-tutorial/vinn-video=1660000.dash') // header
queue.push('https://testcontent.eyevinn.technology/mse-tutorial/vinn-video=1660000-0.dash')
queue.push('https://testcontent.eyevinn.technology/mse-tutorial/vinn-video=1660000-25600.dash')
queue.push('https://testcontent.eyevinn.technology/mse-tutorial/vinn-video=1660000-51200.dash')

function iter() {
  url = queue.shift()
  if (url === undefined) {
    return
  }
  // Download segment and append to source buffer
  fetchSegmentAndAppend(url, function (err) {
    if (err) {
      console.error(err)
    } else {
      iter()
      // setTimeout(iter, 5000)
    }
  })
}

function fetchSegmentAndAppend(segmentUrl, callback) {
  fetchArrayBuffer(segmentUrl, function (buf) {
    sourceBuffer.addEventListener('updateend', function (ev) {
      callback()
    })
    sourceBuffer.addEventListener('error', function (ev) {
      callback(ev)
    })
    sourceBuffer.appendBuffer(buf)
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