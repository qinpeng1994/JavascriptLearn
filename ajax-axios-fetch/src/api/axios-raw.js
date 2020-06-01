/* 
 * 基于PROMISE封装自己的AJAX库 【v1.0.0】
 */
(function anonymous() {
    let isObj = function isObj(val) {
        return val !== null && typeof val === "object";
    };

    let char = function char(url) {
        return url.includes('?') ? '&' : '?';
    };

    /* ===AJAX核心处理=== */
    class MyAJAX {
        constructor(options = {}) {
            this.config = options;
            this.ISGET = /^(GET|DELETE|HEAD|OPTIONS)$/i.test(options.method);
            return this.init();
        }
        init() {
            let transformRequest = this.config.transformRequest;
            if (typeof transformRequest === "function") {
                this.config = transformRequest(this.config);
            }
            // 按照最新的CONFIG处理即可
            let {
                method,
                validateStatus,
                transformResponse,
                withCredentials
            } = this.config;
            !Array.isArray(transformResponse) ? transformResponse = [null, null] : null;
            return new Promise((resolve, reject) => {
                // 发送AJAX请求
                let xhr = new XMLHttpRequest;
                xhr.open(method, this.handleURL());
                this.handleHeaders(xhr);
                xhr.withCredentials = withCredentials;
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 2) {
                        let flag = validateStatus(xhr.status);
                        if (!flag) {
                            reject(this.handleResult(xhr, false));
                            return;
                        }
                    }
                    if (xhr.readyState === 4) {
                        resolve(this.handleResult(xhr, true));
                    }
                };
                xhr.send(this.handleData());
            }).then(...transformResponse);
        }
        // URL处理:CACHE/PARAMS
        handleURL() {
            let {
                url,
                baseURL,
                cache,
                params
            } = this.config;
            url = baseURL + url;
            if (this.ISGET) {
                if (isObj(params)) {
                    let paramsText = ``;
                    for (let key in params) {
                        if (!params.hasOwnProperty(key)) break;
                        paramsText += `&${key}=${params[key]}`;
                    }
                    paramsText = paramsText.substring(1);
                    url += char(url) + paramsText;
                }
                if (cache === false) {
                    url += `${char(url)}_=${new Date().getTime()}`;
                }
            }
            return url;
        }
        // 设置请求头信息
        handleHeaders(xhr) {
            let {
                headers
            } = this.config;
            if (isObj(headers)) {
                for (let key in headers) {
                    if (!headers.hasOwnProperty(key)) break;
                    xhr.setRequestHeader(key, headers[key]);
                }
            }
        }
        // 请求主体的值
        handleData() {
            if (this.ISGET) return null;
            let data = this.config.data;
            if (isObj(data)) {
                data = JSON.stringify(data);
            }
            return data;
        }
        // 获取返回的信息
        handleResult(xhr, flag) {
            // 获取响应头信息
            let headers = {};
            xhr.getAllResponseHeaders().split(/(?:\n|\r)/g).filter(item => item.length > 0).forEach(item => {
                let [key, value = ''] = item.split(': ');
                key ? headers[key] = value : null;
            });

            if (flag) {
                let responseType = this.config.responseType;
                let data = xhr.responseText;
                switch (responseType.toLowerCase()) {
                    case 'json':
                        data = JSON.parse(data);
                        break;
                    case 'xml':
                        data = xhr.responseXML;
                        break;
                }
                return {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers,
                    request: xhr,
                    config: this.config,
                    data
                };
            }
            return {
                status: xhr.status,
                statusText: xhr.statusText,
                headers,
                request: xhr,
                config: this.config
            };
        }
    }

    /* ===配置出_AJAX应有的接口并暴露到全局上=== */
    function initParams(options = {}) {
        !isObj(_ajax.defaults.headers) ? _ajax.defaults.headers = {} : null;
        !isObj(options.headers) ? options.headers = {} : null;
        options.headers = Object.assign(_ajax.defaults.headers, options.headers);
        return Object.assign(_ajax.defaults, options);
    }

    // _AJAX执行发送请求
    function _ajax(options = {}) {
        options = initParams(options);
        return new MyAJAX(options);
    }

    // 默认的参数配置信息
    _ajax.defaults = {
        baseURL: '',
        url: '',
        method: 'get',
        responseType: 'json',
        withCredentials: false,
        cache: true,
        params: null,
        data: null,
        headers: {
            "Content-Type": "application/json"
        },
        transformRequest: null,
        transformResponse: null,
        validateStatus: status => {
            return status >= 200 && status < 300;
        }
    };

    // _AJAX的快捷请求方法
    ['get', 'delete', 'head', 'options'].forEach(item => {
        _ajax[item] = function (url, options = {}) {
            options.url = url;
            options.method = item;
            options = initParams(options);
            return new MyAJAX(options);
        };
    });
    ['post', 'put'].forEach(item => {
        _ajax[item] = function (url, data = {}, options = {}) {
            options.url = url;
            options.method = item;
            options.data = data;
            options = initParams(options);
            return new MyAJAX(options);
        };
    });
    _ajax.all = function all(promiseArr = []) {
        return Promise.all(promiseArr);
    };
    window._ajax = _ajax;
})();