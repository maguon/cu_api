'use strict';
let sysMsg = require('../util/SystemMsg.js');
let sysError = require('../util/SystemError.js');
let resUtil = require('../util/ResponseUtil.js');
let encrypt = require('../util/Encrypt.js');
let listOfValue = require('../util/ListOfValue.js');
let oAuthUtil = require('../util/OAuthUtil.js');
let serverLogger = require('../util/ServerLogger.js');
let logger = serverLogger.createLogger('OAuth.js');

const transferToken=()=>{
    const parseAccessToken=(req,res,next)=>{
        let accessToken = req.headers[oAuthUtil.headerTokenMeta];
        if(accessToken == undefined){
            return next();
        }else{
            oAuthUtil.getToken({accessToken:accessToken},(error,rows)=>{
                if(error){
                    logger.error('transferToken parseAccessToken ' + error.stack);
                }else{
                    logger.info('transferToken parseAccessToken ' + 'success');
                    if(rows && rows.result &&rows.result.id){
                        req.params._uid = rows.result.id;
                        req.params._uname = rows.result.name;
                        req.params._utype = rows.result.type;
                        req.params._ustatus = rows.result.status;
                        req.params._uphone = rows.result.phone;
                    }
                }
                return next();
            })
        }
    }

    return parseAccessToken ;

}
const checkToken=()=>{
    const checkAccessToken=(req,res,next)=>{
        let accessToken = req.headers[oAuthUtil.headerTokenMeta];
        if(accessToken == undefined){
            return next(sysError.NotAuthorizedError());
        }else{
            oAuthUtil.getToken({accessToken:accessToken},(error,result)=>{
                if(error){
                    logger.error("checkToken checkAccessToken " + error.stack);
                    return next(sysError.NotAuthorizedError());
                }else{
                    logger.info('checkToken checkAccessToken ' + 'success');
                    if(result && result.id){
                        req.params._uid = result.id;
                        req.params._uname = result.name;
                        req.params._utype = result.type;
                        req.params._ustatus = result.status;
                        req.params._uphone = result.phone;
                        return next();
                    }else{
                        return next(sysError.NotAuthorizedError());
                    }
                }
            })
        }
    }
    return checkAccessToken;
}
module.exports = {
    transferToken,
    checkToken
}