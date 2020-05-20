// 在一个字符串中，找到字符'a'
function match (string) {
    for (let p of string) {
        console.log(p);
        if (p === 'a') {
            return true;
        }
    }
    return false;
}

// console.log(match('i am great'));


// 在一个字符串中，找到字符串'ab'
function match2(string) {
    let foundA = false;
    for (let p of string) {
        if (p === 'a') {
            foundA = true;
        } else if (foundA && p === 'b') {
            return true;
        } else {
            foundA = false;
        }
    }
    return false;
}

// console.log(match2('i acbab'));

// 在一个字符串中，找到字符串'abcdef'
function match3 (string) {
    let foundA = false;
    let foundB = false;
    let foundC = false;
    let foundD = false;
    let foundE = false;
    for (let p of string) {
        if (p === 'a') {
            foundA = true;
        } else if (foundA && p === 'b') {
            foundB = true;
        } else if (foundB && p === 'c') {
            foundC = true;
        } else if (foundC && p === 'd') {
            foundD = true;
        } else if (foundD && p === 'e') {
            foundE = true;
        } else if (foundE && p === 'f') {
            return true;
        } else {
            foundA = false;
            foundB = false;
            foundC = false;
            foundD = false;
            foundE = false;
            foundF = false;
        }
    }
    return false;
}
