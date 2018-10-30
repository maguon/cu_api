'use strict';
const serializer = require('serializer');
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('QrCode.js');
const qrCodeDAO = require('../dao/QrCodeDAO.js');
const userCarDAO = require('../dao/UserCarDAO.js');

const getQrCode = (req,res,next)=>{
    let params = req.params;
    let userType = req.headers['user-type'] ;
    let result = serializer.parse(params.qrCode);
    if(userType==0){
        userCarDAO.queryUserCar({userCarId:result.userCarId},(error,result)=>{
            if(error){
                logger.error('queryCheckCar' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else{
                logger.info('queryCheckCar' + 'success');
                resUtil.resetQueryRes(res,result,null);
                return next();
            }
        })
    }else{
        let ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger'){
            let url = "";
            resUtil.resetQueryRes(res,url,null);
            return "WeiXIN";
        }else{
            resUtil.resetQueryRes(res,'错误',null);
        }
    }
    /*oauthUtil.getQrCode({qrCodeId:params.qrCodeId},(error,result)=>{
        if(error){
            logger.error('getQrCode' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getQrCode' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });*/
};
const createQrCode = (req,res,next) =>{
    let params = req.params;
    let qrCodeString = serializer.stringify([params.userId,params.userCarId]);
    resUtil.resetQueryRes(res,{code:qrCodeString},null);
    return next();
}
module.exports = {
    getQrCode,createQrCode
}