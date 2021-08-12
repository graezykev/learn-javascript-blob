# 1. What is Blob

**Blobs** are binary objects.

A **file** in a computer is a Blob (`File` extends `Blob`).

So what we get from `<input type="file" />` (DOM event target) is a Blob:

```javascript
document.querySelector('input[type=file]').onchange = e => {
  const file = e.target.files[0]
  console.log('file instanceof Blob ? ', file instanceof Blob) // true
}
```

**Binary contents in memory** can also be Blob(s).

JavaScript provides many APIs to create and manipulate Blobs, we'll talk about those APIs later in [Chapter 3](./how-do-we-create-blob.md).

[Next Chapter: What we can do with Blob(s)](./what-we-can-do-with-blob.md)
