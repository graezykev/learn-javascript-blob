const output = document.querySelector('#output')

document.querySelector('#file').onchange = e => {
  const file = e.target.files[0]

  console.log('file instanceof File', file instanceof File) // true
  console.log('file instanceof File', file instanceof Blob) // true

  const { name, size } = file

  if (/\.(jpe?g|png|gif)$/i.test(name)) {
    // see how to read an [image]
    // select `select-me.gif` to test
    readDataURL(file)
  } else if (/\.mp4$/i.test(name)) {
    // see how to read a [media file]
    // select `select-me.mp4` to test
    readObjectURL(file)
  } else if (/\.docx$/i.test(name)) {
    // see how to read a [binary file] (deprecated)
    // select `select-me-binary.docx` to test
    readBinaryString(file)
  } else if (size / 1024 / 1024 >= 10) {
    // see how to read a large file(blob) slice by slice
    // select `select-me-large-file.txt` to test
    readArrayBufferSliceBySlice(file)
  } else {
    // see how to read a [text file]
    // select `select-me.txt` to test
    // select `select-me.html` to test
    // select `select-me.js` to test
    readTEXT(file)
    readDataURL(file)
  }
}

// see FileReader readyState(s)
const FileReaderReadyState = {
  EMPTY: 0,
  LOADING: 1,
  DONE: 2
}

function readTEXT (file) {
  const fileReader = new FileReader()
  console.log(
    'fileReader.readyState === EMPTY ?',
    fileReader.readyState === FileReaderReadyState.EMPTY
  )

  fileReader.onload = event => {
    console.log(
      'fileReader.readyState === DONE ?',
      fileReader.readyState === FileReaderReadyState.DONE
    )
    console.log('FileReader: file onload', fileReader)
    console.log(`fileReader === event.target ? `, fileReader === event.target)
    output.innerHTML += `<div style="color: red;">text content:</div>${event.target.result
      .replace(/\n|\r/, '<br />')
      .replace(/</g, '&lt;')}`
  }

  fileReader.onerror = () => {} // .onloadstart // .onloadend // .onprogress

  fileReader.readAsText(file, 'UTF-8') // asynchronous API
  console.log(
    'fileReader.readyState === LOADING ?',
    fileReader.readyState === FileReaderReadyState.LOADING
  )

  // fileReader.abort() // stop read Blob
  // fileReader.onabort = () => {}
}

function readDataURL (file) {
  const fileReader = new FileReader()

  fileReader.onload = event => {
    console.log('FileReader: file onload', fileReader)
    output.innerHTML += `<div style="color: red;">Data URL content:</div>${event.target.result}<img src="${event.target.result}" />`
  }

  fileReader.readAsDataURL(file) // asynchronous API
}

function readArrayBufferSliceBySlice (file) {
  const { size } = file
  const kb = size / 1024
  const mb = kb / 1024
  console.log(
    'large file',
    mb >= 1 ? `${mb} MB` : kb >= 1 ? `${kb} KB` : `${size} B`
  )
  output.innerHTML += `<div style="color: green">file size: ${size}</div>`
  output.innerHTML += `<div>
    <div style="color: green">progress:</div>
    <div id="progress" style="background-color: green; height: 5px;"></div>
  </div>`

  const CHUNK_SIZE = 1024 * 1024
  let offset = 0
  let end = 0

  const fileTextReader = new FileReader()
  fileTextReader.onload = () => {
    const buffer = fileTextReader.result
    console.log(
      'fileTextReader.result instanceof ArrayBuffer ?',
      buffer instanceof ArrayBuffer
    )

    // ArrayBuffer to ArrayBufferView
    const uint8Array = new Uint8Array(buffer)
    // ArrayBufferView to binary
    const binArray = [...uint8Array].map(byte => byte.toString(2))
    console.log(`binary of ${offset} to ${end}`, binArray.join(''))

    // don't do this, can take a long time
    // output.innerHTML += `
    //   <div style="color: red;">slice from ${offset} to ${end} bytes</div>
    //   <div style="max-height: 100px; overflow: auto;">${uint8Array.toString()}</div>
    // `

    document.querySelector('#progress').style.width = (end / size) * 100 + '%'

    // continue the next slice
    offset += CHUNK_SIZE
    readSlice()
  }

  function readSlice () {
    if (offset >= size) return
    end = offset + CHUNK_SIZE
    if (end >= size) {
      end = size - 1
    }
    const slice = file.slice(offset, end)
    // we can cut the whole file into pieces, and distribute them to others
    fileTextReader.readAsArrayBuffer(slice)
  }

  readSlice()
}

function readObjectURL (file) {
  const url = URL.createObjectURL(file)
  // synchronous API
  // [caveat:] use `URL.revokeObjectURL(url)` to free the memory
  output.innerHTML += `<div style="color: red;">Blob URL content:</div> <video id="video" src="${url}" controls />`
  document.querySelector('#video').play()
}

// deprecated API: don't use it any more!
function readBinaryString (file) {
  const fileReader = new FileReader()

  fileReader.onload = event => {
    output.innerHTML += `<div style="color: red;">binary text content:</div>${event.target.result}`
  }

  fileReader.readAsBinaryString(file)
}
