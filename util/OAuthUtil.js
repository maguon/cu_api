'use strict';
let serializer = require('serializer');
let httpUtil = require('./HttpUtil.js');
let serverLogger = require('./ServerLogger.js');
let systemConfig = require('../config/SystemConfig.js');
let logger = serverLogger.createLogger('OAuthUtil.js');
//var userDao = require('../dao/UserDAO.js')
let options ={
    crypt_key: 'mp',
    sign_key: 'bizwise'
};



let clientType = {
    temp : 'temp',
    user : 'user' ,
    supervise: 'supervise',
    admin : 'admin'
};



let clientId ="mp";

let headerTokenMeta = "auth-token";

//The expired time 30 days
let expiredTime = 30*24*60*60*1000;
serializer = serializer.createSecureSerializer(options.crypt_key, options.sign_key);



const _extend=(dst,src)=>{

    let srcs = [];
    if ( typeof(src) == 'object' ) {
        srcs.push(src);
    } else if ( typeof(src) == 'array' ) {
        for (let i = src.length - 1; i >= 0; i--) {
            srcs.push(this._extend({},src[i]))
        };
    } else {
        throw new Error("Invalid argument")
    }

    for (let i = srcs.length - 1; i >= 0; i--) {
        for (let key in srcs[i]) {
            dst[key] = srcs[i][key];
        }
    };

    return dst;
}



const createAccessToken=(clientType,userId ,status)=>{
    let out ;
    out = _extend({}, {
        access_token: serializer.stringify([clientType,  userId ,+new Date,status ]),
        refresh_token: null
    });
   /* userDao.updateUserLoginDate({userId:userId},function(error,result){
        if (error) {
            logger.error(' createAccessToken  updateUserLoginDate ' + error.message);
        } else {
            logger.info(' createAccessToken  updateUserLoginDate ' + result.affectedRows>0);
        }
    });*/
    return out.access_token;
}



const parseAccessToken=(accessToken)=>{
    try{
        let data = serializer.parse(accessToken);
        let tokenInfo ={};
        tokenInfo.clientType = data[0];
        tokenInfo.userId = data[1];
        tokenInfo.grantDate = data[2];
        tokenInfo.status = data[3];
        return tokenInfo;
    }catch(e){
        logger.error(' parseNewAccessToken :'+ e.message);
        return null;
    }
}
const parseAccessTokenSupervise=(accessToken)=>{
    try{
        let data = serializer.parse(accessToken);
        let tokenInfo ={};
        tokenInfo.clientType = data[0];
        tokenInfo.superviseId = data[1];
        tokenInfo.grantDate = data[2];
        tokenInfo.status = data[3];
        return tokenInfo;
    }catch(e){
        logger.error(' parseNewAccessToken :'+ e.message);
        return null;
    }
}


const parseUserToken=(req)=>{
    //var cookiesToken = getCookie(req.headers.cookie,cookieTruckMeta);
    let cookiesToken = req.headers[headerTokenMeta];
    if(cookiesToken == undefined){
        return null;
    }
    let tokenInfo = parseAccessToken(cookiesToken);
    if(tokenInfo == undefined){
        return null;
    }

    if(tokenInfo.clientType == undefined || tokenInfo.clientType != clientType.user){
        return null;
    }else if((tokenInfo.grantDate == undefined) || ((tokenInfo.grantDate + expiredTime)<(new Date().getTime()))){
        return null;
    }
    let resultObj = {};
    resultObj ={userId:tokenInfo.userId,userType:clientType.user,status:tokenInfo.status};
    return resultObj;
}


const parseAdminToken=(req)=>{
    let cookiesToken = req.headers[headerTokenMeta];
    if(cookiesToken == undefined){
        return null;
    }
    let tokenInfo = parseAccessToken(cookiesToken);
    if(tokenInfo == undefined){
        return null;
    }

    if(tokenInfo.clientType == undefined || tokenInfo.clientType != clientType.admin){
        return null;
    }else if((tokenInfo.grantDate == undefined) || ((tokenInfo.grantDate + expiredTime)<(new Date().getTime()))){
        return null;
    }
    let resultObj = {};
    resultObj ={userId:tokenInfo.userId,userType:clientType.admin,status:tokenInfo.status};
    return resultObj;
}
const getCookie=(cookie ,name)=>
{
    let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=cookie.match(reg))
        return (unescape(arr[2]));
    else
        return null;
}
const saveToken = (params,callback) => {
    httpUtil.httpPost(systemConfig.hosts.auth,'/api/token',{},params,(error,result)=>{
        callback(error,result)
    })
}


