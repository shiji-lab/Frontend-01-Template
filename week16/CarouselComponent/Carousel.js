import { createElement, Text, Wrapper } from './createElement.js';
import {Timeline, Animation} from './animation';
import {ease, linear} from './cubicBezier';
// import {  } from './gesture';

export class Carousel {
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

    render () {
        let timeline = new Timeline;
        window.xtimeline = timeline;
        timeline.start();

        let positon = 0;

        let nextPicStophandler = null;

        let children = this.attributes.get('data').map((url, currentPosition) => {
            let lastPosition = (currentPosition - 1 + this.data.length) % this.data.length;
            let nextPosition = (currentPosition + 1) % this.data.length;

            let offset = 0;

            let onStart = () => {
                console.log('onStart');
                timeline.pause();
                clearTimeout(nextPicStophandler);
                let currentElement = children[currentPosition];
                console.log(currentElement.style.transform, currentElement.style.transform.match(/translateX\(([\s\S]+)px\)/));
                let currentTransformValue = Number(currentElement.style.transform.match(/translateX\(([\s\S]+)px\)/)[1]);
                offset = currentTransformValue + 500 * currentPosition;
            }

            let onPanMove = event => {
                console.log('onPan', lastPosition, currentPosition, nextPosition);
                let lastElement = children[lastPosition];
                let currentElement = children[currentPosition];
                let nextElement = children[nextPosition];

                let dx = event.detail.clientX - event.detail.startX;

                let lastTransformValue = -500 - 500 * lastPosition + offset + dx;
                let currentTransformValue = -500 * currentPosition + offset + dx;
                let nextTransformValue = 500 - 500 * nextPosition + offset + dx;

                console.log(lastTransformValue + dx, currentTransformValue + dx, nextTransformValue + dx);

                lastElement.style.transform = `translateX(${lastTransformValue}px)`;
                currentElement.style.transform = `translateX(${currentTransformValue}px)`;
                nextElement.style.transform = `translateX(${nextTransformValue}px)`;

            }

            let onPanEnd = event => {
                console.log('onPanEnd');
                let direction = 0;
                let dx = event.detail.clientX - event.detail.startX;
                if (dx + offset > 250) {
                    direction = 1;
                } else if (dx + offset < -250) {
                    direction = -1;
                }

                timeline.reset();
                timeline.start();

                // let lastTransformValue = -500 - 500 * lastPosition + offset + dx;
                // let currentTransformValue = 500 * currentPosition + offset + dx;
                // let nextTransformValue = 500 - 500 * lastPosition + offset + dx;

                let lastElement = children[lastPosition];
                let currentElement = children[currentPosition];
                let nextElement = children[nextPosition];

                let lastAnimation = new Animation(lastElement.style, 'transform', -500 - 500 * lastPosition + offset + dx, -500 - 500 * lastPosition + direction * 500, 500, 0, ease, v => `translateX(${v}%)`);
                let currentAnimation = new Animation(currentElement.style, 'transform', - 500 * currentPosition + offset + dx, - 500 * currentPosition + direction * 500, 500, 0, ease, v => `translateX(${v}%)`);
                let nextAnimation = new Animation(nextElement.style, 'transform', 500 - 500 * nextPosition + offset + dx, 500 - 500 * nextPosition + direction * 500, 500, 0, ease, v => `translateX(${v}%)`);
                
                timeline.add(lastAnimation);
                timeline.add(currentAnimation);
                timeline.add(nextAnimation);

                console.log(timeline);

                positon = (positon - direction + this.data.length) % this.data.length;
                // lastElement.style.transform = `translateX(${lastTransformValue + dx}px)`;
                // currentElement.style.transform = `translateX(${currentTransformValue + dx}px)`;
                // nextElement.style.transform = `translateX(${nextTransformValue + dx}px)`;
                nextPicStophandler = setTimeout(nextPic, 3000);
            }

            let element = <img src={url} onStart={onStart} onPanmove={onPanMove} onPanend={onPanEnd} enableGesture={true} />
            element.style.transform = 'translateX(0px)';
            element.addEventListener('dragstart', event => event.preventDefault());
            return element;
        });

        let root = <div class={this.attributes.get('class')}>
            {children}
        </div>;

        let nextPic = () => {
            console.log('nextPic');
            let nextPositon =  (positon + 1) % this.data.length;

            let current = children[positon];
            let next = children[nextPositon];

            let currentAnimation = new Animation(current.style, 'transform', -100 * positon, -100-100 * positon, 500, 0, ease, v => `translateX(${5 * v}px)`);
            let nextAnimation = new Animation(next.style, 'transform', 100-100 * nextPositon, -100 * nextPositon, 500, 0, ease, v => `translateX(${5 * v}px)`);

            timeline.add(currentAnimation);
            timeline.add(nextAnimation);
            
            positon = nextPositon;
            // window.xstopHandler = setTimeout(nextPic, 3000);
            nextPicStophandler = setTimeout(nextPic, 3000);
        }
        nextPicStophandler = setTimeout(nextPic, 3000);

        // root.addEventListener('mousedown', event => {
        //     let startX = event.clientX, startY = event.clientY;
            
        //     let lastPosition =  (positon - 1 + this.data.length) % this.data.length;
        //     let nextPositon =  (positon + 1) % this.data.length;

        //     let current = children[positon];
        //     let last = children[lastPosition];
        //     let next = children[nextPositon];

        //     current.style.transition = 'none';
        //     last.style.transition = 'none';
        //     next.style.transition = 'none';

        //     current.style.transform = `translateX(${-500 * positon}px)`;
        //     last.style.transform = `translateX(${-500-500 * lastPosition}px)`;
        //     next.style.transform = `translateX(${500-500 * nextPositon}px)`;
                
        //     let move = event => {
        //         current.style.transform = `translateX(${event.clientX - startX - 500 * positon}px)`;
        //         last.style.transform = `translateX(${event.clientX - startX - 500-500 * lastPosition}px)`;
        //         next.style.transform = `translateX(${event.clientX - startX + 500-500 * nextPositon}px)`;
                
        //         // console.log(event.clientX - startX, event.clientY - startY);
        //     }

        //     let up = event => {
        //         let offset = 0;

        //         if (event.clientX - startX > 250) {
        //             offset = 1;
        //         } else if (event.clientX - startX < -250) {
        //             offset = -1;
        //         }

        //         current.style.transition = 'ease 0.2s';
        //         last.style.transition = 'ease 0.2s';
        //         next.style.transition = 'ease 0.2s';

        //         current.style.transform = `translateX(${offset * 500 - 500 * positon}px)`;
        //         last.style.transform = `translateX(${offset * 500 - 500-500 * lastPosition}px)`;
        //         next.style.transform = `translateX(${offset * 500 + 500-500 * nextPositon}px)`;

        //         positon = (positon - offset + this.data.length) % this.data.length;

        //         // baseX = baseX + event.clientX - startX, baseY = baseY + event.clientY - startY;
        //         document.removeEventListener('mousemove', move);
        //         document.removeEventListener('mouseup', up);
        //     }
            
        //     // 监听在 document 上的事件，即使移到浏览器的外面也会触发
        //     document.addEventListener('mousemove', move);
        //     document.addEventListener('mouseup', up);
        // });

        return root;
    }
}