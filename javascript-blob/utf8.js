// Unicode Table: https://unicode-table.com/en/blocks/

/*
decimal char code(row-1)     hex                      binary                                   max

0 ~ 127                      U+ 0000 ~ U+  007F:      0XXXXXXX                                 2^7 - 1  = 127

128 ~ 2047                   U+ 0080 ~ U+  07FF:      110XXXXX 10XXXXXX                        2^(5+6) - 1 = 2047

2048 ~ 65535                 U+ 0800 ~ U+  FFFF:      1110XXXX 10XXXXXX 10XXXXXX               2^(4+6+6) - 1 = 65535

65536 ~ 1114111              U+10000 ~ U+10FFFF:      11110XXX 10XXXXXX 10XXXXXX 10XXXXXX      2^(3+6+6+6) - 1 = 2097151

*/

// '知'
// unicode table row:   30693
// decimal:             30693
// hexadecimal:         0x77e5
// binary:              111011111100101

// Chinese (and it's punctuations):
// 2048    -  65535
// 0x0800  -  0xFFFF
//      1000 0000 0000
// 1111 1111 1111 1111

// TODO: TextEncoder/TextDecoder