const removeToken=(params,callback)=>{
    httpUtil.httpDelete(systemConfig.hosts.auth,'/api/token/'+params.accessToken,{},params,(error,result)=>{
        callback(error,result)
    })
}

const getToken=(params,callback)=>{
    httpUtil.httpGet(systemConfig.hosts.auth,'/api/token/'+params.accessToken,{},{},(error,result)=>{
        callback(error,result)
    })
}
const savePasswordCode=(params,callback)=>{
    httpUtil.httpPost(systemConfig.hosts.auth,'/api/'+params.phone+"/passwordCode",{},params,(error,result)=>{
        callback(error,result)
    })
}
const getPasswordCode=(params,callback)=>{
    httpUtil.httpGet(systemConfig.hosts.auth,'/api/'+params.phone+"/passwordCode",{},{},(error,result)=>{
        callback(error,result)
    })
}
const saveSignCode=(params,callback)=>{
    httpUtil.httpPost(systemConfig.hosts.auth,'/api/'+params.phone+"/signCode",{},params,(error,result)=>{
        callback(error,result)
    })
}
const sendCaptcha=(params,callback)=>{
    httpUtil.httpPost(systemConfig.hosts.mq,'/api/captcha',{},params,(error,result)=>{
        callback(error,result)
    })
}
const sendMessage=(params,callback)=>{
    httpUtil.httpPost(systemConfig.hosts.mq,'/api/parking',{},params,(error,result)=>{
        callback(error,result)
    })
}
const getSignCode=(params,callback)=>{
    httpUtil.httpGet(systemConfig.hosts.auth,'/api/'+params.phone+"/signCode",{},{},(error,result)=>{
        callback(error,result)
    })
}
const saveSupervisePhoneCode=(params,callback)=>{
    httpUtil.httpPost(systemConfig.hosts.auth,'/api/'+params.phone+"/signCode",{},params,(error,result)=>{
        callback(error,result)
    })
}
const getSupervisePhoneCode=(params,callback)=>{
    httpUtil.httpGet(systemConfig.hosts.auth,'/api/'+params.phone+"/signCode",{},{},(error,result)=>{
        callback(error,result)
    })
}
const saveUserPhoneCode=(params,callback)=>{
    httpUtil.httpPost(systemConfig.hosts.auth,'/api/'+params.phone+"/signCode",{},params,(error,result)=>{
        callback(error,result)
    })
}
const getUserPhoneCode=(params,callback)=>{
    httpUtil.httpGet(systemConfig.hosts.auth,'/api/'+params.phone+"/signCode",{},{},(error,result)=>{
        callback(error,result)
    })
}
const saveSupervisePswdCode=(params,callback)=>{
    httpUtil.httpPost(systemConfig.hosts.auth,'/api/'+params.phone+"/signCode",{},params,(error,result)=>{
        callback(error,result)
    })
}
const getSupervisePswdCode=(params,callback)=>{
    httpUtil.httpGet(systemConfig.hosts.auth,'/api/'+params.phone+"/signCode",{},{},(error,result)=>{
        callback(error,result)
    })
}
module.exports = {
    createAccessToken,
    parseAccessToken ,
    clientType,
    parseAdminToken,
    parseUserToken,
    saveSignCode,
    getSignCode,
    saveToken,
    getToken,
    removeToken,
    savePasswordCode,
    getPasswordCode,
    parseAccessTokenSupervise,
    headerTokenMeta,
    sendMessage,
    saveSupervisePhoneCode,
    saveUserPhoneCode,
    sendCaptcha,
    saveSupervisePswdCode,
    getSupervisePhoneCode,
    getUserPhoneCode,
    getSupervisePswdCode
};
