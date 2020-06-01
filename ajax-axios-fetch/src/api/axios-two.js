import axios from 'axios';
import qs from 'qs';
/* 
 * 根据环境变量进行接口区分
 */
switch (process.env.NODE_ENV) {
    case "development":
        axios.defaults.baseURL = "http://127.0.0.1:9000";
        break;
    case "test":
        axios.defaults.baseURL = "http://192.168.20.15:9000";
        break;
    case "production":
        axios.defaults.baseURL = "http://api.zhufengpeixun.cn";
        break;
}
axios.defaults.baseURL = "http://127.0.0.1:8888";
axios.defaults.headers['Content-Type'] = "application/x-www-form-urlencoded";
axios.defaults.transformRequest = data => qs.stringify(data);
axios.defaults.timeout = 0;  //设置超时时间
axios.defaults.withCredentials = true;

axios.interceptors.request.use(config => {
	// 真实项目中，我们一般会在登录成功后，把从服务器获取的TOKEN信息存储到本地，以后再发送请求的时候，一般都把TOKEN带上（自定义请求头携带）
	let token = localStorage.getItem('token');
	token && (config.headers['Authorization'] = token);
	return config;
});

axios.interceptors.response.use(response => {
	return response.data;
}, reason => {
	// 从服务器没有获取数据（网络层失败）
	let response = null;
	if (reason) {
		// 起码服务器有响应，只不过状态码是4/5开头的
		response = reason.response;
		switch (response.status) {
			case 401:
				// 一般情况下都是未登录
				break;
			case 403:
				// 一般情况下是TOKEN过期
				break;
			case 404:
				// 地址不存在
				break;
		}
	} else {
		if (!window.navigator.onLine) {
			alert('和抱歉，网络连接已经断开，请联网后再试~~');
		}
	}
	return Promise.reject(response);
});

export default axios;