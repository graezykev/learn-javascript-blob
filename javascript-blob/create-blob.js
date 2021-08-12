document.querySelector('#createblobfromtext').onclick = () => {
  createBlobFromText()
  // input arbitrary text(such as: my family 👨‍👩‍👧‍👦) in `textarea 1` for text
}

document.querySelector('#createblobfromblob').onclick = () => {
  createTextBlobFromBlob()
  // select `select-me.txt` to test, will create a `.txt` file which contains the text inside `select-me.html`
}

document.querySelector('#createblobfromarraybuffer').onclick = () => {
  createBlobFromArrayBuffer()
  // select `select-me.gif` to test
}

document.querySelector('#createblobfrom-file-arraybufferview').onclick = () => {
  createBlobFromFileArrayBufferView()
  // select `select-me.mp4` to test
}

document.querySelector('#createblobfrom-text-arraybufferview').onclick = () => {
  createBlobFromTextArrayBufferView()
  // arbitrary text(such as: my family 👨‍👩‍👧‍👦 blabla) in `textarea 2` for text
}

function createBlobFromText () {
  const text = document.querySelector('#textarea1').value
  if (!text) {
    alert('please input some text first')
    return
  }
  const newBlob = new Blob([text], { type: 'text/plain', endings: 'native' })
  downloadBlob(newBlob, `create-blob-from-text`)
}

function createTextBlobFromBlob () {
  const file = document.querySelector('input[name=file1]').files[0]
  if (!file) {
    alert('please select a [.txt/.html/.js/.css/.md/.csv] file first')
    return
  }
  const { name } = file
  if (!/\.(txt|js|html|css|md|csv)$/i.test(name)) {
    alert('please select a [.txt/.html/.js/.css/.md/.csv] file first')
    return
  }
  const newBlob = new Blob([file], { type: 'text/plain', endings: 'native' })
  downloadBlob(newBlob, `create-blob-from-clone-blob`)
}

async function createBlobFromArrayBuffer () {
  const file = document.querySelector('input[name=file2]').files[0]
  if (!file) {
    alert('please select a file first')
    return
  }
  const { name, type } = file
  const arrayBuffer = await file.arrayBuffer()
  const newBlob = new Blob([arrayBuffer], { type, endings: 'native' })
  downloadBlob(newBlob, `create-blob-from-arraybuffer-${name}`)
}

async function createBlobFromFileArrayBufferView () {
  const file = document.querySelector('input[name=file3]').files[0]
  if (!file) {
    alert('please select a file first')
    return
  }
  const { name, type } = file
  const arrayBuffer = await file.arrayBuffer()
  const uint8array = new Uint8Array(arrayBuffer)
  const newBlob = new Blob([uint8array], { type, endings: 'native' })
  downloadBlob(newBlob, `create-blob-from-file-arraybuffer-view-${name}`)
}

function createBlobFromTextArrayBufferView () {
  const text = document.querySelector('#textarea2').value
  if (!text) {
    alert('please input some text first')
    return
  }
  if (!('TextEncoder' in window)) {
    alert('window.TextEncoder is not supported')
    return
  }
  const encoder = new TextEncoder('utf-8') // default utf-8
  const uint8array = encoder.encode(text)
  // const decoder = new TextDecoder('utf-8')
  // decoder.decode(uint8array) => text
  const newBlob = new Blob([uint8array], {
    type: 'text/plain',
    endings: 'native'
  })
  downloadBlob(newBlob, `create-blob-from-text-arraybuffer-view`)
}

let seq = 0
function downloadBlob (blob, name) {
  // visite filereader.html for further elaboration
  const fileReader = new FileReader()
  fileReader.onload = e => {
    // visite download.html for further elaboration
    const linkId = `download-${Date.now()}`
    document.body.innerHTML += `<a id="${linkId}" download="${seq++}-${name}" href="${
      e.target.result
    }" style="display:none"></a>`
    document.querySelector(`#${linkId}`).click()
  }
  fileReader.readAsDataURL(blob)
}
