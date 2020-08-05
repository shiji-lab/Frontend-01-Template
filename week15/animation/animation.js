// 动画
// 1. Timeline, 2. Animation

/**
 * 用户怎么用？类库设计
let animation = new Animation(object, property, start, end, duration, delay, timingFunction);
 animation.start();

 animation.pause();
 animation.resume();

animation.stop();

  setTimeout
  setInterval
  requestAnimationFrame

  --- 多个动画多个函数调用，性能上会有问题
  timeline 管理多个动画

  let timeline = new Timeline();

  timeline.add(animation);
  timeline.add(animation2);

  timeline.start();

  timeline.pause();
  timeline.resume();

  timeline.stop();

//   多条时间线
一条时间线管理多个动画，且多个动画只调用 1 次函数，性能会更好
 */

export class Timeline {
    constructor () {
        this.animations = [];
        this.requestId = null;
        this.state = "inited";
        // this.tick = () => { // 每帧执行的函数
        //     // console.log('tick');
        //     let t = Date.now() - this.startTime;
        //     let animations = this.animations.filter(animation => !animation.finished);
        //     for (let animation of this.animations) {
        //         let { object, property, start, end, duration, delay, timingFunction, template} = animation;
                

        //         let progression = timingFunction((t - delay) / duration);    // 0-1 之间的数

        //         if (t > duration + delay) { // 超时则什么都不做
        //             progression = 1;
        //             animation.finished = true;
        //         }

        //         let value = start + progression * (end - start);    // value 就是根据 progression 算出的当前值

        //         object[property] = template(value); // 最后往往是一个字符串，而计算后的结果往往是 value

        //         console.log(object[property]);
        //     }

        //     if (animations.length) {
        //         return requestAnimationFrame(this.tick);
        //     }
        // }
    }

    tick () {   // 每帧执行的函数
        // console.log('tick');
        let t = Date.now() - this.startTime;
        let animations = this.animations.filter(animation => !animation.finished);
        for (let animation of this.animations) {
            let { object, property, start, end, duration, delay, timingFunction, template} = animation;
            

            let progression = timingFunction((t - delay) / duration);    // 0-1 之间的数

            if (t > duration + delay) { // 超时则什么都不做
                progression = 1;
                animation.finished = true;
            }

            let value = start + progression * (end - start);    // value 就是根据 progression 算出的当前值

            object[property] = template(value); // 最后往往是一个字符串，而计算后的结果往往是 value

            console.log(object[property]);
        }

        if (animations.length) {
            this.requestId = requestAnimationFrame(() => this.tick());
        }
    }

    pause () {
        if (this.state !== 'playing') {
            return;
        }
        this.state = 'paused';
        this.pauseTime = Date.now();
        if (this.requestId !== null) {
            cancelAnimationFrame(this.requestId);
        }
    }

    resume () {
        if (this.state !== 'paused') {
            return;
        }
        this.state = 'playing';
        this.startTime += Date.now() - this.pauseTime;
        this.tick();
    }

    start () {
        if (this.state !== 'inited') {
            return;
        }
        this.state = 'playing';
        this.startTime = Date.now();
        this.tick();
    }

    restart () {
        this.pause();
        this.animations = [];
        this.requestId = null;
        this.state = "inited";
        this.pauseTime = null;
        this.tick();
    }

    add (animation) {
        this.animations.push(animation);
    }

}

export class Animation {
    constructor (object, property, start, end, duration, delay, timingFunction, template) {
        this.object = object;
        this.property = property;
        this.start = start;
        this.end = end;
        this.duration = duration;
        this.delay = delay || 0;
        this.timingFunction = timingFunction;
        
        // || ((start, end) => {
        //     return t =>  {
        //         console.log(t, start + (t / duration) * (end - start));
        //         return start + (t / duration) * (end - start);
        //     };
        // });
        this.template = template || (v => v);
        console.log('animation', this);
    }
}
