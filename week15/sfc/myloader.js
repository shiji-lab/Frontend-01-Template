var parser = require('./parser')

module.exports = function(source, map){
    // console.log(source);
    // console.log(parser(source));
    // console.log('my loader is running-------------\n', this.resourcePath);
    let tree = parser.parseHTML(source);
    // console.log(tree.children[2].children[0].content);

    let template = null;
    let script = null;

    // console.log(JSON.stringify(tree));

    for (let node of tree.children) {
        if (node.tagName === 'template') {
            template = node.children.filter(e => e.type != 'text')[0];
        } else if (node.tagName === 'script') {
            script = node.children[0].content;
        }
    }

    // console.log(template);

    let createCode = '';
    let visit = node => {
        if (node.type === 'text') {
            return JSON.stringify(node.content);
        }
        // console.log(node, node.attributes);
        let attrs = {};
        for (let attribute of node.attributes) {
            attrs[attribute.name] = attribute.value;
        }
        // console.log(node.children);
        let children = node.children.map(node => visit(node));
        return `
         createElement("${node.tagName}", ${JSON.stringify(attrs)}, ${children})
        `;
    }

    let r = `
    import { createElement, Text, Wrapper } from './createElement.js'
    export class Carousel {
        setAttribute(name, value) {
            this[name] = value
        }
        render(){
            return ${visit(template)};
        }
        mountTo(parent) {
            this.render().mountTo(parent)
        }
    }
        `
    // console.log(r)
    return r
}