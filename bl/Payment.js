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
const xml2js = require('xml2js');
const oAuthUtil = require('../util/OAuthUtil.js');
const fs = require('fs');

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
    let xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true});
    let body = 'test';
    let jsa = 'JSAPI';
    let params = req.params;
    let ourString = encrypt.randomString();
    params.nonceStr = ourString;
    paymentDAO.getPayment({orderId:params.orderId},(error,rows)=>{
        if(error){
            logger.error('getPayment' + error.message);
            resUtil.resInternalError(error, res, next);
        }else if(rows && rows > 0){
            logger.warn('getPayment' + '已经生成支付信息');
            resUtil.resetFailedRes(res,'已经生成支付信息',null);
        }else{
            paymentDAO.addWechatPayment(params,(error,result)=>{
                if(error){
                    logger.error('addWechatPayment' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else{
                    logger.info('addWechatPayment' + 'success');
                }
            });
        }
    })
    let requestIp = req.connection.remoteAddress.replace('::ffff:','');
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
                let myDateStr = myDate.getTime()/1000;
                let parseIntDate = parseInt(myDateStr);
                let paySignMD5 = encrypt.encryptByMd5NoKey('appId='+sysConfig.wechatConfig.mpAppId+'&nonceStr='+evalJson.xml.nonce_str+'&package=prepay_id='+evalJson.xml.prepay_id+'&signType=MD5&timeStamp='+parseIntDate+'&key=a7c5c6cd22d89a3eea6c739a1a3c74d1');
                let paymentJson = [{
                    nonce_str: evalJson.xml.nonce_str,
                    prepay_id: evalJson.xml.prepay_id,
                    sign:evalJson.xml.sign,
                    timeStamp: parseIntDate,
                    paySign: paySignMD5
                }];
                logger.info("paymentResult"+resString);
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
    let params = req.params;
    let ourString = encrypt.randomString();
    params.nonceStr = ourString;
    let xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true});
    let refundUrl = 'https://stg.myxxjs.com/api/wechatRefund';
    paymentDAO.getPayment({orderId:params.orderId},(error,rows)=>{
        if(error){
            logger.error('getPayment' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('getPayment' + 'success');
            params.totalFee = rows[0].total_fee;
            params.type = 0;
            params.paymentId = rows[0].id;
            paymentDAO.addWechatRefund(params,(error,result)=>{
                if(error){
                    logger.error('addWechatRefund' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else{
                    logger.info('addWechatRefund '+'success');
                    params.refundId = result.insertId;
                    let signStr =
                        "appid="+sysConfig.wechatConfig.mpAppId
                        + "&mch_id="+sysConfig.wechatConfig.mchId
                        + "&nonce_str="+params.nonceStr
                        + "&notify_url="+refundUrl
                        //+ "&openid="+params.openid
                        + "&out_refund_no="+params.refundId
                        + "&out_trade_no="+params.orderId
                        + "&refund_fee="+params.refundFee
                        + "&total_fee=" +params.totalFee
                        + "&key="+sysConfig.wechatConfig.paymentKey;
                    let signByMd = encrypt.encryptByMd5NoKey(signStr);
                    let reqBody =
                        '<xml><appid>'+sysConfig.wechatConfig.mpAppId+'</appid>' +
                        '<mch_id>'+sysConfig.wechatConfig.mchId+'</mch_id>' +
                        '<nonce_str>'+params.nonceStr+'</nonce_str>' +
                        '<notify_url>'+refundUrl+'</notify_url>' +
                        //'<openid>'+params.openid+'</openid>' +
                        '<out_refund_no>'+params.refundId+'</out_refund_no>' +
                        '<out_trade_no>'+params.orderId+'</out_trade_no>' +
                        '<refund_fee>'+params.refundFee+'</refund_fee>' +
                        '<total_fee>'+params.totalFee+'</total_fee>' +
                        '<sign>'+signByMd+'</sign></xml>';
                    let url="/secapi/pay/refund";
                    let certFile = fs.readFileSync(sysConfig.wechatConfig.paymentCert);
                    let options = {
                        host: 'api.mch.weixin.qq.com',
                        port: 443,
                        path: url,
                        method: 'POST',
                        pfx: certFile ,
                        passphrase : sysConfig.wechatConfig.mchId,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Content-Length' : Buffer.byteLength(reqBody, 'utf8')
                        }
                    }
                    let httpsReq = https.request(options,(result)=>{
                        let data = "";
                        logger.info(result);
                        result.on('data',(d)=>{
                            data += d;
                        }).on('end',()=>{
                            xmlParser.parseString(data,(err,result)=>{
                                let resString = JSON.stringify(result);
                                let evalJson = eval('(' + resString + ')');
                                logger.info("paymentResult2"+resString);
                                resUtil.resetQueryRes(res,evalJson.xml,null);
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
            })
        }
    })
};
const addWechatPayment=(req,res,next) => {
    let xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true});
    logger.info("notifyUrlReq");
    logger.info(req);
    logger.info("notifyUrlReqBodyRefund1");
    xmlParser.parseString(req.body,(err,result)=>{
        let resString = JSON.stringify(result);
        let evalJson = eval('(' + resString + ')');
        let prepayIdJson = {
            nonceStr: evalJson.xml.nonce_str,
            openid: evalJson.xml.openid,
            orderId: evalJson.xml.out_trade_no,
            timeEnd: evalJson.xml.time_end,
            transactionId: evalJson.xml.transaction_id,
            status: 1,
            type:1
        };
        paymentDAO.getPayment({orderId:prepayIdJson.orderId},(error,rows)=>{
            if(error){
                logger.error('getPayment' + error.message);
                resUtil.resInternalError(error, res, next);
            }else if(rows && rows.length < 1){
                logger.warn('addWechatPayment' + '没有此支付信息');
                resUtil.resetFailedRes(res,'没有此支付信息',null);
            }else{
                logger.info("paymentResult1"+resString);
                prepayIdJson.paymentId = rows[0].id;
                paymentDAO.updateWechatPayment(prepayIdJson,(error,result)=>{
                    if(error){
                        logger.error('updateWechatPayment' + error.message);
                        resUtil.resInternalError(error, res, next);
                    }else{
                        logger.info('updateWechatPayment' + 'success');
                        resUtil.resetCreateRes(res,result,null);
                        return next();
                    }
                });
            }
        })
    });
}
const addWechatRefund=(req,res,next) => {
    let reqInfo = 'b7eSPFu4bjo0gTtKBk9o7pi8lOnAen/rNPyXIGq/aHyKDcLCaL2wHSnIcaZNNGohmvW3aJQbn6jk2nvtQibiA7tUvCBQqzvMlrGY41LS1w6qN/jCVflmZzrGGKhqa9nq7v4SKkkHWhOikdwoCjW8mkvZuYLwXXxO86H/G/iAe6ngb7DfufKro+y6vAQNcR/3r+2JYDt6zJ6YfrJIKTPxLEF2Ga788zquNNZFAH3tPK6e8HLQsJYPUWS8o3TrZs4Ii5nXIzHAMcG+W0iqapTcipknGT7gWk+UvqPOL/6gcggcXd6nJfxw0iedIrgWLVDU+9fTwzuZbH3QrVNLGRh36Eu+bXKtjuTHFzS9J5Hx3XVG+VbLfKdFrLFA0zGkJBz6sRo6CLp7wQCOJzQh1PRShHUlYWJA+5eAaAezuCzKPaO0qiScT+Peelf8PeXDjauIzPsWDoXIGM5DTJVDiadh/OipSWr5VFbiICgJoafInd7b1cERD/UIDm/lWl70WSzaFn9fwr1UOBYMUTi+TWCh1B9RYp98N9Gp5+x37rsgtWaBhcK0aCLI8S+DM4k7RMO5wLu1UbmkdonPXiv8ul5NPaeefSlJ3bQizO314Bc3cjFWXI7EwpRyKwSkUPHWsvSv7EV5HIgcgZX7/FFFEqz762NUGLZNY6K3/maKKSSrqBgtGHshHB2h+kERn7AoDWJlxTF6OCI8Rn9P3iKcqa/f1SYm2KoR3pEvQToJpa+Ig9aVi0fbrRl+XYM/LN2J2x/qJd+0a2J/EgQjDI8qLvB7yWwNutvi6zCynGCC40RF2L8GpDu59hlhYhtka0V/6lpaH9ob2Yt+LBFtYEbL0M4qmNU7IGNeTDR65Vm1SPL5LT1C2zOhBZjq6YEJ8Ume8J4Y/GieuBjlbsyVZ2s4G5xl4LXSfWIXMaERSGqQPBUJcE0i7O5uWj5YyoMbZYvgDCW8D7ZEmjfZKjRG2PKS1eLFYcilG7l6eIPh9y6k2PNRL1HCGpJLIW40VQno5giI/7d5';
    //let reqKey = encrypt.encryptByMd5NoKey(sysConfig.wechatConfig.paymentKey);
    let reqInfoKey = encrypt.decryptByACE(reqInfo,sysConfig.wechatConfig.paymentKey);
    // logger.info("reqInfoKeyRow");
    // logger.info(reqInfo);
    logger.info("reqInfoKeyResult");
    logger.info(reqInfoKey);
    let xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true});
    xmlParser.parseString(req.body,(err,result)=>{
        let resString = JSON.stringify(result);
        let evalJson = eval('(' + resString + ')');
        let prepayIdJson = {
            nonceStr: evalJson.xml.nonce_str,
            transactionId: 2,
            status: 1
        };
        logger.info("notifyUrlReqBodyRefund4" +resString);
        let reqInfo = encrypt.base64Decode('b7eSPFu4bjo0gTtKBk9o7pi8lOnAen/rNPyXIGq/aHyKDcLCaL2wHSnIcaZNNGohmvW3aJQbn6jk2nvtQibiA7tUvCBQqzvMlrGY41LS1w6qN/jCVflmZzrGGKhqa9nq7v4SKkkHWhOikdwoCjW8mkvZuYLwXXxO86H/G/iAe6ngb7DfufKro+y6vAQNcR/3r+2JYDt6zJ6YfrJIKTPxLEF2Ga788zquNNZFAH3tPK6e8HLQsJYPUWS8o3TrZs4Ii5nXIzHAMcG+W0iqapTcipknGT7gWk+UvqPOL/6gcggcXd6nJfxw0iedIrgWLVDU+9fTwzuZbH3QrVNLGRh36Eu+bXKtjuTHFzS9J5Hx3XVG+VbLfKdFrLFA0zGkJBz6sRo6CLp7wQCOJzQh1PRShHUlYWJA+5eAaAezuCzKPaO0qiScT+Peelf8PeXDjauIzPsWDoXIGM5DTJVDiadh/OipSWr5VFbiICgJoafInd7b1cERD/UIDm/lWl70WSzaFn9fwr1UOBYMUTi+TWCh1B9RYp98N9Gp5+x37rsgtWaBhcK0aCLI8S+DM4k7RMO5wLu1UbmkdonPXiv8ul5NPaeefSlJ3bQizO314Bc3cjFWXI7EwpRyKwSkUPHWsvSv7EV5HIgcgZX7/FFFEqz762NUGLZNY6K3/maKKSSrqBgtGHshHB2h+kERn7AoDWJlxTF6OCI8Rn9P3iKcqa/f1SYm2KoR3pEvQToJpa+Ig9aVi0fbrRl+XYM/LN2J2x/qJd+0a2J/EgQjDI8qLvB7yWwNutvi6zCynGCC40RF2L8GpDu59hlhYhtka0V/6lpaH9ob2Yt+LBFtYEbL0M4qmNU7IGNeTDR65Vm1SPL5LT1C2zOhBZjq6YEJ8Ume8J4Y/GieuBjlbsyVZ2s4G5xl4LXSfWIXMaERSGqQPBUJcE0i7O5uWj5YyoMbZYvgDCW8D7ZEmjfZKjRG2PKS1eLFYcilG7l6eIPh9y6k2PNRL1HCGpJLIW40VQno5giI/7d5');
        let reqInfoKey = encrypt.decryptByACE(reqInfo,sysConfig.wechatConfig.paymentKey);
            logger.info("reqInfoKeyRow"+ reqInfo);
        logger.info("reqInfoKeyResult"+ reqInfoKey);
        paymentDAO.updateRefund(prepayIdJson,(error,result)=>{
            if(error){
                logger.error('updateRefund' + error.message);
                resUtil.resInternalError(error, res, next);
            }else{
                logger.info("notifyUrlReqBodyRefund4" +resString);
                logger.info('updateRefund' + 'success');
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        });
    });
}
const updateRefund=(req,res,next) => {
    let params = req.params;
    paymentDAO.updateRefund(params,(error,result)=>{
        if(error){
            logger.error('updateRefund' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateRefund' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const getRefundByPaymentId=(req,res,next) => {
    let params = req.params;
    paymentDAO.getPayment(params,(error,rows)=>{
        if(error){
            logger.error('getPayment' + error.message);
            resUtil.resInternalError(error, res, next);
        }else if(rows[0].type && rows[0].type==1){
            paymentDAO.getRefundByPaymentId(params,(error,result)=>{
                if(error){
                    logger.error('getRefundByPaymentId' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else{
                    logger.info('getRefundByPaymentId' + 'success');
                    resUtil.resetQueryRes(res,result,null);
                    return next();
                }
            });
        }else{
            paymentDAO.getPayment(params,(error,rows)=>{
                if(error){
                    logger.error('getPayment' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else{
                    params.pId = rows[0].p_id;
                    paymentDAO.getPaymentByRefundId(params,(error,result)=>{
                        if(error){
                            logger.error('getPaymentByRefundId' + error.message);
                            resUtil.resInternalError(error, res, next);
                        }else{
                            logger.info('getPaymentByRefundId' + 'success');
                            resUtil.resetQueryRes(res,result,null);
                            return next();
                        }
                    })
                }
            })
        }
    })
}
module.exports = {
    addPayment,
    getPayment,
    wechatPayment,
    addWechatPayment,
    wechatRefund,
    addWechatRefund,
    updateRefund,
    getRefundByPaymentId
}