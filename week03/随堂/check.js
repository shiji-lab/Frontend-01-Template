function check(zero) {
    if (1/zero === Infinity) return 1;
    if (1/zero === -Infinity) return -1;
}
console.log(check(+0));

// 0 - NaN
function sign(number) {
    return number / Math.abs(number);
}

// class foo {
//     constructor() {
//         console.log(this);
        
//     }
// }

// 如何判断 foo 被 new 调用 => 防御性代码，这个可以用于安全隔离吗
function foo () {
    console.log(this);
    console.log(new.target);
}

new foo;

var fakeObject = {};
Object.setPrototypeOf(fakeObject, foo.prototype);
foo.apply(fakeObject);

fakeObject instanceof foo;  // true


// ---
class Parent {
    constructor() {
        this.a = 1;
    }
}

class Child extends Parent {
    constructor() {
        super();
        console.log(this.a);
    }
}

// ---
var name = 'winter';

function foo() {
    console.log(arguments);
}

foo`${name}`;


// ---

function cls1(s) {
    console.log('cls1', s);
}

function cls2(s) {
    console.log('cls2', s);
}

new new cls2('good');

// ---

class Reference {
    constructor(object, reference) {
        this.object = object;
        this.reference = reference;
    }
}

//  ---
class foo {
    constructor() {
        this.b = 1;
    }
}

new foo()['b'];

// ---
let a = 1, b = 1, c = 1;
a
++
b
++
c;

// ---

for (var i = 0; i < 10; i++) {
    var button = document.createElement('button');
    document.body.append(button);
    button.innerHTML = i;
    button.onclick = function() {
        console.log(i);
    }
}

for (var i = 0; i < 10; i++) {
    var button = document.createElement('button');
    document.body.append(button);
    button.innerHTML = i;
    void function(i) {
        button.onclick = function() {
            console.log(i);
        }
    }(i);
}

for (var i = 0; i < 10; i++) {
    var button = document.createElement('button');
    document.body.append(button);
    button.innerHTML = i;
    void function(i) {
        button.onclick = function() {
            console.log(i);
        }
    }(i);
}

// ---
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