/**
 * selector
 * test: div div#id.class[attr=val], div
 */
function match (selector, element) {
    // 1. 解析 selector
    const selectors = selector.split(',').map(p => p.trim()).map(s => parseSelector(s));    // 选择器列表

    // 2. 匹配当前元素
    const currentSelector = selectors.pop();
    const { tag, id, className, attr } = currentSelector;
    if (id && element.getAttribute('id') !== id) return false;
    if (tag && element.nodeName !== tag) return false;
    // 将属性中 class 合并到 className 统一处理，统一属性比较的逻辑
    if (attr && attr['class']) {
        if (!className) className = [];
        className.push(attr['class']);
        delete attr['class'];
    }
    if (className) {
        let isClassNameMatch = true;
        const eleCls = element.getAttribute('class').split(' ');
        className.forEach(cls => {
            if (eleCls.indexOf(cls) === -1)  isClassNameMatch = false;
        });
        if (!isClassNameMatch) return false;
    }
    if (attr) {
        let isAttrMatch = true;
        for (let name in attr) {
            if (attr[name] !== element.getAttribute(name)) isAttrMatch = false;
        }
        if (!isAttrMatch) return false;
    }

    // 3. 匹配父元素
    while(selectors.length) {
        const currentSelector = selectors.pop();
    const { tag, id, className, attr } = currentSelector;
    if (id && element.getAttribute('id') !== id) continue;
    if (tag && element.nodeName !== tag) continue;
    // 将属性中 class 合并到 className 统一处理，统一属性比较的逻辑
    if (attr && attr['class']) {
        if (!className) className = [];
        className.push(attr['class']);
        delete attr['class'];
    }
    if (className) {
        let isClassNameMatch = true;
        const eleCls = element.getAttribute('class').split(' ');
        className.forEach(cls => {
            if (eleCls.indexOf(cls) === -1)  isClassNameMatch = false;
        });
        if (!isClassNameMatch) continue;
    }
    if (attr) {
        let isAttrMatch = true;
        for (let name in attr) {
            if (attr[name] !== element.getAttribute(name)) isAttrMatch = false;
        }
        if (!isAttrMatch) continue;
    }
    }

    // 4. 返回结果
    return !selector.length;
}



// --------------------- 解析 selector start ---------------------
// 用状态机解析复杂选择器

// 描述一个复合选择器
// {
//     tag: '',
//     id: '',
//     className: [],
//     attr: {}
// }
let selectors = []; // 复杂选择器，暂时只考虑子孙关系（即用 space 分隔）
let selector = null;

function parseSelector(s) {
    let state = data;
    for (let c of s) {
        state = state(c);
    }
    handlePush();
    return selectors;
}

function handlePush () {
    if (selector) {
        console.log(JSON.stringify(selector));
        selectors.push(selector);
        selector = null;
    }
}

function data(c) {
    if (!selector) selector = {};
    if (c === '#') {
        return idStart;
    } else if (c === '.') {
        return clsStart;
    } else if (c === '[') {
        return attrNameStart;
    } else if (c === ']') {
        return attrEnd;
    }else if (c === ' ') {
        handlePush();
        return data;
    } else {
        return tagNameStart(c);
    }
}

function isBackData (c) {
    return ['#', '.', '[', ' '].indexOf(c) > -1
}

function idStart(c) {
    if (isBackData(c)) {
        return data(c);
    } else {
        if (!selector.id) selector.id = '';
        selector.id += c;
        return idStart;
    }
}

let className = '';
function clsStart(c) {
    if (isBackData(c)) {
        if (className) {
            if (!selector.className) selector.className = [];
            selector.className.push(className);
        }
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
        attributeName = '';
        attributeValue = '';
        return data(c);
    } else if (c === '=') {
        return attrValStart;
    } else if (c === ']') {
        attrEnd();
        return data;
    } else {
        attributeName += c; 
        return attrNameStart;
    }
}

function attrValStart(c) {
    if (isBackData(c)) {
        return data(c);
    } else if (c === ']') {
        attrEnd();
        return data;
    } else {
        attributeValue += c; 
        return attrValStart;
    }
}

function attrEnd (c) {
    if (attributeName) {
        if (!selector.attr) selector.attr = {};
        selector.attr[attributeName] = attributeValue || '';
    }
    attributeName = '';
    attributeValue = '';
}

function tagNameStart(c) {
    if (isBackData(c)) {
        return data(c);
    } else {
        if (!selector.tag) selector.tag = '';
        selector.tag += c;
        return tagNameStart;
    }
}