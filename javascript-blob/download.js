document.querySelector('#download-arraybuffer').onclick = () => {
  // see how to download a text file from ArrayBufferView (which we get from the input text)
  downloadFileFromArrayBuffer()
}

function downloadFileFromArrayBuffer () {
  const binary = document.querySelector('#arraybuffer-text').value
  if (!binary) {
    alert('input array buffer first')
    return
  }
  const bytes = []
  let i = 0
  // parse ArrayBuffer(binaries) into bytes
  while (binary[i]) {
    bytes.push(binary.slice(i, i + 8))
    i = i + 8
  }
  // parse bytes into Unicode decimal number
  const array = bytes.map(byte => parseInt(byte, 2))
  // parse Unicode decimal numbers into `Uint8Array`
  const uint8array = new Uint8Array(array)
  // use the Uint8Array to create a new Blob
  const blob = new Blob([uint8array], { type: 'text/plain', endings: 'native' })

  const url = URL.createObjectURL(blob)

  const linkId = `download-${Date.now()}`
  document.body.innerHTML += `<a id="${linkId}" download="text-file-from-arraybufferview-of-input-text-${Date.now()}" href="${url}" style="display:none"></a>`
  document.querySelector(`#${linkId}`).click()
}

document.querySelector('#download-slice-by-slice').onclick = () => {
  // see how to
  // download slice by slice
  // combine files into one
  // try select `select-me.js` and `select-me.txt` and `select-me.html` together to test
  downloadSliceBySlice()
}

function downloadSliceBySlice () {
  const files = document.querySelector('[name=file1]').files
  if (files.length < 2) {
    alert('please select more than one text files')
    return
  }
  const list = [...files]
  const blobs = []
  list.forEach(file => blobs.push(new Blob([file])))
  const blob = new Blob([...blobs], { type: 'text/plain', endings: 'native' })

  const url = URL.createObjectURL(blob)

  const linkId = `download-${Date.now()}`
  document.body.innerHTML += `<a id="${linkId}" download="combine-slice-by-slicet-${Date.now()}" href="${url}" style="display:none"></a>`
  document.querySelector(`#${linkId}`).click()
}

document.querySelector('#download-dataurl1').onclick = () => {
  // see how to download an text file from base64
  downloadFileFromDataURL1()
}

function downloadFileFromDataURL1 () {
  const dataURL1 = document.querySelector('#text-base64').value
  const filename = `text-from-base64-${Date.now()}`

  const linkId = `download-${Date.now()}`
  document.body.innerHTML += `
    <a
      href="${dataURL1}"
      download="${filename}"
      style="display:none;"
      id="${linkId}"
    >
      download
    </a>
  `
  document.querySelector(`#${linkId}`).click()
}

document.querySelector('#download-dataurl2').onclick = () => {
  // see how to download an text file from [DataURL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)
  downloadFileFromDataURL2()
}

function downloadFileFromDataURL2 () {
  const dataURL2 = document.querySelector('#text-dataurl').value
  const filename = `text-from-dataurl-${Date.now()}`

  const linkId = `download-${Date.now()}`
  document.body.innerHTML += `
    <a
      href="${dataURL2}"
      download="${filename}"
      style="display:none;"
      id="${linkId}"
    >
      download
    </a>
  `
  document.querySelector(`#${linkId}`).click()
}

document.querySelector('#downloadbase64').onclick = () => {
  // see how to download an [image] from [base64] string
  downloadImageFromBase64()
}

function downloadImageFromBase64 () {
  const filename = `image-from-base64-${Date.now()}`

  var base64Content = document.querySelector('#img-base64').value.trim()

  const linkId = `download-${Date.now()}`
  document.body.innerHTML += `
    <a
      href="${base64Content}"
      download="${filename}"
      style="display:none;"
      id="${linkId}"
    >
      download
    </a>
  `
  document.querySelector(`#${linkId}`).click()
}
