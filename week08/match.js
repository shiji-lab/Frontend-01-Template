/**
 * selector
 * test: div div#id.class[attr=val], div
 */
function match (selector, element) {
    const selectors = selector.split(',').map(p => p.trim()).map(s => parseSelector(s));    // 选择器列表
}



// 用状态机解析复杂选择器

// 描述一个复合选择器
const initSelector = {
    tag: '',
    id: [],
    class: [],
    attr: {}
}
let selectors = []; // 复杂选择器，暂时只考虑子孙关系（即用 space 分隔）
let selector = Object.assign({}, initSelector);

function parseSelector(s) {
    let state = data;
    for (let c of s) {
        console.log(c, JSON.stringify(selector));
        state = state(c);
    }
    selectors.push(selector);
    return selectors;
}

function data(c) {
    if (c === '#') {
        return idStart;
    } else if (c === '.') {
        return clsStart;
    } else if (c === '[') {
        return attrNameStart;
    } else if (c === ']') {
        return attrEnd;
    }else if (c === ' ') {
        selectors.push(selector);
        selector = Object.assign({}, initSelector);
        return data;
    } else {
        return tagNameStart(c);
    }
}

function isBackData (c) {
    return ['#', '.', '[', ' '].indexOf(c) > -1
}

let id = '';
function idStart(c) {
    if (isBackData(c)) {
        if (id) selector.id.push(id);
        id = '';
        return data(c);
    } else {
        id += c;
        return idStart;
    }
}

let className = '';
function clsStart(c) {
    if (isBackData(c)) {
        if (className) selector.class.push(className);
        className = '';
        return data(c);
    } else {
        className += c;
        return clsStart;
    }
}

let attributeName = '',
    attributeValue = '';
function attrNameStart(c) {
    if (isBackData(c)) {
        if (attributeName) selector.attr[attributeName] = attributeValue || '';
        attributeName = '';
        attributeValue = '';
        return data(c);
    } else if (c === '=') {
        return attrValStart;
    } else if (c === ']') {
        if (attributeName) selector.attr[attributeName] = attributeValue || '';
        attributeName = '';
        attributeValue = '';
    } {
        attributeName += c; 
        return attrNameStart;
    }
}

function attrValStart(c) {
    if (isBackData(c)) {
        return data(c);
    } else if (c === ']') {
        if (attributeName) selector.attr[attributeName] = attributeValue || '';
        attributeName = '';
        attributeValue = '';
        return data;
    } else {
        attributeValue += c; 
        return attrValStart;
    }
}

function tagNameStart(c) {
    if (isBackData(c)) {
        return data(c);
    } else {
        selector.tag += c;
        return tagNameStart;
    }
}

parseSelector('div a#id.class[attr=val]');