(function (window) {
    let getProto = Object.getPrototypeOf,
        class2type = {},
        toString = class2type.toString,
        hasOwn = class2type.hasOwnProperty,
        fnToString = hasOwn.toString,
        ObjectFunctionString = fnToString.call(Object);

    // 检测是否是一个函数
    const isFunction = function isFunction(obj) {
        return typeof obj === "function" && typeof obj.nodeType !== "number" &&
            typeof obj.item !== "function";
    };

    // 检测是否为一个window对象
    const isWindow = function isWindow(obj) {
        return obj != null && obj === obj.window;
    };

    // 检测数据类型的公共办法
    const toType = function toType(obj) {
        if (obj == null) return obj + "";
        let reg = /^\[object ([0-9a-zA-Z]+)\]$/;
        return typeof obj === "object" || typeof obj === "function" ?
            reg.exec(toString.call(obj))[1].toLowerCase() :
            typeof obj;
    };

    // 检测是否为数组或者类数组
    const isArrayLike = function isArrayLike(obj) {
        var length = !!obj && "length" in obj && obj.length,
            type = toType(obj);
        if (isFunction(obj) || isWindow(obj)) return false;
        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && (length - 1) in obj;
    };

    // 检测是否为纯粹的对象
    const isPlainObject = function isPlainObject(obj) {
        let proto, Ctor,
            type = toType(obj);
        if (!obj || type !== "object") return false;
        proto = getProto(obj);
        if (!proto) return true;
        Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
        return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
    };

    // 检测是否为空对象「空对象：没有任何的私有属性{含Symbol类型}」
    const isEmptyObject = function isEmptyObject(obj) {
        if (obj == null || (typeof obj !== "object" && typeof obj !== "function")) return false;
        let keys = Object.keys(obj);
        if (typeof Symbol !== "undefined") keys = keys.concat(Object.getOwnPropertySymbols(obj));
        return keys.length === 0;
    };

    // 检测是否为数字
    const isNumeric = function isNumeric(obj) {
        let type = toType(obj);
        return (type === "number" || type === "string") && !isNaN(obj);
    };

    // 迭代数组/类数组/对象
    const each = function each(obj, callback) {
        let length,
            i = 0,
            keys;
        if (isArrayLike(obj)) {
            length = obj.length;
            for (; i < length; i++) {
                if (callback.call(obj[i], obj[i], i) === false) break;
            }
        } else {
            keys = Object.keys(obj);
            if (typeof Symbol !== "undefined") keys.concat(Object.getOwnPropertySymbols(obj));
            for (i = 0; i < keys.length; i++) {
                let key = keys[i],
                    item = obj[key];
                if (callback.call(item, item, key) === false) break;
            }
        }
        return obj;
    };

    // 实现数组/对象的深浅拷贝
    const clone = function clone() {
        // 处理传递的实参  target:克隆的目标  deep:控制深浅克隆
        let target = arguments[0],
            len = arguments.length,
            deep = false,
            treated = arguments[len - 1];
        if (typeof target === "boolean" && len >= 2) {
            deep = target;
            target = arguments[1];
        }

        // 防止套娃操作
        if (!Array.isArray(treated) || !treated.treated) {
            treated = [];
            treated.treated = true;
        }
        if (treated.includes(target)) return target;
        treated.push(target);

        // 检测类型
        let type = toType(target),
            isArray = Array.isArray(target),
            isObject = isPlainObject(target);

        // 特殊值的克隆「含：原始值、特殊对象...」
        if (target == null) return target;
        let ctor = target.constructor;
        if (/^(regexp|date)$/i.test(type)) return new ctor(target);
        if (/^(error)$/i.test(type)) return new ctor(target.message);
        if (isFunction(target)) return function proxy(...params) {
            return target.call(this, ...params);
        };
        if (!isObject && !isArray) return target;

        // 数组和对象的克隆
        let result = new ctor();
        each(target, (copy, key) => {
            // copy:要拷贝的属性值  key:属性名
            if (deep) {
                // 深拷贝
                result[key] = clone(deep, copy, treated);
                return;
            }
            // 浅拷贝
            result[key] = copy;
        });
        return result;
    };

    /* 多库共存 */
    let usufruct = window._;
    const noConflict = function noConflict() {
        if (window._ === utils && typeof usufruct !== 'undefined') {
            window._ = usufruct;
        }
        return utils;
    };

    /* 暴露API */
    let utils = {
        toType,
        isFunction,
        isWindow,
        isArrayLike,
        isPlainObject,
        isEmptyObject,
        isNumeric,
        each,
        clone,
        noConflict
    };
    if (typeof define === "function" && define.amd) define("utils", [], () => utils);
    if (typeof module === "object" && typeof module.exports === "object") module.exports = utils;
    if (window.document) window.utils = window._ = utils;
})(typeof window !== 'undefined' ? window : this);