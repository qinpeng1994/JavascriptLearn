// 基于promise封装ajax解决回调地狱问题
const qs = require('qs');
function ajax(option = {}) {
	option = Object.assign({
		url: '',
		method: 'get',
		data: null
	}, option);

	option.data = qs.stringify(option.data);
	let isGET = /^(GET|DELETE|HEAD|OPTIONS)$/i.test(option.method);
	if (isGET && option.data) {
		let char = option.url.includes('?') ? '&' : '?';
		option.url += `${char}${option.data}`;
		option.data = null;
	}
    // 有ajax基于promise进行管控
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open(option.method, option.url);
		xhr.onreadystatechange = function () {
			if (!/^2\d{2}$/.test(xhr.status)) { //服务器返回状态码，失败
				reject(xhr);
				return;
			}
			if (xhr.readyState === 4) {
				resolve(JSON.parse(xhr.responseText));
			}
		};
		xhr.send(option.data);
	});
}
// 简化
['get', 'post', 'delete', 'put', 'head', 'options'].forEach(item => {
	ajax[item] = function (url = '', data = {}) {
		return ajax({
			url,
			method: item,
			data
		});
	};
});

export default ajax;