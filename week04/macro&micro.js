async function afoo () {
    console.log(-2);
    await new Promise(resolve => resolve());

    console.log(-1);
}

new Promise((resolve, reject) => {
    console.log(1);
    resolve();
    console.log(2);
}).then(() => {
    console.log(3);
    new Promise(resolve => resolve()).then(() => {
        console.log(3.5);
    });
});

setTimeout(() => {
    console.log(4);
    new Promise(resolve => resolve()).then(() => {
        console.log(4.5);
    });
}, 0);

console.log(5);
afoo();
console.log(6);

// 宏任务 1
//   微任务 1.1，入队微任务 1.2
//   微任务 1.2，入队微任务 1.3
//   微任务 1.3
// 宏任务 2
//   微任务 2.1