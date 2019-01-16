var moment = require("moment"),
	fs = require('fs');
//var crypto = require('crypto');  //加载crypto库

exports.base64Encode = function(data) {
	var b = new Buffer(data);
	var s = b.toString('base64');
	return s;
}

exports.base64Decode = function(data) {
	var b = new Buffer(data, 'base64')
	var s = b.toString();
	return s;
}

// var secret = 'autoai'

// exports.cryptoEncode = function(data){

// 	var cipher = crypto.createCipher('aes192', secret);
// 	var enc = cipher.update(str, 'utf8', 'hex');//编码方式从utf-8转为hex;
// 	enc += cipher.final('hex');//编码方式从转为hex;

// 	console.log(enc);
// }

// exports.cryptoDecode = function(data){

// 	var decipher = crypto.createDecipher('aes192', secret);
// 	var dec = decipher.update(str, 'hex', 'utf8');//编码方式从hex转为utf-8;
// 	dec += decipher.final('utf8');//编码方式从utf-8;
	
// 	console.log(dec);
// }

exports.myLog = function(tag, msg) {

	var content = moment().format("YYYY-MM-DD HH:mm:ss") + ' : ' + tag + '->[' + msg + ']\n';

	console.log(content);

	// saveLog(content);

}

function saveLog(content){

	var logfile = moment().format("YYYY-MM-DD")+'.log'

	var logDir =  __dirname+"/log/";

	var logPath = logDir + logfile;

	if(fs.existsSync(logPath)){
		fs.appendFile(logPath, content,(error)  => {
		  if (error) return console.log("追加文件失败" + error.message);
		 	 
		});
	}else{
		fs.mkdir(logDir, function(err){
			if(err)
				console.error(err);
			console.log(logDir+'创建目录成功');
		});
		fs.createWriteStream(logPath);
	}

}


