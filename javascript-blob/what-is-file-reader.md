# 5. FileReader

In some web scenario, we need to handle files.

```html
<input type="file" name="file" id="file" />
```

```javascript
document.querySelector('#file').onchange = e => {
  const file = e.target.files[0]
  console.log('file instanceof File', file instanceof File) // true
  console.log('file instanceof File', file instanceof Blob) // true
}
```

Actually, `File` is the subclass of `Blob`.

`FileReader` is the API we can use to read the file content.

## text

Read [text](./filereader.js#L36), this is usually used if we want to get the text content of a **text file**, such as `.txt`, `.md` etc.

## base64

Read [DataURL(base64)](./filereader.js#L18), this is usually used in images files, sometimes we need to get the `base64` content of a local image and preview it on the web page.

## binary string (deprecated)

Read binary string is deprecated and we suggest you not to use it any more.

## Object URL

An `Object URL` (also known as `Blob URL`) let you reference any data that can be referred to using a DOM File object, including `local files` on our local computer.

Its lifetime is tied to the document in the window on which it was created.

Getting `Object URL` of a `local file`, we don't need `FileReader`, we can use `URL.createObjectURL`.

Through this API, we can [get Object URL](./filereader.js#L22) for web page, such as play a local video in you web page.

## slice

`FileReader` let us read file slice by slice, therefore we can send a file to the server slice by slice.

## ArrayBuffer

We have elaborated [`ArrayBuffer`](./what-is-array-buffer.md) before, by using `FileReader`, we can get the `ArrayBuffer` of a file (or a file slice) easily, see our [example here](./filereader.js#L30) of **reading the file and its `ArrayBuffer` slice by slice**.

[Next Chapter: Download Blob](./how-to-download-a-blob.md)
