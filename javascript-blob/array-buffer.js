// Let's create a `.txt` file with the following content
/*
```txt
Relea-se
text
👨‍👩‍👧‍👦
我
```
// I used `VScode` or `UltraEdit` to dig out the `binary view` of it below:
*/
/*
```
00000000:	5265	6c65	612d	7365
00000008:	0a74	6578	740a	f09f
00000010:	91a8	e280	8df0	9f91
00000018:	a9e2	808d	f09f	91a7
00000020:	e280	8df0	9f91	a60a
00000028:	e688	91
```
*/

// Why so?

// computers can't understand 0 or 1, let's get the binary content of the text
const binContent = [...'Relea-se'].map(c => c.charCodeAt(0).toString(2))
console.log(binContent)
// output: ["1010010", "1100101", "1101100", "1100101", "1100001", "101101", "1110011", "1100101"]
console.log('我'.charCodeAt(0).toString(2))
// output: "110001000010001"

// combinations of 0 and 1 can represent all kinds of contents we need
// `1010010` represents the charater 'R'
// while `110001000010001` represents '我'

// see, binaries can be very long, for transfer convenience, I convert binary numbers into a shorter representation, which is `hexadecimal`
const hexContent = [...'Relea-se'].map(c => c.charCodeAt(0).toString(16))
console.log(hexContent)
// output: ["52", "65", "6c", "65", "61", "2d", "73", "65"]

// `1010010`(binary) === `52`(hexadecimal)

whatIsTypeArray_Uint8_to_Uint16()

// long to short
whatIs_DataView_Int16_to_Int8()
whatIs_DataView_negativeInt16_to_Int8()
// equivalent
whatIs_DataView_Int16_to_Int16()
whatIs_DataView_negativeInt16_to_Int16
// short to long
whatIs_DataView_Int8_to_Int16()
whatIs_DataView_overflowInt8_to_Int16()
// equivalent
whatIs_DataView_overflowInt8_to_Int8()
// mixture
whatIs_DataView_mixture()
whatIs_DataView_mixture_set_offset()

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

function whatIs_DataView_Int16_to_Int8 () {
  console.warn('DataView: Int16 to Int8 ====== ')
  const byteLength = 2
  const buffer = new ArrayBuffer(byteLength)
  console.log('buffer byte size', buffer.byteLength)
  console.log('origin buffer', '00000000 | 00000000')
  // buffer =>
  // 00000000 | 00000000

  const int8 = new Int8Array(buffer)
  console.log('origin int8', int8)
  // int8 =>
  // [0, 0]

  const dataview = new DataView(buffer)

  const int16num = 258
  dataview.setInt16(0, int16num)
  // signed 16 bit int: 258 === 00000001 | 00000010
  console.log('int16num', int16num, '00000001 | 00000010')
  console.log('buffer is set to', '00000001 | 00000010')
  // buffer =>
  // 00000001 | 00000010
  /*
  {
    0: 00000001,
    1: 00000010,
  }
  */

  console.log('int8 is set to', int8)
  // int8 =>
  /*
  {
    0: 00000001, => 1
    1: 00000010, => 2
  }
  */
  // [1, 2]
}

function whatIs_DataView_negativeInt16_to_Int8 () {
  console.warn('DataView: negative Int16 Int8 ====== ')
  const byteLength = 2
  const buffer = new ArrayBuffer(byteLength)
  console.log('buffer byte size', buffer.byteLength)
  console.log('origin buffer', '00000000 | 00000000')
  // buffer =>
  // 00000000 | 00000000

  const int8 = new Int8Array(buffer)
  console.log('origin int8', int8)
  // int8 =>
  // [0, 0]

  const dataview = new DataView(buffer)

  const int16num = -259
  dataview.setInt16(0, int16num)
  // signed 16 bit int: -259 === 11111110 | 11111101
  console.log('int16num', int16num, '11111110 | 11111101')
  console.log('buffer is set to', '11111110 | 11111101')
  // buffer =>
  // 11111110 | 11111101
  /*
  {
    0: 11111110,
    1: 11111101,
  }
  */

  console.log('int8 is set to', int8)
  // int8 =>
  /*
  {
    0: 11111110, => -2
    1: 11111101, => -3
  }
  */
  // [-2, -3]
}

