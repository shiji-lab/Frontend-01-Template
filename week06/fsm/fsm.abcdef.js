
// 在一个字符串中，找到字符串'abcdef'
// test case: aabcdef
function match (string) {
    let state = start;
    for (let char of string) {
        // console.log(char, state);
        state = state(char);
    }
    return state === end;
}

function start (char) {
    if (char === 'a') {
        return foundA;
    } else {
        return start;
    }
}

function end () {
    return end;
}

function foundA(char) {
    if (char === 'b') {
        return foundB;
    } else {
        return start(char);
    }
}

function foundB(char) {
    if (char === 'c') {
        return foundC;
    } else {
        return start(char);
    }
}

function foundC(char) {
    if (char === 'd') {
        return foundD;
    } else {
        return start(char);
    }
}

function foundD(char) {
    if (char === 'e') {
        return foundE;
    } else {
        return start(char);
    }
}

function foundE(char) {
    if (char === 'f') {
        return end;
    } else {
        return start(char);
    }
}

console.log(match('aaaabbcdef'));