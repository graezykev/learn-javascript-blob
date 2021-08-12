# 4. ArrayBuffer

### Parse text to 0 and 1

Let's say, we have a text file, of which the content is `"Relea-se"`, how does computers store the data?

As we all know, computers don't understand anything but 0 or 1, let's get the binary content of the text:

```javascript
const binContent = [...'Relea-se'].map(c => c.charCodeAt(0).toString(2))
console.log(binContent)
// output: ["1010010", "1100101", "1101100", "1100101", "1100001", "101101", "1110011", "1100101"]
const sequence = binContent.join('')
console.log(sequence)
// output: 1010010110010111011001100101110000110110111100111100101
```

See, we have translated the text into `sequence of 1 and 0`.

Inside the sequence, `1010010`(7 bits) represents charater `'R'`, while `101101`(6 bits) represents dash `'-'`.

![image-20210617122144955 pm](https://tva1.sinaimg.cn/large/008i3skNgy1grl5rvgb3xj32fi0gedh2.jpg)

However, if we send the sequence to others, they don't know whether they should read `7 bits` or `6 bits` as one character unit, that is to say, they don't know how many bits they need to read at one time.

If they read 7 bits per time, they will misunderstand `'-'`

![image-20210617123017964 pm](https://tva1.sinaimg.cn/large/008i3skNgy1grl5s09yjvj32fq0giabu.jpg)

Similarl'y, if they read 6 bits per time, will make other mistakes.

![image-20210617123737144 pm](https://tva1.sinaimg.cn/large/008i3skNgy1grl5s57cdfj32fq0gc40c.jpg)

Therefore, we have to set some **rules** first.

### Rules to read 0 and 1

Above all, we make a deal that every 8 bits (1 byte) is a character, but before we transmit the sequence one another, let's implement the `binContent` of every character into 8 bits, by putting `'0'`s in front of them.

```javascript
const realBin = binContent.map(bin => {
  if (bin.length < 8) {
    return new Array(8 - bin.length)
      .fill('0')
      .join('')
      .concat(bin)
  }
  return bin
})
console.log(realBin)
// output: ["01010010", "01100101", "01101100", "01100101", "01100001", "00101101", "01110011", "01100101"]
const sequence2 = realBin.join('')
console.log(sequence2)
// output: 0101001001100101011011000110010101100001001011010111001101100101
```

By this way, `'R'` becomes `01010010` (`0` + `1010010`), `'-'` becomes `00101101` (`00` + `101101`), and they are all 8 bits.

Now, we can send `sequence2` to other computers, and if they know the rule, they can read the sequence every 8 bits (1 byte) as a single data unit every time, and translate the sequence of 0 and 1 into real world text that we human beings can understand.

![image-20210617124950034 pm](https://tva1.sinaimg.cn/large/008i3skNgy1grl64242s7j328s0b2jsb.jpg)

Actually, using 0 and 1 to represent all characters is not that simple as I mention above, such as:

```javascript
console.log('我'.charCodeAt(0).toString(2))
// output: "110001000010001"
```

We are not able to represents the character `'我'` within 8 bits, since it is `110001000010001` (15 bits).

So, we need other **rules** to let computers know the character `'我'` . For detail of this, you can refer to [`UTF-8`](https://blog.hubspot.com/website/what-is-utf-8) for further elaboration.

And, if we want to let computers understand videos, Microsoft Word documents, we need lots of other **rules**.

Finally, by making **rules** of how to understand them, **sequences of 0 and 1 can represent all kinds of contents** we need, including videos, excels, application program etc.

## `ArrayBuffer`

Also known as `byte array` in other languages.

It is **fixed-length arrays of raw binary data**, eache item is 1 byte, i.e. each `buffer` represent 1 byte.

So, as we mention above, the sequence of 0 and 1 can be `ArrayBuffer` if we split them into `groups of 8 bits`.

`ArrayBuffer`s are the bytes of the Blob in memory.

## `ArrayBufferView`

As we talk about earlier, we need lots of **rules** to let computers understand the bytes.

Take an arbitrary byte in a file for example, let's say, the byte is `11111100`, if you look at it as a `signed interger`, it is `-4`, if you look at it as a `unsigned integer`, it is `252`.

The way we look at one byte is `view`, so the way we look at the whole `ArrayBuffer` is `ArrayBufferView`.

`ArrayBufferView`, **firstly**, decides whether you use 1/2/4 (or more) bytes as a [data unit].

for example, 1 byte can represent 256 charaters (256 = 2^8), if you use 1 byte as a data unit in a text file, the bytes can compose into all kinds of English articles.

![image-2021061720850158 pm](https://tva1.sinaimg.cn/large/008i3skNgy1grl8esam2vj325m09sgmp.jpg)

However, by this way you can't include all Chinese charaters in a file (there are tens of thousands of diffrent Chinese charaters), maybe you need 2 bytes to represent Chinese.

![image-2021061721347381 pm](https://tva1.sinaimg.cn/large/008i3skNgy1grl8jxky06j326m0aq3zd.jpg)

> google `UTF-8` for further elaboration and examples.

**Secondly**, `ArrayBufferView` decides what kinds of number the data unit represents.

For example, `11111110` can represents `254` as well as `-2`.

Now we can say `ArrayBufferView` represents the **rules** of how computers **read & write** the binary bytes.

### TypeArray

There're 12 `views` we can use to read & write an `ArrayBuffer`, and we call them `TypeArray`(s):

- `BigInt64Array`
- `BigUint64Array`
- `Float32Array`
- `Float64Array`
- `Int8Array`
- `Int16Array` : signed 16 bit integer
- `Int32Array`
- `Uint8Array` : unsigned 8 bit integer
- `Uint8ClampedArray`
- `Uint16Array`
- `Uint32Array`

**TypeArrays are for homogeneous data**. Take `Uint32Array` as an example, if you use `Uint32Array` to manipulate an `ArrayBuffer`, so every 4 (=32/8) bytes is a data unit, and every unit is a unsigned integer.

So, `11110000 11110000 11110000 11110000` is `4042322160` but not `-252645136`.

And, `4042322160` can be a [`Unicode`](https://unicode-table.com/en/#basic-latin) character if it is a text file, it can also be a `if` statement of a Application Program, which depends on what kind of `blobs` format you want the binaries to be.

### DataView

However, there are obvious limits if we only use homogeneous data to manipulate `ArrayBuffer`.

For example, we've got the text `"what a character 我"`.

If we use `Uint8Array` (8 bits per data unit, can only represents 256 = 2 ^ 8 characters) to read it, we can not read the character `"我"`.

If we use `Uint32Array` to read it, we can read the character `"我"` (4 bytes = 32 bits) and other characters.

Nevertheless, in the meantime we also have to use 32 bits to represents those English character, which can be a waste of storage space / memory space.

To deal with this, **we can use `DataView` for heterogenous data**, which is mixture of all `TypeArray`(s).

You can use diffrent method(`TypeArray`s) to write & read an `ArrayBuffer`, which is `DataView`.

By this way, the length of data units are not fixed, that is to say, when computers read a sequence of 0 and 1, they may use either 1 byte or 2 or 3 bytes as a data unit, denpending on the rules of the file format.

### JavaScript APIs

JavaScript provides many APIs to manipulate `ArrayBuffers`.

```javascript
whatIsTypeArray_Uint8_to_Uint16()

function whatIsTypeArray_Uint8_to_Uint16 () {
  console.warn('TypeArray: Uint8 to Uint16 ====== ')
  const byteLength = 8
  const buffer = new ArrayBuffer(byteLength)
  console.log('buffer byte size', buffer.byteLength)
  console.log(
    'origin buffer',
    '00000000 | 00000000 | 00000000 | 00000000 | 00000000 | 00000000 | 00000000 | 00000000'
  )
  // buffer =>
  // 00000000 | 00000000 | 00000000 | 00000000 | 00000000 | 00000000 | 00000000 | 00000000
  /*
  {
    0: 00000000, => 0
    1: 00000000, => 0
    2: 00000000, => 0
    3: 00000000, => 0
    4: 00000000, => 0
    5: 00000000, => 0
    6: 00000000, => 0
    7: 00000000, => 0
  }
  */

  const uint8 = new Uint8Array(buffer)
  console.log('origin uint8', uint8)
  // uint8 =>
  // [0, 0, 0, 0, 0, 0, 0, 0]

  const uint16 = new Uint16Array(buffer)
  console.log('origin uint16', uint16)
  // uint16 =>
  /*
  [
    1, 0, => 00000000 | 00000000 => 0
    3, 2, => 00000000 | 00000000 => 0
    5, 4, => 00000000 | 00000000 => 0
    7, 6, => 00000000 | 00000000 => 0
  ]
  */
  // [0, 0, 0, 0]

  uint8.set([1, 2, 3], 2) // set (unsigned 8 bit integer) 1, 2, 3 into buffer from index 2
  console.log('uint8 is set to', uint8)
  // uint8 =>
  // [0, 0, 1, 2, 3, 0, 0, 0]

  console.log(
    'buffer is set to',
    '00000000 | 00000000 | 00000001 | 00000010 | 00000011 | 00000000 | 00000000 | 00000000'
  )
  // buffer =>
  /*
  {
    0: 00000000, => 0
    1: 00000000, => 0
    2: 00000001, => 1
    3: 00000010, => 2
    4: 00000011, => 3
    5: 00000000, => 0
    6: 00000000, => 0
    7: 00000000, => 0
  }
  */
  // 00000000 | 00000000 | 00000001 | 00000010 | 00000011 | 00000000 | 00000000 | 00000000

  console.log('uint16 is set to', uint16)
  // uint16 =>
  /*
  {
    1, 0, => 00000000 | 00000000 => 0
    3, 2, => 00000010 | 00000001 => 513
    5, 4, => 00000000 | 00000011 => 3
    7, 6, => 00000000 | 00000000 => 0
  }
  */
  // [0, 513, 3, 0]
}
```

In the example above, we initiate an `ArrayBuffer` of 8 bytes length.

The data is `[0, 0, 0, 0, 0, 0, 0, 0]` is you look at those bytes as `Uint8Array`s (1 byte as an data unit), and the data is `[0, 0, 0, 0]` if you look at them as `Uint16Array`s (2 bytes as an data unit).

Then we use `Uint8Array` format to write data `[1, 2, 3]` into the buffers from **byte index 2**.

So, the `Uint8Array`s become `[0, 0, 1, 2, 3, 0, 0, 0]`.

And what will the `Uint16Array`s become?

First we can see the binaries become `00000000 | 00000000 | 00000001 | 00000010 | 00000011 | 00000000 | 00000000 | 00000000` (I use `|` to separate every byte), which are:

```javascript
// byte index : byte value (bin) => decimal number
{
    0: 00000000, // byte 1 => 0
    1: 00000000, // byte 2 => 0
    2: 00000001, // byte 3  => 1
    3: 00000010, // byte 4  => 2
    4: 00000011, // byte 5  => 3
    5: 00000000, // byte 6  => 0
    6: 00000000, // byte 7  => 0
    7: 00000000, // byte 8  => 0
}
```

`Uint8Array`s use 1 byte as a data unit, while `Uint16Array`s use every 2 bytes as a data unit, so the `Uint16Array`s become:

```javascript
// byte index : byte value (bin) => decimal number
{
    1, 0, : 00000000 | 00000000 => 0
    3, 2, : 00000010 | 00000001 => 513
    5, 4, : 00000000 | 00000011 => 3
    7, 6, : 00000000 | 00000000 => 0
}
```

**Here comes the interesting and important part:** When reading `multiple bytes` data unit, we put the high bytes infront of low bytes. Like the second data unit (byte 2 and byte 3) `00000001 | 00000010`, we put byte 3 in front of byte 2, so this data unit becomes binary number `00000010 00000001`, which is translated into decimal number `513` (unsigned 16 bit integer).

Finally, the `Uint16Array`s become `[0, 513, 3, 0]`.

### In Real World

If we encode a text file with `UTF-8` format, and decode it with `UTF-16` format, it'll become gibberish (unreadable messy code).

If you use Microsoft Word to open a `.exe` application, you'll see the gibberish as well.

That is why **we need the same rules to encode and decode a `Blob` (file)**.

### More examples

We have many more examples to elaborate `TypeArray` and `DataView` in [array-buffer.js](./array-buffer.js).

[Next Chapter: FileReader](./what-is-file-reader.md)