function whatIs_DataView_Int16_to_Int16 () {
  console.warn('DataView: Int16 to Int16 ====== ')
  const byteLength = 2
  const buffer = new ArrayBuffer(byteLength)
  console.log('buffer byte size', buffer.byteLength)
  console.log('origin buffer', '00000000 | 00000000')
  // buffer =>
  // 00000000 | 00000000

  const int16 = new Int16Array(buffer)
  console.log('origin int16', int16)
  // int16 =>
  // [0]

  const dataview = new DataView(buffer)

  const int16num = 258
  dataview.setInt16(0, int16num)
  // signed 16 bit int: 258 === 00000001 | 00000010
  console.log('int16num', int16num, '00000001 | 00000010')
  console.log('buffer is set to', '00000001 | 00000010')
  // buffer =>
  // 00000001 | 00000010
  /*
  {
    0: 00000001,
    1: 00000010,
  }
  */

  console.log('int16 is set to', int16)
  // int16 =>
  /*
  {
    1, 0: 00000010 | 00000001, => 513
  }
  */
  // [513]
}

function whatIs_DataView_negativeInt16_to_Int16 () {
  console.warn('DataView: negative Int16 Int8 ====== ')
  const byteLength = 2
  const buffer = new ArrayBuffer(byteLength)
  console.log('buffer byte size', buffer.byteLength)
  console.log('origin buffer', '00000000 | 00000000')
  // buffer =>
  // 00000000 | 00000000

  const int16 = new Int16Array(buffer)
  console.log('origin int16', int16)
  // int16 =>
  // [0]

  const dataview = new DataView(buffer)

  const int16num = -259
  dataview.setInt16(0, int16num)
  // signed 16 bit int: -259 === 11111110 | 11111101
  console.log('int16num', int16num, '11111110 | 11111101')
  console.log('buffer is set to', '11111110 | 11111101')
  // buffer =>
  // 11111110 | 11111101
  /*
  {
    0: 11111110,
    1: 11111101,
  }
  */

  console.log('int16 is set to', int16)
  // int16 =>
  /*
  {
    1, 0: 11111101 | 11111110, => -514
  }
  */
  // [-514]
}

function whatIs_DataView_Int8_to_Int16 () {
  console.warn('DataView: Int8 to Int16 ====== ')
  const byteLength = 2
  const buffer = new ArrayBuffer(byteLength)
  console.log('buffer byte size', buffer.byteLength)
  console.log('origin buffer', '00000000 | 00000000')
  // buffer =>
  // 00000000 | 00000000

  const int16 = new Int16Array(buffer)
  console.log('origin int16', int16)
  // int16 =>
  // [0]

  const dataview = new DataView(buffer)

  const int8num = 254
  dataview.setInt8(0, int8num)
  // signed 8 bit int: 254 === 11111110
  console.log('int8num', int8num, '11111110')
  console.log('buffer is set to', '11111110 | 00000000')
  // buffer =>
  // 11111110 | 00000000
  /*
  {
    0: 11111110,
    1: 00000000,
  }
  */

  console.log('int16 is set to', int16)
  // int16 =>
  /*
  {
    1, 0: 00000000 | 11111110, => 254
  }
  */
  // [254]
}

function whatIs_DataView_overflowInt8_to_Int16 () {
  console.warn('DataView: overflowInt8 to Int16 ====== ')
  const byteLength = 2
  const buffer = new ArrayBuffer(byteLength)
  console.log('buffer byte size', buffer.byteLength)
  console.log('origin buffer', '00000000 | 00000000')
  // buffer =>
  // 00000000 | 00000000

  const int16 = new Int16Array(buffer)
  console.log('origin int16', int16)
  // int16 =>
  // [0]

  const dataview = new DataView(buffer)

  const int8num = 256
  dataview.setInt8(0, int8num)
  // signed 8 bit int: 256 === 1 | 00000000
  console.log('int8num', int8num, '1 | 00000000')
  console.log('buffer is set to', '00000000 | 00000000')
  // buffer =>
  // 00000000 | 00000000
  /*
  {
    0: 00000000,
    1: 00000000,
  }
  */

  console.log('int16 is set to', int16)
  // int16 =>
  /*
  {
    1, 0: 00000000 | 00000000, => 0
  }
  */
  // [0]
}

