'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('CheckCar.js');
const checkCarDAO = require('../dao/CheckCarDAO.js');
const moment = require('moment/moment.js');
let oauthUtil = require('../util/OAuthUtil.js');
let userDAO = require('../dao/UserInfoDAO.js');
const userCarDao = require('../dao/UserCarDAO.js');

const queryCarInfo = (req,res,next) => {
    let params = req.params;
    checkCarDAO.queryCarInfo(params,(error,result)=>{
        if (error) {
            logger.error(' queryCarInfo ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info(' queryCarInfo ' + "success");
            resUtil.resetQueryRes(res,result,null) ;
            return next();
        }
    })
}
const updateStatus = (req,res,next) => {
    let params = req.params;
    checkCarDAO.updateStatus(params,(error,result)=>{
        if (error) {
            logger.error(' updateStatus ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info(' updateStatus ' + "success");
            resUtil.resetUpdateRes(res,result,null) ;
            return next();
        }
    })
}
const addCheckCar = (req,res,next) => {
    let params = req.params;
    let myDate = new Date();
    let strDate = moment(myDate).format('YYYYMMDD');
    params.createdDateId = parseInt(strDate);
    userCarDao.queryUserCar({userCarId:params.userCarId},(error,rows)=>{
        if (error) {
            logger.error('addCheckCar queryUserCar ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else if(rows && rows.length < 1){
            logger.warn('addCheckCar queryUserCar '+'No vehicle information available！');
            resUtil.resetFailedRes(res,'查无此车辆信息',null);
        }else{
            params.plateNumber = rows[0].license_plate;
            checkCarDAO.addCheckCar(params,(error,result)=>{
                if (error) {
                    logger.error(' addCheckCar checkCarDAO_Add ' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else if(result && result.insertId < 1){
                    logger.warn('addCheckCar checkCarDAO_Add '+'Failed to add illegal vehicle!');
                    resUtil.resetFailedRes(res,'添加违章车辆失败',null);
                    return next();
                }else{
                    logger.info(' addCheckCar checkCarDAO_Add ' + "success");
                    params.checkCarId = result.insertId;
                    params.checkContent =" 扫码成功 ";
                    params.checkId = params.checkCarId;
                    params.carNo = params.userCarId;
                    params.userType = 1;
                    let myDate = new Date();
                    params.timeStr = moment(myDate).format('YYYY-MM-DD HH:mm:ss');
                    new Promise((resolve,reject)=>{
                        userDAO.queryUser({userId:params.userId},(error,rows)=>{
                            if(error){
                                logger.error('addCheckCar queryUser ' + error.message);
                                resUtil.resInternalError(error, res, next);
                            }else{
                                logger.info('addCheckCar queryUser ' + 'success');
                                let phone = rows[0].phone;
                                let openid = rows[0].wechat_id;
                                params.openid = openid;
                                params.phone = phone;
                                resolve();
                            }
                        })
                    }).then(()=>{
                        oauthUtil.sendMessage(params,(error,result)=>{
                            if(error){
                                logger.error('addCheckCar sendMessage ' + error.message);
                                resUtil.resInternalError(error, res, next);
                            }else{
                                logger.info('addCheckCar sendMessage ' + 'success');
                                resUtil.resetQueryRes(res,{success:true},null);
                                return next();
                            }
                        })
                    })
                }
            })
        }
    })
}
const queryCarByMonth = (req,res,next) => {
    let params = req.params;
    checkCarDAO.queryCarByMonth(params,(error,result)=>{
        if (error) {
            logger.error(' queryCarByMonth ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info(' queryCarByMonth ' + "success");
            resUtil.resetQueryRes(res,result,null) ;
            return next();
        }
    })
}
const queryCarByDay = (req,res,next) => {
    let params = req.params;
    checkCarDAO.queryCarByDay(params,(error,result)=>{
        if (error) {
            logger.error(' queryCarByDay ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info(' queryCarByDay ' + "success");
            resUtil.resetQueryRes(res,result,null) ;
            return next();
        }
    })
}
const queryCarNumByDay = (req,res,next) => {
    let params = req.params;
    checkCarDAO.queryCarNumByDay(params,(error,result)=>{
        if (error) {
            logger.error(' queryCarNumByDay ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info(' queryCarNumByDay ' + "success");
            resUtil.resetQueryRes(res,result,null) ;
            return next();
        }
    })
}
const queryCheckCar = (req,res,next) => {
    let params = req.params;
    checkCarDAO.queryCheckCar(params,(error,result)=>{
        if (error) {
            logger.error(' queryCheckCar ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info(' queryCheckCar ' + "success");
            resUtil.resetQueryRes(res,result,null) ;
            return next();
        }
    })
}
module.exports = {
    queryCarInfo,
    updateStatus,
    addCheckCar,
    queryCarByMonth,
    queryCarByDay,
    queryCarNumByDay,
    queryCheckCar
}