var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var oauthUtil = require('../util/OAuthUtil.js');
var encrypt = require('../util/Encrypt.js');
var resUtil = require('../util/ResponseUtil.js');
var listOfValue = require('../util/ListOfValue.js');
//var smsConfig = require('../config/SmsConfig.js');
//var smsDAO = require('../dao/SmsDAO.js');
//var userDAO = require('../dao/UserDAO.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Sms.js');
function sendPswdSms(req,res,next){
    var params = req.params;
    var captcha = ""
    Seq().seq(function(){
        var that = this;
        //Get user by phone
        userDAO.getUser(params,function(error,rows){
            if (error) {
                logger.error(' sendPswdSms ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows ==null || rows.length==0){
                    logger.warn(' sendPswdSms ' +params.truckNum+ sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                    return next();
                }else if(rows[0].status !=1){
                    logger.warn(' sendPswdSms ' +params.truckNum+ sysMsg.SYS_AUTH_TOKEN_ERROR);
                    resUtil.resetFailedRes(res,sysMsg.SYS_AUTH_TOKEN_ERROR);
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        var that = this;
        captcha = encrypt.getSmsRandomKey();
        oauthUtil.savePasswordCode({phone:params.mobile,code:captcha},function(error,result){
            if (error) {
                logger.error(' sendPswdSms ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                that()
            }
        })
    }).seq(function(){
        smsDAO.sendSms({phone:params.mobile,captcha:captcha,templateId:smsConfig.smsOptions.signTemplateId},function (error,result) {
            if (error) {
                logger.error(' sendPswdSms ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                logger.info(' sendPswdSms ' + 'success');
                resUtil.resetCreateRes(res,{insertId:1},null);
                return next();
            }
        })
    })

}


module.exports={
    sendPswdSms : sendPswdSms
}