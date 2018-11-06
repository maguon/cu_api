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
const parser = require('parser');
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
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getPayment' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
const wechatPayment = (req,res,next)=>{
    let params = req.params;
    let signStr = "appid="+sysConfig.wechatConfig.mpAppId+"&attach=test&body=test&mch_id="+sysConfig.wechatConfig.mchId
        + "&nonce_str="+oAuthUtil.randomString+"&notify_url="+sysConfig.wechatConfig.notifyUrl+"&openid="+params.openid
        + "&out_trade_no="+params.orderId+"&spbill_create_ip="+req.connection.remoteAddress+"&total_fee=" +params.totalFee
        + "&trade_type=JSAPI&key="+sysConfig.wechatConfig.paymentKey;
    let signByMd = encrypt.encryptByMd5NoKey(signStr);
    let reqBody = '<xml><appid>'+sysConfig.wechatConfig.mpAppId+'</appid><attach>'+'test'+'</attach><body>test</body>'
        +'<mch_id>'+sysConfig.wechatConfig.mchId+'</mch_id><nonce_str>'+oAuthUtil.randomString+'</nonce_str>' +
        '<notify_url>'+sysConfig.wechatConfig.notifyUrl+'</notify_url><openid>'+params.openid+'</openid>' +
        '<out_trade_no>'+params.orderId+'</out_trade_no><spbill_create_ip>'+req.connection.remoteAddress+'</spbill_create_ip><total_fee>'+params.totalFee+'</total_fee>' +
        '<trade_type>JSAPI</trade_type><sign>'+signByMd+'</sign></xml>';
    let url="/pay/unifiedorder";
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
            let resObj = JSON.parse(parser.toJson(data));
            console.log(resObj);
            console.log(data);
            let resParams = {};
            resParams.prepayId = resObj.xml.prepay_id;
            resParams.nonceStr = sysConfig.wechatConfig.notifyUrl;
            resParams.appId = sysConfig.wechatConfig.mpAppId;
            let resTimestamp = (new Date()).getTime();
            resParams.timeStamp = parseInt(resTimestamp/1000);
            let paySignStr = "appId="+sysConfig.wechatConfig.mpAppId+"&nonceStr="+sysConfig.wechatConfig.notifyUrl+"&package=prepay_id="+resParams.prepayId+
                "&signType=MD5&timeStamp="+resParams.timeStamp+"&key="+sysConfig.wechatConfig.mpSecret;
            console.log(paySignStr);
            resParams.sign = encrypt.encryptByMd5NoKey(paySignStr);
            logger.info('wechatPayment '+resParams);

            res.send(200,resParams);
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
const addWechatPayment=(req,res,next) => {

}
module.exports = {
    addPayment,
    getPayment,
    wechatPayment,
    addWechatPayment
}