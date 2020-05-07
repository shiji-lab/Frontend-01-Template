# 每周总结可以写在这里

## 作业一

### convertStringToNumber
https://stackabuse.com/javascript-convert-string-to-number/
js 原生处理方法有三：
- Number
- parseInt
- parseFloat
- string - 0


### convertNumberToString
https://stackabuse.com/javascript-convert-number-to-string/
- String
- toString
- template String `${number}`
- '' + number

```js
function convertStringToNumber(str, x) {
    if (!str) return 0;
    // 1、判断进制
    /^(0b)[01]+$/.test(str)
}

function convertNumberToString(number, x) {

}
```



### 作业二：特殊对象
- Bound Function
    - [[BoundTargetFunction]]
    - [[BoundThis]]
    - [[BoundArguments]]
    - [[Call]]
    - [[Construct]]
- Array
- String
- Arguments
- Integer-Indexed
- Module
- Object.prototype