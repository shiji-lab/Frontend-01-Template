
export function enableGesture(element) {
    let contexts = Object.create(null);

    let MOUSE_SYMBOL = Symbol('mouse');
    
    if (document.ontouchstart !== null) {   // document.ontouchstart 在非触屏下是 undefined，在触屏下是 null
        element.addEventListener('mousedown', event => {
            contexts[MOUSE_SYMBOL] = Object.create(null);
        
            start(event, contexts[MOUSE_SYMBOL]);
            let mousemove = event => {
                // console.log(event.clientX, event.clientY);
                move(event, contexts[MOUSE_SYMBOL]);
            }
            let mouseend = event => {
                end(event, contexts[MOUSE_SYMBOL]);
                document.removeEventListener('mousemove', mousemove);
                document.removeEventListener('mouseup', mouseend);
            }
        
            document.addEventListener('mousemove', mousemove);
            document.addEventListener('mouseup', mouseend);
        
        });
    }
    
    // tap
    // pan(panstart/panmove/panend)
    // flick
    // press(pressstart/pressend)
    
    element.addEventListener('touchstart', event => {
        // console.log(event.changedTouches[0]);
        for (let touch of event.changedTouches) {
            contexts[touch.identifier] = Object.create(null);
            start(touch, contexts[touch.identifier]);
        }
    });
    
    element.addEventListener('touchmove', event => {
        // console.log(event.changedTouches[0]);
        for (let touch of event.changedTouches) {
            move(touch, contexts[touch.identifier]);
        }
    });
    
    element.addEventListener('touchend', event => {
        // console.log(event.changedTouches[0]);
        for (let touch of event.changedTouches) {
            end(touch, contexts[touch.identifier]);
            delete contexts[touch.identifier];
        }
    });
    
    element.addEventListener('touchcancel', event => {
        // console.log(event.changedTouches[0]);
        for (let touch of event.changedTouches) {
            cancel(touch, contexts[touch.identifier]);
            delete contexts[touch.identifier];
        }
    });
    
    // -----------------------------------------------------------
    let start = (point, context) => {
        element.dispatchEvent(new CustomEvent('start', {
            detail: {
                startX: point.clientX,
                startY: point.clientY,
                clientX: point.clientX,
                clientY: point.clientY
            }
        }));

        context.startX = point.clientX;
        context.startY = point.clientY;
    
        context.moves = [];
    
        context.isTab = true;
        context.isPan = false;
        context.isPress = false;
    
        context.timeoutHandler = setTimeout(() => {
            if (context.isPan) {
                return;
            }
    
            context.isTab = false;
            context.isPan = false;
            context.isPress = true;
            console.log('pressstart');
        }, 500);
        // console.log('start', point.clientX, point.clientY);
    }
    let move = (point, context) => {
        let dx = point.clientX - context.startX;
        let dy = point.clientY - context.startY;
        
        if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
            context.isTab = false;
            context.isPan = true;
            context.isPress = false;
            // console.log('panstart');
            element.dispatchEvent(new CustomEvent('panstart', {
                detail: {
                    startX: context.startX,
                    startY: context.startY,
                    clientX: point.clientX,
                    clientY: point.clientY
                }
            }));
        }
    
        if (context.isPan) {
            context.moves.push({
                dx,
                dy,
                t: Date.now()
            });
            context.moves = context.moves.filter(record => Date.now() - record.t < 300);
            // console.log('panmove');
            element.dispatchEvent(new CustomEvent('panmove', {
                detail: {
                    startX: context.startX,
                    startY: context.startY,
                    clientX: point.clientX,
                    clientY: point.clientY
                }
            }));
        }
    
        // console.log('move', dx, dy);
    }
    let end = (point, context) => {
        // console.log('end', point.clientX, point.clientY);
        if (context.isTab) {
            // console.log('tab');
            element.dispatchEvent(new CustomEvent('tap', {}));
        }
        if (context.isPan) {
            // console.log(context.moves);
            let dx = point.clientX - context.startX;
            let dy = point.clientY - context.startY;
    
            let record = context.moves[0];
    
            let speed = Math.sqrt((record.dx - dx) ** 2 + (record.dy - dy) ** 2) / (Date.now() - record.t);

            let isFlick = speed > 2.5;
    
            if (isFlick) {
                // console.log('flick');
                element.dispatchEvent(new CustomEvent('flick', {}));
            }
    
            // console.log('panend', speed);
            element.dispatchEvent(new CustomEvent('panend', {
                detail: {
                    startX: context.startX,
                    startY: context.startY,
                    clientX: point.clientX,
                    clientY: point.clientY,
                    speed,
                    isFlick
                }
            }));
        }
        if (context.isPress) {
            // console.log('pressend');
            element.dispatchEvent(new CustomEvent('pressend', {}));
        }
        
        clearTimeout(context.timeoutHandler);
    }
    let cancel = (point, context) => {
        console.log('cancel');
        clearTimeout(context.timeoutHandler);
    }
};

