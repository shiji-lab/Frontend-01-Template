
let selectors = [];

/**
 * selector
 * div div#id.class[attr=val], div
 * 

 */
function match (selector, element) {
    selector.split(',').map(p => p.trim()).map(s => parseSelector(s));    // 选择器列表
}


/**
 * 解析一个复杂选择器
 * @param {*} selector 
 * 描述一个复合选择器
 * {
 *  tagName: '',
 *  id: '',
 *  classNames: ['', ''],
 *  attributes: [
 *      attrName: 'href',
 *      attrVal: 'xxx',
 *      relation: '='   // = / ^= / $= / *=
 *  ]
 * }
 */
function parseSelector(selector) {
    let state = data;
    const EOF = Symbol('EOF');
    for (let c of selector) {
        state = state(c);
    }
    state = state(EOF);
}

// 状态机解析复杂选择器
function data(c) {
    if (c === '#') {
        return idStart;
    } else if (c === '.') {
        return clsStart;
    } else if (c === '[') {
        return AttrStart;
    } else {
        return tagName(c);
    }
}

function idStart(c) {
    if (c === '#') {

    } else 
}