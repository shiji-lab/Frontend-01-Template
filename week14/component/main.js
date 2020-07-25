function create (Cls, attributes, ...children) {
    // console.log(arguments);
    let o;
    
    if (typeof Cls === 'string') {
        o = new Wrapper(Cls);
    } else {
        o = new Cls({
            timer: null
        });
    }

    for (let name in attributes) {
        o.setAttribute(name, attributes[name]);
    }

    // console.log(children);

    for (let child of children) {
        if (typeof child === 'string') {
            child = new Text(child);
        }
        o.appendChild(child);
    }

    return o;
}

class Text {
    constructor (text) {
        this.root = document.createTextNode(text);
    }

    mountTo (parent) {
        parent.appendChild(this.root);
    }
}

class Wrapper {
    constructor (type) {  // config
        // console.log('Parent::config', config);
        this.children = [];
        this.root = document.createElement(type);
    }

    // set className (v) { // property
    //     console.log('Parent::className', v);
    // }

    setAttribute (name, value) {    // attribute
        // console.log('Parent::setAttribute', name, value);
        this.root.setAttribute(name, value);
    }

    appendChild (child) {   // children
        // console.log('Parent::appendChild', child);
        this.children.push(child);
        // child.mountTo(this.root);    // 这里不要直接 moute
    }

    mountTo (parent) {
        parent.appendChild(this.root);
        for (let child of this.children) {
            if (typeof child === 'string') {
                child = new Text(child);
            }
            child.mountTo(this.root);
        }
    }
}



class MyComponent {
    constructor (config) {  // config
        // console.log('Parent::config', config);
        this.children = [];
        this.attributes = new Map();
        this.properties = new Map();
    }

    // set className (v) { // property
    //     console.log('Parent::className', v);
    // }

    setAttribute (name, value) {    // attribute
        // console.log('Parent::setAttribute', name, value);
        // todo this.root.setAttribute(name, value);
        // 这里将 attribute 存起来，在 render 中处理
        this.attributes.set(name, value);
    }

    appendChild (child) {   // children
        // console.log('Parent::appendChild', child);
        this.children.push(child);
        // child.mountTo(this.root);    // 这里不要直接 moute
    }

    set subTitle (value) {
        this.properties.set('subTitle', value);
    }

    mountTo (parent) {
        // parent.appendChild(this.root);
        this.slot = <div></div>
        for (let child of this.children) {
           this.slot.appendChild(child);
        }
        this.render().mountTo(parent);
    }

    render () {
        return <article>
            <h1>{this.attributes.get('title')}</h1>
            <h3>{this.properties.get('subTitle')}</h3>
            <header>I'm a header</header>
            {this.slot}
            <footer>I'm a footer</footer>
        </article>
    }
}

let component = <MyComponent title="i am title">
    <div>text text text</div>
</MyComponent>

component.subTitle = 'i am sub title'

component.mountTo(document.body);

// console.log(component);
// component.id = 'a';
// component.setAttribute('id', 'a');