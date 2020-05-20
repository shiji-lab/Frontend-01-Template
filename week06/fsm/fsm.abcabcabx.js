function match (string) {
    let state = start;
    for (let char of string) {
        state = state(char);
        console.log(char, state.name);
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
    if (char === 'a') {
        return foundA2;
    } else {
        return start(char);
    }
}

function foundA2(char) {
    if (char === 'b') {
        return foundB2;
    } else {
        return start(char);
    }
}

function foundB2(char) {
    if (char === 'x') {
        return end;
    } else if (char === 'c') {
        return foundC;
    } else {
        return start(char);
    }
}

console.log(match('i am abcabcabcabx'));   // 前面 abc 重复