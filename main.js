const http = require('http');
const https = require('https');
var url = require('url');
var fs = require('fs');
var path = require('path');

const Config = require('./config');
var utils = require('./utils');

var tag = 'main';

//声明对应后缀返回的类型
var contentType = {};
contentType[".html"] = "text/html";
contentType[".js"] = "text/javascript";
contentType[".css"] = "text/css";
contentType[".gif"] = "image/gif";
contentType[".jpg"] = "image/jpeg";
contentType[".png"] = "image/png";


http.createServer(function (request, response) {

	var method = request.method;

	var requestObj = url.parse(request.url, true);

	var pathName = requestObj.pathname;

	utils.myLog(tag, "request.url->" + request.url);

	utils.myLog(tag, JSON.stringify(requestObj));

	if (pathName.match('/pages/')) {//返回页面
		handlePages(pathName, response);

	} else if (method == 'GET') {//中转get请求
		utils.myLog(tag, 'received get request!');

		transferGet(request, response);

	} else if (method == 'POST') {//中转post请求
		utils.myLog(tag, 'received post request!');

		transferPost(request, response);
	}

}).listen(Config.port);

utils.myLog(tag, 'NodeProxyTransfer service is running!');

function handlePages(pathName, response) {

	var pagePathArr = (pathName + '').split('/pages/');

	var pagePath = __dirname + '/pages/' + pagePathArr[1];

	utils.myLog(tag, "pagePath->" + pagePath);

	if (fs.existsSync(pagePath)) {
		var page = fs.readFileSync(pagePath);

		var content = contentType[path.extname(pagePath)] ? contentType[path.extname(pagePath)] : "application/octet-stream";

		utils.myLog(tag, "contentType->" + content);

		response.writeHeader(200, { "ContentType": content });
		response.write(page);
		response.end();
	}

}

function transferGet(request, response) {

	requestProxy.GET(request, response);

}

function transferPost(request, response) {
	var data = ""
	request.on("data", (chunk) => {
		data += chunk;
	});

	request.on("end", () => {

		requestProxy.POST(request, response, data);

	});
}

var requestProxy = new RequestProxy();

function RequestProxy() {

	this.GET = function (request, response) {

		let option = Config.protocal + '://' + Config.proxyTransferUrl + request.url;
		
		let proxy ;
		if ('https' == Config.protocal) {
			proxy = https;
		} else  {
			proxy = http;
		}

		var request = proxy.request(option, function (res) {
			var responseData = ""
			res.on("data", (data) => {
				responseData += data
			});

			res.on("end", () => {

				utils.myLog(tag, "requestGet->response->" + responseData);

				response.write(responseData);
				response.end();
			});

		});

		request.end();
	};

	this.POST = function (request, response, content) {
		
		var option = {
			host: Config.proxyTransferUrl,
			path: request.url,
			method: 'POST',
			json: true,
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': content.length
			}
		}

		let proxy ;
		if ('https' == Config.protocal) {
			proxy = https;
		} else  {
			proxy = http;
		}

		var request = proxy.request(option, function (res) {
			var responseData = ""
			res.on("data", (data) => {
				responseData += data
			});

			res.on("end", () => {

				utils.myLog(tag, "requestPost->response->" + responseData);

				response.write(responseData);
				response.end();
			});

		});
		request.write(content);
		request.end();
	};
}
