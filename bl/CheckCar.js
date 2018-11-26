'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('CheckCar.js');
const checkCarDAO = require('../dao/CheckCarDAO.js');
const moment = require('moment/moment.js');

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
    checkCarDAO.addCheckCar(params,(error,result)=>{
        if (error) {
            logger.error(' addCheckCar ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info(' addCheckCar ' + "success");
            params.checkCarId = result.insertId;
            params.checkContent =" 扫码成功 ";
            params.checkId = params.checkCarId;
            params.carNo = params.userCarId;
            resUtil.resetCreateRes(res,result,null);
            return next();
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