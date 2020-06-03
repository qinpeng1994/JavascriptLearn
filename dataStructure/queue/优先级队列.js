// 队列:先进先出
function Queue() {
    this.container = [];
}
Queue.prototype = {
    constructor: Queue,
    enter: function (element,priority = 0) { // priority 数值越大有优先级越高
        let obj = {
            value:element,
            priority:priority
        }
        // 优先值最小
        if(priority === 0 ){
            this.container.push(obj);
            return 
        };
        // 指定优先级
        let flag = false;  //加一个判定条件
        for(let i = this.container.length-1;i >=0;i--){
            let item = this.container[i];
            if(item.priority >= priority){
                // i+1插入到比较像后面
                this.container.splice(i+1,0,obj);
                let flag = true;
                break;
            }

        };
        // 没有比我大，是最大的值
      !flag?this.container.unshift(obj):null;
    },
    leave: function () {
        if (this.container.length === 0) return;
        return this.container.shift() //移除第一项
    },
    size: function () {
        return this.container.length;
    },
    value: function () {
        // 深克隆，保证如何操作都不影响向容器
        //slice(0),Object.assgin() 是浅拷贝
        return JSON.parse(JSON.stringify(this.container))
    }
}