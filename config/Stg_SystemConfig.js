const mysqlConnectOptions ={
    user: 'cu_db_user',
    password: 'log_cu_2018',
    database:'log_cu',
    host: '47.93.121.1' ,
    charset : 'utf8mb4',
    //,dateStrings : 'DATETIME'
};


const logLevel = 'DEBUG';
const loggerConfig = {
    appenders: {
        console: { type: 'console' } ,
        file : {
            "type": "file",
            "filename": "../log_cu_api.html",
            "maxLogSize": 2048000,
            "backups": 10
        }
    },
    categories: { default: { appenders: ['console','file'], level: 'debug' } }
}


const mongoConfig = {
    connect : 'mongodb://127.0.0.1:27017/log_cu'
}

const hosts = {
    auth:"stg.myxxjs.com:9009"
}

const wechatConfig = {
    mpAppId : "wx8063556bcdab3e2b",
    mpSecret : "a7c5c6cd22d89a3eea6c739a1a3c74d1",
    mphost : "api.weixin.qq.com"
}


module.exports = { mysqlConnectOptions ,loggerConfig, logLevel , mongoConfig  ,wechatConfig ,hosts}
