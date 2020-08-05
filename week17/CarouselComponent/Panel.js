import { createElement, Text, Wrapper } from './createElement.js';
import {Timeline, Animation} from './animation';
import {ease, linear} from './cubicBezier';
// import {  } from './gesture';

export class TabPanel {
    constructor (config) {  // config
        // console.log('Parent::config', config);
        this.children = [];
        this.attributes = new Map();
        this.properties = new Map();
        this.state = Object.create(null);
    }

    // set className (v) { // property
    //     console.log('Parent::className', v);
    // }

    setAttribute (name, value) {    // attribute
        // console.log('Parent::setAttribute', name, value);
        // todo this.root.setAttribute(name, value);
        // 这里将 attribute 存起来，在 render 中处理
        this.attributes.set(name, value);
        this[name] = value;
        // this[name] = value;
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
        this.render().mountTo(parent);
    }

    select (i) {
        for (let view of this.childViews) {
            view.style.display = "none";
        }
        for (let view of this.titleViews) {
            view.classList.remove('selected');
        }
        this.childViews[i].style.display = "";
        // this.titleView.innerText = this.children[i].title;
    }

    render () {
        setTimeout(() => this.select(0), 16);
        this.childViews = this.children.map(child => <div style="width: 300px; min-height: 300px;">{child}</div>);
        this.titleViews = this.children.map((child, i) => <span onClick={() => this.select(i)}>{child.title || ' '}</span>);

        return <div class="tab-panal"  style="border: 1px solid blue; width: 300px;">
            <h1 style="background: lightgreen; width: 300px; margin: 0;">{this.titleViews}</h1>
            <div>
                {this.childViews}
            </div>
        </div>;
    }
}