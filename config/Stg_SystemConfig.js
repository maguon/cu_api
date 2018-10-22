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
    auth:{
        host :"stg.myxxjs.com",
        port : 9009
    }
}

const wechatConfig = {
    mpAppId : "wx694764f7676e75c3",
    mpSecret : "08baba525260e016ce793c7267133035",
    mphost : "api.weixin.qq.com"
}


module.exports = { mysqlConnectOptions ,loggerConfig, logLevel , mongoConfig  ,wechatConfig ,hosts}
