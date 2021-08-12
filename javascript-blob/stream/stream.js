
// The `fetch` API allow us to fetch a resource, such as texts or json contents:

async function fetchJson () {
  const response = await fetch('./stream.json')

  const json = await response.json()

  console.log('json', json)
  document.querySelector('#json').value = JSON.stringify(json)
}

async function fetchText () {
  const response = await fetch('./stream.json')

  const text = await response.text()

  console.log('text', text)
  document.querySelector('#text').value = text
}

// load streams (of only one chunk)
async function fetchJsonStream () {
  const chunks = document.querySelector('#json-chunks')

  const response = await fetch('./stream.small.json')

  const stream = response.body
  const streamReader = stream.getReader()

  // load streams
  // whenever a chunk comes, put it into a temporary array
  const rst = []
  while (true) {
    const { done, value } = await streamReader.read()
    if (done) break // end of loading streams
    console.log('chunk value', value)
    console.log('chunk index:', rst.length)
    chunks.innerHTML += `${rst.length} `
    console.log(
      'chunk value: instanceof Uint8Array ? ',
      value instanceof Uint8Array
    )
    rst.push(value)
  }

  // finally, put them into a blob
  const blob = new Blob(rst, { type: 'text/plain', endings: 'native' })
  const text = await blob.text()

  // console.log('text', text)
  console.log('json', JSON.parse(text))
  document.querySelector('#json-stream').value = text
}

// load real streams
async function fetchLargeJsonStream () {
  const chunks = document.querySelector('#large-json-chunks')

  const response = await fetch('./stream.json')

  const stream = response.body
  const streamReader = stream.getReader()

  // load streams
  // whenever a chunk comes, put it into a temporary array
  const rst = []
  while (true) {
    const { done, value } = await streamReader.read()
    if (done) break // end of loading streams
    console.log('chunk value', value)
    console.log('chunk index:', rst.length)
    chunks.innerHTML += `${rst.length} `
    console.log(
      'chunk value: instanceof Uint8Array ? ',
      value instanceof Uint8Array
    )
    rst.push(value)
  }

  // finally, put them into a blob
  const blob = new Blob(rst, { type: 'text/plain', endings: 'native' })
  const text = await blob.text()

  // console.log('text', text)
  console.log('json', JSON.parse(text))
  document.querySelector('#large-json-stream').value = text
}

// load video streams
async function fetchVideoStream () {
  const chunks = document.querySelector('#video-chunks')

  const response = await fetch('./sample-mp4-file.mp4')

  const stream = response.body
  const streamReader = stream.getReader()

  // load streams
  // whenever a chunk comes, put it into a temporary array
  const rst = []
  while (true) {
    const { done, value } = await streamReader.read()
    if (done) break // end of loading streams
    console.log('chunk index:', rst.length)
    chunks.innerHTML += `${rst.length} `
    rst.push(value)
  }

  // finally, put them into a blob
  const blob = new Blob(rst, { type: 'video/mp4', endings: 'native' })

  // play or download the video blob
  const url = URL.createObjectURL(blob)
  const video = document.querySelector('#video')
  video.src = url // or `window.open(url)`
  video.play()
}
