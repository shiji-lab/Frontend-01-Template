# 每周总结可以写在这里

## 作业一
```js
function convertStringToNumber(str, x) {
    let chars = str.split('');
    let number = 0;
    for (let i = 0; i < chars.length; i++) {
        number = number * x;
        number += chars[i].codePointAt(0) - '0'.codePointAt(0);
    }
    return number;
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