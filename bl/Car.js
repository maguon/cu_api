'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('Car.js');
const carInfoDAO = require('../dao/CarInfoDAO.js');
const moment = require('moment/moment.js');

const queryCarInfo = (req,res,next) => {
    let params = req.params;
    let myDate = new Date();
    let strDate = moment(myDate).format('YYYYMMDD');
    params.createdDateId = parseInt(strDate);
    carInfoDAO.queryCarInfo(params,(error,result)=>{
        if (error) {
            logger.error(' queryCarInfo ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info(' queryCarInfo ' + "success");
            resUtil.resetQueryRes(res,result,null) ;
            return next();
        }
    })
}
const updateStatus = (req,res,next) => {
    let params = req.params;
    carInfoDAO.updateStatus(params,(error,result)=>{
        if (error) {
            logger.error(' updateStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info(' updateStatus ' + "success");
            resUtil.resetUpdateRes(res,result,null) ;
            return next();
        }
    })
}
const addCar = (req,res,next) => {
    let params = req.params;
    carInfoDAO.addCar(params,(error,result)=>{
        if (error) {
            logger.error(' addCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info(' addCar ' + "success");
            resUtil.resetCreateRes(res,result,null) ;
            return next();
        }
    })
}
module.exports = {
    queryCarInfo,
    updateStatus,
    addCar
}