function whatIs_DataView_overflowInt8_to_Int8 () {
  console.warn('DataView: overflowInt8 to Int8 ====== ')
  const byteLength = 2
  const buffer = new ArrayBuffer(byteLength)
  console.log('buffer byte size', buffer.byteLength)
  console.log('origin buffer', '00000000 | 00000000')
  // buffer =>
  // 00000000 | 00000000

  const int8 = new Int8Array(buffer)
  console.log('origin int8', int8)
  // int8 =>
  // [0, 0]

  const dataview = new DataView(buffer)

  const int8num = 256
  dataview.setInt8(0, int8num)
  // signed 8 bit int: 256 === 1 | 00000000
  console.log('int8num', int8num, '1 | 00000000')
  console.log('buffer is set to', '00000000 | 00000000')
  // buffer =>
  // 00000000 | 00000000
  /*
  {
    0: 00000000,
    1: 00000000,
  }
  */

  console.log('int8 is set to', int8)
  // int8 =>
  /*
  {
    0: 00000000, => 0
    1: 00000000, => 0
  }
  */
  // [0, 0]
}

function whatIs_DataView_mixture () {
  console.warn('DataView: mixture: Int16 to Int8 ====== ')
  const byteLength = 5
  const buffer = new ArrayBuffer(byteLength)
  console.log('buffer byte size', buffer.byteLength)
  console.log(
    'origin buffer',
    '00000000 | 00000000 | 00000000 | 00000000 | 00000000'
  )
  // buffer =>
  // 00000000 | 00000000 | 00000000 | 00000000 | 00000000

  const int8 = new Int8Array(buffer)
  console.log('origin int8', int8)
  // int8 =>
  // [0, 0, 0, 0, 0]

  const dataview = new DataView(buffer)

  const int16num = 256
  dataview.setInt16(0, int16num)
  // signed 16 bit int: 256 === 00000001 | 00000000
  console.log('int16num', int16num, '00000001 | 00000000')
  console.log(
    'buffer is set to',
    '00000001 | 00000000 | 00000000 | 00000000 | 00000000'
  )
  // buffer =>
  // 00000001 | 00000000 | 00000000 | 00000000 | 00000000
  /*
  {
    0: 00000001,
    1: 00000000,
    2: 00000000,
    3: 00000000,
    4: 00000000,
  }
  */

  console.log('int8 is set to', int8)
  // int8 =>
  /*
  {
    0: 00000001, => 1
    1: 00000000, => 0
    2: 00000000, => 0
    3: 00000000, => 0
    4: 00000000, => 0
  }
  */
  // [1, 0, 0, 0, 0]
}

function whatIs_DataView_mixture_set_offset () {
  console.warn('DataView: mixture: set offset ====== ')
  const byteLength = 8
  const buffer = new ArrayBuffer(byteLength)
  console.log('buffer byte size', buffer.byteLength)
  console.log(
    'origin buffer',
    '00000000 | 00000000 | 00000000 | 00000000 | 00000000 | 00000000 | 00000000 | 00000000'
  )
  // buffer =>
  // 00000000 | 00000000 | 00000000 | 00000000 | 00000000 | 00000000 | 00000000 | 00000000

  const int32 = new Int32Array(buffer)
  console.log('origin int32', int32)
  // int32 =>
  // [0, 0]

  const dataview = new DataView(buffer)

  const int16num = 256
  dataview.setInt16(1, int16num)
  // signed 16 bit int: 256 === 00000001 | 00000000
  console.log('int16num', int16num, '00000001 | 00000000')
  console.log(
    'buffer is set to',
    '00000000 | 00000001 | 00000000 | 00000000 | 00000000 | 00000000 | 00000000 | 00000000'
  )
  // buffer =>
  // 00000000 | 00000001 | 00000000 | 00000000 | 00000000 | 00000000 | 00000000 | 00000000
  /*
  {
    0: 00000000,
    1: 00000001,
    2: 00000000,
    3: 00000000,
    4: 00000000,
    5: 00000000,
    6: 00000000,
    7: 00000000,
  }
  */

  console.log('int32 is set to', int32)
  // int32 =>
  /*
  {
    3, 2, 1, 0: 00000000 | 00000000 | 00000001 | 00000000, => 256
    7, 6, 5, 4: 00000000 | 00000000 | 00000000 | 00000000, => 0
  }
  */
  // [256, 0]
}
