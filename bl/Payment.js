'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('PaymentDAO.js');
const paymentDAO = require('../dao/PaymentDAO.js');
const orderDAO = require('../dao/OrderDAO.js');
const wechatDAO =require('../dao/WechatDAO.js');
const encrypt = require('../util/Encrypt.js');
const sysConfig = require('../config/SystemConfig.js');
const https = require('https');
const fs = require('fs');
const xml2js = require('xml2js');
const oAuthUtil = require('../util/OAuthUtil.js');

const addPayment = (req,res,next)=>{
    let params = req.params;
    new Promise((resolve,reject)=>{
        orderDAO.getOrder(params,(error,rows)=>{
            if(error){
                logger.error('getOrder' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else if(rows && rows.length < 1){
                logger.warn('getOrder '+'查询订单失败');
                resUtil.resetFailedRes(res,'查询订单失败',null);
            }else{
                params.paymentPrice = rows[0].total_price + rows[0].total_freight;
                resolve();
            }
        })
    }).then(()=>{
        paymentDAO.addPayment(params,(error,result)=>{
            if(error){
                logger.error('addPayment' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else if(result && result.insertId < 1){
                logger.warn('addPayment '+'生成支付信息失败');
                resUtil.resetFailedRes(res,'生成支付信息失败',null);
            }else{
                logger.info('addPayment '+'success');
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        })
    })
}
const getPayment = (req,res,next)=>{
    let params = req.params;
    paymentDAO.getPayment(params,(error,result)=>{
        if(error){
            logger.error('getPayment' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('getPayment' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
const wechatPayment = (req,res,next)=>{
    let xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true})
    let body = 'test';
    let jsa = 'JSAPI';
    let params = req.params;
    let requestIp = req.connection.remoteAddress.replace('::ffff:','');
    let ourString = encrypt.randomString();
    let signStr =
          "appid="+sysConfig.wechatConfig.mpAppId
        + "&body="+body
        + "&mch_id="+sysConfig.wechatConfig.mchId
        + "&nonce_str="+ourString
        + "&notify_url="+sysConfig.wechatConfig.notifyUrl
        + "&openid="+params.openid
        + "&out_trade_no="+params.orderId
        + "&spbill_create_ip="+requestIp
        + "&total_fee=" +params.totalFee
        + "&trade_type="+jsa
        + "&key="+sysConfig.wechatConfig.paymentKey;
    let signByMd = encrypt.encryptByMd5NoKey(signStr);
    let reqBody =
        '<xml><appid>'+sysConfig.wechatConfig.mpAppId+'</appid>' +
        '<body>'+body+'</body>' +
        '<mch_id>'+sysConfig.wechatConfig.mchId+'</mch_id>' +
        '<nonce_str>'+ourString+'</nonce_str>' +
        '<notify_url>'+sysConfig.wechatConfig.notifyUrl+'</notify_url>' +
        '<openid>'+params.openid+'</openid>' +
        '<out_trade_no>'+params.orderId+'</out_trade_no>' +
        '<spbill_create_ip>'+requestIp+'</spbill_create_ip>' +
        '<total_fee>'+params.totalFee + '</total_fee>' +
        '<trade_type>'+jsa+'</trade_type>' +
        '<sign>'+signByMd+'</sign></xml>';
    let url="/pay/unifiedorder";
    logger.info("ip---"+req.connection.remoteAddress);
    let options = {
        host: 'api.mch.weixin.qq.com',
        port: 443,
        path: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length' : Buffer.byteLength(reqBody, 'utf8')
        }
    }
    let httpsReq = https.request(options,(result)=>{
        let data = "";
        result.on('data',(d)=>{
            data += d;
        }).on('end',()=>{
            xmlParser.parseString(data,(err,result)=>{
                //将返回的结果再次格式化
                let resString = JSON.stringify(result);
                let evalJson = eval('(' + resString + ')');
                let myDate = new Date();
                let myDateStr = myDate.toLocaleString();
                let paymentJson = [{
                    nonce_str: evalJson.xml.nonce_str,
                    prepay_id: evalJson.xml.prepay_id,
                    sign:evalJson.xml.sign,
                    timeStemp: myDateStr
                }];
                logger.info("paymentResult"+result);
                resUtil.resetQueryRes(res,paymentJson,null);
            });
            res.send(200,data);
            return next();
        }).on('error', (e)=>{
            logger.info('wechatPayment '+ e.message);
            res.send(500,e);
            return next();
        });

    });
    httpsReq.write(reqBody,"utf-8");
    httpsReq.end();
    httpsReq.on('error',(e)=>{
        logger.info('wechatPayment '+ e.message);
        res.send(500,e);
        return next();
    });
}
const wechatRefund = (req,res,next)=>{
    let xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true});
    let params = req.params;
    let ourString = encrypt.randomString();
    let signStr =
        "appid="+sysConfig.wechatConfig.mpAppId
        + "&mch_id="+sysConfig.wechatConfig.mchId
        + "&nonce_str="+ourString
        + "&notify_url="+sysConfig.wechatConfig.notifyUrl
        //+ "&openid="+params.openid
        + "&out_trade_no="+params.orderId
        + "&out_refund_no="+params.orderId
        + "refund_fee="+params.refundFee
        + "&total_fee=" +params.totalFee
        + "&key="+sysConfig.wechatConfig.paymentKey;
    let signByMd = encrypt.encryptByMd5NoKey(signStr);
    let reqBody =
        '<xml><appid>'+sysConfig.wechatConfig.mpAppId+'</appid>' +
        '<mch_id>'+sysConfig.wechatConfig.mchId+'</mch_id>' +
        '<nonce_str>'+ourString+'</nonce_str>' +
        '<notify_url>'+sysConfig.wechatConfig.notifyUrl+'</notify_url>' +
        //'<openid>'+params.openid+'</openid>' +
        '<out_trade_no>'+params.orderId+'</out_trade_no>' +
        '<out_refund_no>'+params.orderId+'</out_refund_no>' +
        '<refund_fee>'+params.refundFee+'</refund_fee>' +
        '<total_fee>'+params.totalFee + '</total_fee>' +
        '<sign>'+signByMd+'</sign></xml>';
    let url="/secapi/pay/refund";
    logger.info("ip---"+req.connection.remoteAddress);
    let options = {
        host: 'api.mch.weixin.qq.com',
        port: 443,
        path: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length' : Buffer.byteLength(reqBody, 'utf8')
        }
    }
    let httpsReq = https.request(options,(result)=>{
        let data = "";
        result.on('data',(d)=>{
            data += d;
        }).on('end',()=>{
            xmlParser.parseString(data,(err,result)=>{
                let resString = JSON.stringify(result);
                let evalJson = eval('(' + resString + ')');
                let prepayIdJson = [{prepayId: evalJson.xml}];
                logger.info("paymentResult1"+prepayIdJson);

                resUtil.resetQueryRes(res,prepayIdJson,null);
            });
            res.send(200,data);
            return next();
        }).on('error', (e)=>{
            logger.info('wechatPayment '+ e.message);
            res.send(500,e);
            return next();
        });

    });
    httpsReq.write(reqBody,"utf-8");
    httpsReq.end();
    httpsReq.on('error',(e)=>{
        logger.info('wechatPayment '+ e.message);
        res.send(500,e);
        return next();
    });
};
const addWechatPayment=(req,res,next) => {
    let params = req.params;
    paymentDAO.addWechatPayment(params,(error,result)=>{
        if(error){
            logger.error('addWechatPayment' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('addWechatPayment' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
}
const addWechatRefund=(req,res,next) => {
    let params = req.params;
    paymentDAO.addWechatRefund(params,(error,result)=>{
        if(error){
            logger.error('addWechatRefund' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('addWechatRefund' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
}
module.exports = {
    addPayment,
    getPayment,
    wechatPayment,
    addWechatPayment,
    wechatRefund,
    addWechatRefund
}