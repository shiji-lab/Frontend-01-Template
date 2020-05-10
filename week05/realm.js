// ECMA-262 18 The Global Object
// Infinity, NaN, undefined
// eval, isFinite, isNaN, parseFloat, parseInt, decodeURI, encodeURI, decodeURIComponent, encodeURIComponent
// Array, ArrayBuffer, Boolean, DataView, Date, Error, EvalError, Float32Array, Float64Array, Function, Int8Array, Int16Array, Int32Array, Map, Number, Object, Promise, Proxy, RangeError, ReferenceError, RegExp, Set, SharedArrayBuffer, String, Symbol, SyntaxError, TypeError, Uint0Array, Uint8ClampedArray, Uint16Array, Uint32Array, URIError, WeakMap, WeakSet
// Atomics, JSON, Math, Reflect


let globalPropertyNames = [
    'Infinity', 
    'NaN', 
    'undefined',
    'eval', 
    'isFinite', 
    'isNaN', 
    'parseFloat', 
    'parseInt', 
    'decodeURI', 
    'encodeURI', 
    'decodeURIComponent', 
    'encodeURIComponent',
    'Array', 
    'ArrayBuffer', 
    'Boolean', 
    'DataView', 
    'Date', 
    'Error', 
    'EvalError', 
    'Float32Array', 
    'Float64Array', 
    'Function', 
    'Int8Array', 
    'Int16Array', 
    'Int32Array', 
    'Map', 
    'Number', 
    'Object', 
    'Promise', 
    'Proxy', 
    'RangeError', 
    'ReferenceError', 
    'RegExp', 
    'Set', 
    'SharedArrayBuffer', 
    'String', 
    'Symbol', 
    'SyntaxError', 
    'TypeError', 
    'Uint8Array', 
    'Uint8ClampedArray', 
    'Uint16Array', 
    'Uint32Array', 
    'URIError', 
    'WeakMap', 
    'WeakSet',
    'Atomics', 
    'JSON', 
    'Math', 
    'Reflect'
];

let quene = [];
let set = new Set();   // 去重以及计算结点位置（id）用

/*
为了便于 G6 展示，我们定义数据结构如下
结点
nodes: [
    {
        id: 'x1',
        value: xxx,
        label: 'xxx',
        shape: 'xxx',   // circle -> object(not function), ellipse -> function, diamond -> null, rect -> not object,
        degree: 0,
        inDegree: 0,
        outDegree: 0
    }
]

边/关系
edges： [
    {
        source: 'node1',
        target: 'node2',
        label: '',  // 'proto', 'get', 'set', 'value'
    }
]

*/

// 结点
let nodes = globalPropertyNames.map((item, index) => {
    const value = this[item];
    set.add(value);
    quene.push(value);
    return {
        id: 'e_' + index,
        value,
        label: item,
        shape: null === value ? 'diamond' : getShape(typeof value),
        degree: 0,
        inDegree: 0,
        outDegree: 0
    }
});

// 边
let edges = [];

let current;    // 当前元素

while (quene.length) {
    current = quene.shift();
    // if (set.has(current)) continue;
    // set.add(current);
    // console.log(current, typeof current);
    if (['function', 'object'].indexOf(typeof current) === -1 || null === current) continue;
    
    // 处理属性
    const _currentObjPropertyNames = Object.getOwnPropertyNames(current);
    const currentIndexOfSet = getIndex(current);
    _currentObjPropertyNames.forEach(_currentObjPropertyName => {
        // console.log('--------', _currentObjPropertyName, current, typeof current);
        let value;
        try {
            value = current[_currentObjPropertyName];
        } catch (error) {
            value = 'CANNOTGETVALUE';   // 取值报错
            console.info('realm.js', error);
        }
        if (!set.has(value)) {  // 这里不关心是否是 object，前面会拦截
            quene.push(value);
            set.add(value);
            // 处理 node
            nodes.push({
                id: 'e_' + nodes.length,
                value,
                label: nodes[currentIndexOfSet].label + '.' + _currentObjPropertyName,
                shape: null === value ? 'diamond' : (typeof value),
                degree: 0,
                inDegree: 0,
                outDegree: 0
            });
        }

        // 处理 edge
        const property = Object.getOwnPropertyDescriptor(current, _currentObjPropertyName);
        let label = 'unknown';
        if (property.hasOwnProperty('value')) label = 'value';
        if (property.hasOwnProperty('get')) label = 'get';
        if (property.hasOwnProperty('set')) label = 'set';

        const propertyIndex = getIndex(value);
        console.log(propertyIndex, value, current);

        nodes[currentIndexOfSet].degree++;
        nodes[currentIndexOfSet].outDegree++;
        nodes[propertyIndex].degree++;
        nodes[propertyIndex].inDegree++;
        
        edges.push({
            source: 'e_' + currentIndexOfSet,
            target: 'e_' + propertyIndex,
            label
        });
    });

    // 处理原型
    const _currentObjProto = Object.getPrototypeOf(current);
    if (!set.has(_currentObjProto)) {
        quene.push(_currentObjProto);
        set.add(_currentObjProto);
        nodes.push({
            id: 'e_' + nodes.length,
            value: _currentObjProto,
            label: nodes[currentIndexOfSet].label + "[[proto]]",
            shape: null === _currentObjProto ? 'diamond' : getShape(typeof _currentObjProto),
            degree: 0,
            inDegree: 0,
            outDegree: 0
        });
    }

    const protoIndex = getIndex(_currentObjProto);

    nodes[currentIndexOfSet].degree++;
    nodes[currentIndexOfSet].outDegree++;
    nodes[protoIndex].degree++;
    nodes[protoIndex].inDegree++;

    edges.push({
        source: 'e_' + currentIndexOfSet,
        target: 'e_' + protoIndex,
        label: 'proto'
    });
}

// 根据 typeof 值获取对应的 shape
function getShape (_typeof) {
    let v;
    switch (_typeof) {
        case 'object':
            v = 'circle';
            break;
        case 'function':
            v = 'ellipse';
            break;
        default:
            v = 'rect'
    }
    return v;
}

function getIndex (v) {
    let i;
    if (typeof v === 'number' && isNaN(v)) {
        i = 1
    } else {
        i = [...set].indexOf(v);
    };
    if (-1 === i) console.error(v, set);
    return i;
}

console.log(nodes);
console.log(edges);
const degree = {};
nodes.forEach(node => {
    degree[node.degree] = (degree[node.degree] || 0) + 1;
    node.size = parseInt( node.degree / 10) + 1;
});

console.log('degreeCount', degree);