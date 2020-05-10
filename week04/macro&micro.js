async function afoo () {
    console.log(-2);
    await new Promise(resolve => {
        console.log(-3);
        resolve()
    });
    // 这里可以理解为有一个 then

    await new Promise(resolve => {
        console.log(-4);
        resolve();
    });

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




async function async1() {
    console.log('async1 start'); // 第一个宏任务 1
    await async2();
    console.log('async1 end'); // 第一个微任务 1
}
async function async2() {
    console.log('async2');  // 第一个宏任务 2
}
async1(); // 开始执行
new Promise(function (resolve) {
    console.log('promise1');  // 第一个宏任务 3
    resolve();
}).then(function () {
    console.log('promise2'); // 第一个微任务 2
});