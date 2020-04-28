# 本周小结

## 小结
本周学习到了一个完全全新的视角来看待编程语言——用产生式的方式来定义语言，了解这些知识能够帮助理解 ECMAScript 标准文档。

另外，从 Atom 级别开始重学 js，有些以前的奇技淫巧在这里找到了出处。在小程序直播开发过程中，之前用到了`&ensp;`用于文本的对齐，传统`&nbsp;`在那种场景下空格宽度太宽了。原来背后的原理在 Unicode 这里。

## 笔记
- [前端 W2.1 笔记 - 编程语言通识](./前端 W2.1 笔记 - 编程语言通识.pdf)
- [前端 W2.2 笔记 - 词法、类型](./前端 W2.2 笔记 - 词法、类型.pdf)

## 作业

### 写一个正则表达式 匹配所有 Number 直接量
参考：11.8.3 Numberic Literals

> 一开始审题的时候以为要在一套规则里适用所有进制类型的 Number 直接量，一直想不出来，看了下其他同学的答案，原来直接分类去写就行了。

- DecimalLiteral 十进制数
    - DecimalIntegerLiteral . DecimalDigits ExponentPart
    - . DecimalDigits ExponentPart
    - DecimalIntegerLiteral ExponentPart

```js
DecimalIntegerLiteral: /[1-9]?[0-9]*/
DecimalDigits: /[0-9]*/
ExponentPart: /[eE]?[+-]?[0-9]/

/(^[1-9]?[0-9]*\.[0-9]*[eE]?[+-]?[0-9]*$)|(^\.[0-9]*[eE]?[+-]?[0-9]*$)|(^[1-9]?[0-9]*[eE]?[+-]?[0-9]*$)/
```

- BinaryIntegerLiteral 二进制整数
```js
/^(0b)[01]+$/
```

- OctalIntegerLiteral 八进制整数
```js
/^(0o)[0-7]+$/
```

- HexIntegerLiteral 十六进制整数
```js
/^(0x)[0-9a-eA-E]+$/
```

所以，最终 Numberic Literals 直接量的表示方式为：

```js
/(^[1-9]?[0-9]*\.[0-9]*[eE]?[+-]?[0-9]*$)|(^\.[0-9]*[eE]?[+-]?[0-9]*$)|(^[1-9]?[0-9]*[eE]?[+-]?[0-9]*$)|(^(0b)[01]+$)|(^(0o)[0-7]+$)|(^(0x)[0-9a-eA-E]+$)/
```

轨道图：
![number literal](https://github.com/shiji-lab/Frontend-01-Template/blob/master/week02/number%20literal.png)


```javascript
/^(-?[0-9]+)| ([-+]?[0-9]*\.?[0-9]+) | ([01]+) | ([0-7]+\) |(0x[a-f0-9]{1,2}$)|(^0X[A-F0-9]{1,2}$)|(^[A-F0-9]{1,2}$)|(^[a-f0-9]{1,2})$/g
```

### 写一个 UTF-8 Encoding 的函数
https://github.com/mathiasbynens/utf8.js

http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html
UTF-8 是一种字符编码方案，定义一个字符对应二进制代码如何存储。
UTF-8 是 Unicode 的实现方式之一
UTF-8 的编码规则很简单，只有二条：
- 1）对于单字节的符号，字节的第一位设为0，后面7位为这个符号的 Unicode 码。因此对于英语字母，UTF-8 编码和 ASCII 码是相同的。
- 2）对于n字节的符号（n > 1），第一个字节的前n位都设为1，第n + 1位设为0，后面字节的前两位一律设为10。剩下的没有提及的二进制位，全部为这个符号的 Unicode 码。

因此，我们可以知道，对于单个字符：
1. 算出字符码点
2. 根据码点值判断需要几个字节表示
3. 转化为相应的编码

```javascript
function UTF8_Encoding (string) {
    for (let i = 0; i < string.length; i++) {
        const codePoint = string.codePointAt(i);
        console.log(codePoint.toString(2));
    }

    // return new Buffer()
}
```


### 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号

```javascript
// 单引号


// 双引号

```