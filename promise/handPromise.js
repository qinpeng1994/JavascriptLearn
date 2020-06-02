console.log("my")
const RESOLVED = "RESOLVED";
const REJECTED = "REJECTED";
const PENDING = "PENDING";
// PromiseA+规范
// promise与各种库，每个人写的promise不同
/**
 * 根据return new Promise()返回的值不同
 * @param {*} promise2 
 * @param {*} x 
 * @param {*} resolve 
 * @param {*} reject 
 */
const resolvePromise = (promise2, x, resolve, reject) => {
    let called  // 解决小细节问题，别人的promise可能会出现问题
    // 1、循环引用。自己等待自己，错误实现
    if(promise2 === x) {   // then之后return 变量自己
        return reject(new TypeError("Chaining cycle detected for promise #<promise>"))
    };
    if((typeof x === "object" && x!==null) || typeof x === "function"){ //有可能是一个promise
        try {
            let then = x.then;
            if(typeof then === "function"){ //只能认为是一个promise
                //  x.then会出现问题，会再次取值
                then.call(x,y=>{
                    if(called) return ;
                    called = true
                    // resolve(y)
                    // 递归解析，以防返回的还是newv Promise()
                    resolvePromise(promise2,y,resolve,reject)
                },e=>{//called是防止失败再进入成功
                    if(called) return ;
                    called = true
                    reject(e)
                })
            }else{   //{then:"123"}
                resolve(x)
            }
        } catch (e) {
            reject(e)
        }
    }else{
        resolve(x)
    }
}
class Promise {
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        // 存储，利于发布订阅模式
        this.onResolveCallback = [];
        this.onRejectCallback = [];
        let resolve = (value) => {
            // static静态方法resolve有等待效果，reject没有等待效果
            if(value instanceof Promise){
                return value.then(resolve,reject) // 静态promise嵌套递归解析，有可能也是一个promise

            }
            if (this.status === PENDING) {
                this.value = value;
                this.status = RESOLVED;
                this.onResolveCallback.forEach(fn => fn())
            }
        };
        let reject = (reason) => {
            if (this.status === PENDING)
                this.reason = reason;
                this.status = REJECTED;
                this.onRejectCallback.forEach(fn => fn())
        }
        try {
            // promise里是立即执行
            executor(resolve, reject);
        } catch (e) {
            reject(e)
        }

    };
    then(onFulfilled, onRejected) {
        // 连续调用链式then().then().then()
        onFulfilled = typeof onFulfilled === "function"?onFulfilled:v=>v;
        onRejected = typeof onRejected === "function"?onRejected:err=>{throw err}
        // 懒递归
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === RESOLVED) {
                // 加定时器是便于拿到promise2
                setTimeout(() => {
                    try {
                        // 普通值
                        let x = onFulfilled(this.value);
                        // x 可能是一个Promise
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }

                }, 0)

            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }

                }, 0)
            }
            if (this.status === PENDING) {
                setTimeout(() => {
                    try {
                        this.onResolveCallback.push(() => {
                            let x = onFulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        })
                    } catch (e) {
                        reject(e)
                    }

                }, 0);
                setTimeout(() => {
                    try {
                        this.onRejectCallback.push(() => {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        })
                    } catch (e) {
                        reject(e)
                    }

                }, 0)
            }
           
        })
         // 为了实现链式调用
        return promise2
    };
    // catch方法把then的参数resolve设置为null
    catch(errCallback){
        return  this.then(null,errCallback)
    };
    // promise的静态方法
    static resolve(data){
        return new Promise((resolve,reject)=>{
            resolve(data)

        })
    };
    static reject(data){
        return new Promise((resolve,reject)=>{
            reject(data)

        })
    };
}
// finally方法
Promise.prototype.finally = function(callback){
    return this.then((value)=>{
        return Promise.resolve(callback()).then(()=>value)
    },(reason)=>{
        return Promise.resolve(callback()).then(()=>{throw reason})
    })
}
// 入口测试
//promise的延迟对象，少套一层
Promise.defer = Promise.deferred = function(){
    let dfd = {};
    dtd.promise = new Promise((resolve,reject)=>{
        dtd.resolve = resolve;
        dtd.reject = reject
    })
    return dfd
}
// npm install promises-aplus-tests-g  安装测试包
// promises-aplus-test
// 模块化导出
module.exports = Promise