# 6. Download Blob

Downloading files is another common scenario in web.

If we have a URL refering to a file, we can download it by `fetch` API:

```javascript
fetch(`https://test.co/i-am-a-file.docx`)
  .then(res => res.blob())
  .then(blob => {
    console.log(blob instance of Blob) // true
    const a = document.createElement('a')
    const url = URL.createObjectURL(blob)
    const filename = fileName
    a.href = url
    a.download = filename
    a.click()
  })
```

In this example, we use `fetch` to download the file content, and use a hidden `<a>` to link to the blob we want to download, and specify a `download` attribute to the `<a>`.

We have many other way to download a file. As we mention in [how do we create a blob](./how-do-we-create-blob.md), we have many ways to create blobs, all blobs created (in memory) by those ways, can be save to our local disk.

## Simple DOM string

If we have some plain text, we can save them into a text file:

```javascript
const blob = new Blob(['your text content'], {
  type: 'text/plain',
  endings: 'native'
})
const a = document.createElement('a')
const url = URL.createObjectURL(blob)
const filename = 'fileName.txt'
a.href = url
a.download = filename
a.click()
```

## DataURL

If we have the `base64` or other `DataURL`, we can save them into a file.

In the example below, we have the base64 content of a text file, we can download it by specify the `base64` content to `<a>`:

```html
<textarea id="text-base64">
data:text/plain;base64,cmVsZWFzZQp0ZXh0Cg==</textarea
>
<button id="download-dataurl1" href="javascript:;">
  download text file from base64 above
</button>
```

```javascript
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
  // <a href="data:text/plain;base64,cmVsZWFzZQp0ZXh0Cg==">
  document.querySelector(`#${linkId}`).click()
}
```

`DataURL` can be `base64`, it can also be in other forms, like plain text:

```html
<textarea id="text-dataurl">data:text/plain,fdfsdfsdf\nfsdfs</textarea>
<button id="download-dataurl2" href="javascript:;">
  download text file from DataURI above
</button>
```

```javascript
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
  // <a href="data:text/plain,fdfsdfsdf\nfsdfs">
  document.querySelector(`#${linkId}`).click()
}
```

Please also see the example of how to [download an image by using its base64 string](./download.js#L110).

## slice by slice

If we have multiple files, or multiple APIs to get file slice, we can **combine and download** them in a file.

```html
<div>
  select more than 1 text files here <input type="file" name="file1" multiple />
</div>
<button id="download-slice-by-slice" href="javascript:;">
  download text file from the above files (as it's slices)
</button>
```

```javascript
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
```

## ArrayBuffer

This is not a common scenario in web.

If we have only got the `ArrayBuffer` (sequence of 0 and 1), we can also download it as a file:

```html
<textarea id="arraybuffer-text"></textarea>
<button id="download-arraybuffer" href="javascript:;">
  download text file from array buffer view of the text
</button>
<script>
  const encoder = new TextEncoder('utf-8')
  // put array buffer of the text to the <textarea>
  document.querySelector('#arraybuffer-text').value = [
    ...encoder.encode('abc 👨‍👩‍👧‍👦 我')
  ]
    .map(x => {
      const bin = x.toString(2)
      if (bin.length < 8) {
        return new Array(8 - bin.length)
          .fill('0')
          .join('')
          .concat(bin)
      }
      return bin
    })
    .join('')
</script>
```

```javascript
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
```

[Next Chapter: Streams](./what-is-stream.md)
