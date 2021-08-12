const metainfo = document.querySelector('#metainfo')
const textOutput = document.querySelector('#text')
const textcharcode = document.querySelector('#textcharcode')
const partialTextOutput = document.querySelector('#partial-text')
const arrayBufferOutput = document.querySelector('#arraybuffer')

document.querySelector('#file').onchange = async e => {
  const file = e.target.files[0]

  // see what's inside a [Blob](File)
  console.log('file instanceof Blob ? ', file instanceof Blob)
  const { lastModified, lastModifiedDate, name, size, type } = file

  console.log('meta info', file)

  const kb = size / 1024
  const mb = size / 1024 / 1024

  metainfo.innerHTML = `<div>meta info:</div>${renderJSON2HTML(
    {
      lastModified,
      lastModifiedDate,
      name,
      size: `${
        mb >= 1
          ? `${mb.toFixed(2)} MB`
          : kb >= 1
          ? `${kb.toFixed(2)} KB`
          : `${size} B`
      }`,
      type
    },
    null,
    4
  )}`

  // select `select-me.txt` and see the result below `raw text content`
  getBlobText(file)

  // select `select-me.txt` and see the result below `ArrayBuffer and ArrayBuffer's Uint8Array`
  getBlobArrayBuffer(file)

  // select `select-me.txt` and see the result below `partial(slice) text content (from 0 - 6 bytes)`
  getPartialContentOfBlob(file)

  // select `select-me.txt` and `/stream/stream.json` and see the result in Console.
  getBlobStream(file)
}

async function getBlobText (file) {
  const text = await file.text()
  textOutput.innerHTML = `<div>raw text content:</div><div>${text.replace(
    /\n|\r/,
    '<br/>'
  )}</div>`
  const charcodearray = [...text].map(char => char.charCodeAt(0))
  console.log('charcode of this file from byte to byte', charcodearray)
  textcharcode.innerHTML = `<div>text char code content (charcodes of this file from byte to byte):</div><div>${JSON.stringify(
    charcodearray
  )}</div>`
}

async function getBlobArrayBuffer (file) {
  const arrayBuffer = await file.arrayBuffer()
  console.log(
    'ArrayBuffer:',
    'byteLength',
    arrayBuffer.byteLength,
    typeof arrayBuffer,
    arrayBuffer,
    JSON.stringify(arrayBuffer)
  )

  const uint8array = new Uint8Array(arrayBuffer)
  console.log('Uint8Array', uint8array)
  console.log(typeof uint8array)
  console.log(JSON.stringify(uint8array))
  arrayBufferOutput.innerHTML = `<div>ArrayBuffer and ArrayBuffer's Uint8Array:</div><div>${renderJSON2HTML(
    uint8array
  )}</div>`
}

async function getPartialContentOfBlob (file) {
  const partial = file.slice(0, 6, 'text/plain')
  const partialText = await partial.text()
  partialTextOutput.innerHTML = `<div>partial(slice) text content (from 0 - 6 bytes):</div><div>${partialText.replace(
    /\n|\r/,
    '<br/>'
  )}</div>`
}

function renderJSON2HTML (object) {
  return JSON.stringify(object, null, 4)
    .replace(/\n|\r/g, '<br/>')
    .replace(/\s/g, '&nbsp;')
}

// see `/stream/stream.html` for `what is stream`
async function getBlobStream (file) {
  const stream = file.stream()
  const streamReader = stream.getReader()
  const rst = []
  while (true) {
    const { done, value } = await streamReader.read()
    if (done) break
    console.log('chunk index:', rst.length)
    rst.push(value)
  }
}
