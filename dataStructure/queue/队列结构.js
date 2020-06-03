// 创建队列结构:先进先出
function Queue() {
    this.container = [];

}
Queue.prototype = {
    constructor: Queue, 
    // 进入队列
    enter: function (element) {
        this.container.push(element);
    },
    // 移除队列
    leave: function () {
        if (this.container.length === 0) return;
        return this.container.shift() //移除第一项
    },
    // 队列长度
    size: function () {
        return this.container.length;
    },
    //队列值
    value: function () {
        // 深克隆，保证如何操作都不影响向容器
        //slice(0),Object.assgin() 是浅拷贝
        return JSON.parse(JSON.stringify(this.container))
    }
}
// 创建一个实例
// let qe = new Queue();
// qe.enter(1)
// qe.enter(2)
// qe.enter(3)
// qe.leave()
// console.log(qe)


/**
 *击鼓传花，利用队列结构
 * @param {队列所含个数} n
 * @param {目标值} m
 * @returns
 */
function game(n, m) {
    let qe = new Queue();
    for (let i = 1; i <= n; i++) {
        qe.enter(i)
    }
    //开始,不是关键字就放进去
    while (qe.size() > 1) {
        for (let i = 0; i < m - 1; i++) {
            qe.enter(qe.leave());
        }
        qe.leave()
    }
    return qe.value()[0]
}
let res = game(6,4);
console.log(res)

