# 7. A quick glimpse of Stream

> you can find all demo code from [here](./stream/stream.js)

> To test the codes of this article, run `node server.js` first and visit `http://localhost:9000/stream/stream.html`

As JavaScript/Web developers, streams are in our every daidy life.

For example, the `fetch` API allow us to fetch a resource, such as texts or json contents:

```javascript
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
```

What we get through network are `response`.

By calling the built-in API `.json()` and `.text()`, we **use** what are received, and convert them into jsons and texts.

`fetch`, `response` and `use`, the **three steps** form the simple model of a network request.

Compared to real life, the steps is: `ask` for something, `receive` it, and `use` it.

But life is not so simple.

Say, you order pizzas for tens of your colleagues, and the pizzas may be delivered in several times by several pizza guys. You have to accept them one by one and hand them out to your colleagues.

Requesting a resource is just similar.

Fetching a large text file or json, the programme also receive it's snippets many times, like catching water through **streams**.

Now we must have comprehended the `Stream` model right?

Let's see how we fetch a resource in `Stream` model:

In this example, we fetch the json content and get the `stream` from the `response`, and we get results from the `stream` instead of the explicit `response`.

Whenever a chunk comes, put it into a temporary(buffered) array.

> A chunk can be a single byte, or it can be something larger such as a `typed array` of a certain size. A single stream can contain chunks of different sizes and types.

## load streams (of only one chunk)

```javascript
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
```

Inside the `while` circulation, we continuously read the stream, and push the result into a buffered array.

Finally, when the stream is done, we can convert the buffered array to a `Blob` and get it's text content.

Here is the result output:

[result]

Sometimes even though we're load streams, but the stream can be only one chunk.

In the example above, we were loading a one chunk stream, that is to say, the status of the stream became `done` after we called `.read()` only once.

To make it more like a real `stream`, we fetch a larger resource below to demonstrate how it works:

## load real streams

```javascript
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
```

If you run the codes above, you'll see **"chunk index ..."** output by `console.log` many times, because the `stream` includes a few data chunks.

The concept of `stream` is widely used in loading videos:

## load video streams

```javascript
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
```

We use `fetch` API to load the datas of a video(say, a `.mp4` file) and wait for the `streams`(chunks).

Whenever a chunk comes, put it into a temporary array.

Finally, put the chunks into a blob, and use the HTML tag `<video />` to handle playing of the video resource.

[Next Chapter: Head First into core stream APIs](./learn-stream-core-api.md)
