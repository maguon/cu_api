const path = require('path');
const restify = require('restify');

const serverLogger = require('./util/ServerLogger');
const logger = serverLogger.createLogger('Server');
const supervise = require('./bl/Supervise.js');
const checkCar = require('./bl/CheckCar.js');
const user = require('./bl/User.js');
const userCar = require('./bl/UserCar.js');
const userMessage = require('./bl/UserMessage.js');
const app = require('./bl/App.js');
const userDevice = require('./bl/UserDevice.js');
const superviseDevice = require('./bl/SuperviseDevice.js');
const sms = require('./bl/Sms.js');
const adminUser = require('./bl/AdminUser.js');
const userShipAddress = require('./bl/UserShipAddress.js');
const order = require('./bl/Order.js');
const wechatBl = require('./bl/WechatBl.js');
const oauth = require('./bl/OAuth.js');
const qrCode = require('./bl/QrCode.js');
const product = require('./bl/Product.js');
const log = require('./bl/Log.js');
const orderFeedback = require('./bl/OrderFeedback.js');
const payment = require('./bl/Payment.js');
const logCompany = require('./bl/LogCompany.js');
const sysRecord = require('./bl/SysRecord.js');

/**
 * Returns a server with all routes defined on it
 */
function createServer() {



    // Create a server with our logger and custom formatter
    // Note that 'version' means all routes will default to
    // 1.0.0
    const server = restify.createServer({

        name: 'LOG-MP-API',
        version: '0.0.1'
    });

    server.pre(restify.pre.sanitizePath());
    server.pre(restify.pre.userAgentConnection());

    server.use(restify.plugins.throttle({
        burst: 100,
        rate: 50,
        ip: true
    }));





    server.use(restify.plugins.bodyParser({uploadDir:__dirname+'/../uploads/'}));
    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.dateParser());
    server.use(restify.plugins.authorizationParser());
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.gzipResponse());
    server.use(oauth.transferToken());


    restify.CORS.ALLOW_HEADERS.push('auth-token');
    restify.CORS.ALLOW_HEADERS.push('user-name');
    restify.CORS.ALLOW_HEADERS.push('user-type');
    restify.CORS.ALLOW_HEADERS.push('user-id');
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Origin");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Credentials");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","GET");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","POST");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","PUT");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","DELETE");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Headers","accept,api-version, content-length, content-md5,x-requested-with,content-type, date, request-id, response-time");
    server.use(restify.CORS());
    var STATIS_FILE_RE = /\.(css|js|jpe?g|png|gif|less|eot|svg|bmp|tiff|ttf|otf|woff|pdf|ico|json|wav|ogg|mp3?|xml|woff2|map)$/i;
    server.get(STATIS_FILE_RE, restify.serveStatic({ directory: './public/docs', default: 'index.html', maxAge: 0 }));



    server.get(/\.html$/i,restify.serveStatic({
        directory: './public/docs',
        maxAge: 0}));
    server.get(/\.html\?/i,restify.serveStatic({
        directory: './public/docs',
        maxAge: 0}));

    server.get('/',restify.serveStatic({
        directory: './public/docs',
        default: 'index.html',
        maxAge: 0
    }));


    server.get('/api/wechat/:code/openid',wechatBl.getUserIdByCode);
    server.get('/api/wechat/:accessToken/openid/:openid',wechatBl.getUserInfoById);
    /**
     * Admin User Module
     */
    server.get('/api/admin/:adminId' ,adminUser.getAdminUserInfo);
    server.get('/api/admin/:adminId/userStat' ,adminUser.getUserStat);
    server.get('/api/admin/:adminId/userCarStat' ,adminUser.getUserCarStat);
    server.get('/api/admin/:adminId/superviseStat' ,adminUser.getSuperviseStat);
    server.get('/api/admin/:adminId/checkCarStatByMonth' ,adminUser.getCheckCarStatByMonth);
    server.get('/api/admin/:adminId/orderStatByMonth' ,adminUser.getOrderStatByMonth);
    server.get('/api/admin/:adminId/logStatByMonth' ,adminUser.getLogStatByMonth);
    server.get('/api/admin/:adminId/orderFeedbackStatByMonth' ,adminUser.getOrderFeedbackStatByMonth);
    server.get('/api/admin/:adminId/paymentFeeByMonth' ,adminUser.getPaymentFeeByMonth);
    server.post({path:'/api/adminLogin',contentType: 'application/json'},adminUser.adminUserLogin);
    server.put({path:'/api/admin/:adminId',contentType: 'application/json'} ,adminUser.updateAdminInfo);
    server.put({path:'/api/admin/:adminId/password',contentType: 'application/json'} ,adminUser.changeAdminPassword);

    /**
     supervise_info
     */
    server.post({path:'/api/admin/:adminId/supervise',contentType: 'application/json'},supervise.createSupervise);
    server.post({path:'/api/superviseLogin',contentType: 'application/json'},supervise.superviseLogin);
    server.get('/api/supervise',supervise.querySupervise);
    server.get('/api/admin/:adminId/supervise',supervise.querySupervise);
    server.put({path:'/api/admin/:adminId/supervise/:superviseId/status/:status',contentType: 'application/json'},supervise.updateSuperviseStatus);
    server.put({path:'/api/supervise/:superviseId/avatarImage/:avatarImage',contentType: 'application/json'},supervise.updateSuperviseImg);
    server.put({path:'/api/admin/:adminId/supervise/:superviseId',contentType: 'application/json'},supervise.updateSuperviseInfo);
    server.put({path:'/api/supervise/:superviseId/password',contentType: 'application/json'},supervise.changeSupervisePassword);
    server.put({path:'/api/supervise/:superviseId/phone',contentType: 'application/json'},supervise.changeSupervisePhone);
    //手机发送验证码
    //server.post({path:'/api/superviseLogin' ,contentType: 'application/json'}, supervise.superviseLogin);
    server.put({path:'/api/phone/:phone/supervisePassword',contentType: 'application/json'},supervise.changeSupervisePasswordByPhone);
    server.get('/api/supervise/:superviseId/token/:token' , supervise.changeSuperviseToken);
    /**
     check_car_info
     */
    server.get('/api/admin/:adminId/checkCar',checkCar.queryCheckCar);
    server.put({path:'/api/supervise/:superviseId/checkCar/:checkCarId/status/:status',contentType: 'application/json'},checkCar.updateStatus);
    server.post({path:'/api/supervise/:superviseId/checkCar',contentType: 'application/json'},checkCar.addCheckCar,sysRecord.saveCheckRecord);
    //发送消息
    server.get('/api/supervise/:superviseId/monthStat',checkCar.queryCarByMonth);
    server.get('/api/supervise/:superviseId/checkCar',checkCar.queryCheckCar);
    server.get('/api/supervise/:superviseId/dayStat',checkCar.queryCarNumByDay);
    /**
     user_info
     */
    server.get('/api/user',user.queryUser);
    server.get('/api/admin/:adminId/user',user.queryUser);
    server.get('/api/admin/:adminId/userStatByDay',user.getUserStatByDay);
    server.get('/api/admin/:adminId/userStatByMonth',user.getUserStatByMonth);
    //server.post({path:'/api/wechatLogin',contentType: 'application/json'},user.userLogin);
    server.post({path:'/api/userLogin',contentType: 'application/json'},user.userLogin);
    server.put({path:'/api/user/:userId',contentType: 'application/json'},user.updateUser);
    server.put({path:'/api/user/:userId/password',contentType: 'application/json'},user.updatePassword);
    server.put({path:'/api/user/:userId/wechatStatus/:wechatStatus',contentType: 'application/json'},user.updateStatus);
    server.put({path:'/api/user/:userId/authStatus/:authStatus',contentType: 'application/json'},user.updateType);
    server.put({path:'/api/user/:userId/userPhone',contentType: 'application/json'},user.updatePhone);
    /**
     user_ship_address
     */
    server.get('/api/user/:userId/userShipAddress',userShipAddress.getUserShipAddress);
    server.get('/api/admin/:adminId/userShipAddress',userShipAddress.getUserShipAddress);
    server.post({path:'/api/user/:userId/userShipAddress',contentType: 'application/json'},userShipAddress.addUserShipAddress);
    server.put({path:'/api/user/:userId/shipAddress/:shipAddressId/default',contentType: 'application/json'},userShipAddress.updateUserShipAddress);
    server.put({path:'/api/user/:userId/shipAddress/:shipAddressId/info',contentType: 'application/json'},userShipAddress.updateUserShip);
    server.del({path:'/api/user/:userId/shipAddress/:shipAddressId',contentType: 'application/json'},userShipAddress.deleteUserShipAddress);
    /**
     user_car
     */
    server.get('/api/user/:userId/userCar',userCar.queryUserCar);
    server.get('/api/admin/:adminId/userCar',userCar.queryUserCar);
    //server.put({path:'/api/userCar/:userCarId/updatePaperRemark',contentType: 'application/json'},userCar.updatePaperRemark);
    server.post({path:'/api/user/:userId/userCar',contentType: 'application/json'},userCar.addUserCar);
    server.del({path:'/api/user/:userId/userCar/:userCarId',contentType: 'application/json'},userCar.delUserCar);
    server.put({path:'/api/user/:userId/userCar/:userCarId',contentType: 'application/json'},userCar.updateUserCar);

    /**
     user_message
     */
    server.post({path:'/api/supervise/:superviseId/user/:userId/car/:carId/message',contentType: 'application/json'},userMessage.addMessage);
    server.get('/api/user/:userId/getMessage',userMessage.getMessage);
    server.get('/api/admin/:adminId/getMessage',userMessage.getMessage);
    server.get('/api/user/:userId/msgStat',userMessage.queryUserMessageNumById);
    server.get('/api/admin/:adminId/msgStatByDay',userMessage.getUserMessageStatByDay);
    server.get('/api/admin/:adminId/msgStatByMonth',userMessage.getUserMessageStatByMonth);
    server.put({path:'/api/user/:userId/msg/:msgId/status/:status',contentType: 'application/json'},userMessage.updateUserMessageStatus);
    /**
     order_info
     */
    server.post({path:'/api/user/:userId/order',contentType: 'application/json'},order.addOrder);
    server.get('/api/user/:userId/order',order.getOrder);
    server.get('/api/admin/:adminId/order',order.getOrder);
    server.get('/api/user/:userId/orderItem',order.getOrderItem);
    server.get('/api/admin/:adminId/orderItem',order.getOrderItem);
    server.post({path:'/api/user/:userId/order/:orderId/product/:productId/car/:carId/orderItem',contentType: 'application/json'},order.addOrderItem);
    server.put({path:'/api/user/:userId/order/:orderId/orderInfo',contentType: 'application/json'},order.updateOrderPrice);
    server.del('/api/user/:userId/orderItem/:orderItemId',order.delOrderItem);
    server.put({path:'/api/user/:userId/order/:orderId/status/:status',contentType: 'application/json'},order.updateOrderStatus);
    server.put({path:'/api/user/:userId/order/:orderId/logStatus/:logStatus',contentType: 'application/json'},order.updateOrderLogStatus);
    server.put({path:'/api/user/:userId/order/:orderId/paymentStatus/:paymentStatus',contentType: 'application/json'},order.updateOrderPaymengStatus);
    /**
     log_info物流
     */
    server.post({path:'/api/admin/:adminId/log',contentType: 'application/json'},log.addLog);
    server.get('/api/user/:userId/log',log.getLog);
    server.get('/api/admin/:adminId/log',log.getLog);
    server.put({path:'/api/admin/:adminId/log/:logId/logInfo',contentType: 'application/json'},log.updateLog);

    /**
     order_feedback售后
     */
    server.post({path:'/api/user/:userId/order/:orderId/orderFeedback',contentType: 'application/json'},orderFeedback.addOrderFeedback);
    server.get('/api/user/:userId/orderFeedback',orderFeedback.getOrderFeedback);
    server.get('/api/admin/:adminId/orderFeedback',orderFeedback.getOrderFeedback);
    server.put({path:'/api/admin/:adminId/order/:orderId/orderFeedback/:orderFeedbackId/orderFeedbackPayment',contentType: 'application/json'},orderFeedback.updateOrderFeedbackPayment);
    server.put({path:'/api/admin/:adminId/order/:orderId/orderFeedback/:orderFeedbackId/orderFeedbackCount',contentType: 'application/json'},orderFeedback.updateOrderFeedbackCount);
    server.put({path:'/api/admin/:adminId/order/:orderId/orderFeedback/:orderFeedbackId/orderFeedbackRemark',contentType: 'application/json'},orderFeedback.updateOrderFeedbackRemark);
    server.put({path:'/api/admin/:adminId/order/:orderId/orderFeedback/:orderFeedbackId/orderFeedbackStatus',contentType: 'application/json'},orderFeedback.updateOrderFeedbackStatus);

    /**
     * App Module
     */
    server.get('/api/app',app.queryApp);
    server.post({path:'/api/user/:userId/app',contentType: 'application/json'},app.createAppVersion);
    server.put({path:'/api/user/:userId/app/:appId',contentType: 'application/json'} ,app.updateAppVersion);
    /**
     * SuperviseDevice Module
     */
    server.get('/api/superviseDevice' ,superviseDevice.querySuperviseDevice);
    server.post({path:'/api/supervise/:superviseId/superviseDevice',contentType: 'application/json'} , superviseDevice.createSuperviseDevice);
    server.del('/api/supervise/:superviseId/deviceToken/:deviceToken' , superviseDevice.removeSuperviseDevice);
    /**
     * UserDevice Module
     */
    server.get('/api/userDevice' ,userDevice.queryUserDevice);
    server.post({path:'/api/user/:userId/userDevice',contentType: 'application/json'} , userDevice.createUserDevice);
    server.del('/api/user/:userId/deviceToken/:deviceToken' , userDevice.removeUserDevice);
    /**
     * sendPswdSms
     */
    server.post({path:'/api/user/:userId/phone/:phone/userPhoneSms',contentType: 'application/json'},sms.sendUserSms);
    server.post({path:'/api/phone/:phone/supervisePswdSms',contentType: 'application/json'},sms.sendSupervisePswdSms);
    server.post({path:'/api/supervise/:superviseId/phone/:phone/supervisePhoneSms',contentType: 'application/json'},sms.sendSupervisePhoneSms);
    server.post({path:'/api/user/:userId/message',contentType: 'application/json'},sms.sendMessage);
    /**
     * QRcode
     */
    server.get('/api/qrCode/:qrCode' ,qrCode.getQrCode);
    server.post({path:'/api/user/:userId/userCar/:userCarId/qrCode',contentType: 'application/json'},qrCode.createQrCode);
    /**
     * Product_info
     */
    server.get('/api/user/:userId/product' ,product.getProduct);
    server.get('/api/admin/:adminId/product' ,product.getProduct);
    server.post({path:'/api/admin/:adminId/product',contentType: 'application/json'},product.addProduct);
    server.put({path:'/api/admin/:adminId/product/:productId/status',contentType: 'application/json'},product.updateStatus);
    server.put({path:'/api/admin/:adminId/product/:productId/productInfo',contentType: 'application/json'},product.updateProductInfo);
    server.put({path:'/api/admin/:adminId/product/:productId/productImg',contentType: 'application/json'},product.updateImg);
    server.put({path:'/api/admin/:adminId/product/:productId/productRemark',contentType: 'application/json'},product.updateProductRemark);
    /**
     * payment_info
     */
    server.get('/api/user/:userId/payment' ,payment.getPayment);
    server.get('/api/admin/:adminId/payment' ,payment.getPayment);
    server.get('/api/admin/:adminId/paymentRefund' ,payment.getRefundByPaymentId);
    server.post({path:'/api/user/:userId/order/:orderId/wechatPayment',contentType: 'application/json'},payment.wechatPayment);
    //server.post({path:'/api/wechatPayment',contentType: 'application/x-www-form-urlencoded'},payment.addWechatPayment);
    //server.post({path:'/api/wechatPayment',contentType: 'application/xml'},payment.addWechatPayment);
    server.post({path:'/api/wechatPayment',contentType: 'text/xml'},payment.addWechatPayment);
    //server.post({path:'/api/wechatPayment',contentType: 'application/json'},payment.addWechatPayment);
    //server.get('/api/wechatPayment',payment.addWechatPayment);
    //server.post({path:'/api/wechatPayment',contentType: 'multipart/form-data'},payment.addWechatPayment);
    //server.post({path:'/api/user/:userId/payment/:paymentId/refund',contentType: 'application/json'},payment.addWechatRefund);
    server.post({path:'/api/admin/:adminId/user/:userId/order/:orderId/wechatRefund',contentType: 'application/json'},payment.wechatRefund);
    server.post({path:'/api/wechatRefund',contentType: 'text/xml'},payment.addWechatRefund);

    /**
     * log_company
     */
    server.get('/api/user/:userId/logCompany' ,logCompany.getLogCompany);
    server.get('/api/admin/:adminId/logCompany' ,logCompany.getLogCompany);
    server.post({path:'/api/admin/:adminId/logCompany',contentType: 'application/json'},logCompany.addLogCompany);
    server.put({path:'/api/admin/:adminId/logCompany/:logCompanyId/logCompanyInfo',contentType: 'application/json'},logCompany.updateLogCompany);

    server.on('NotFound',(req, res ,next)=>{
        logger.warn(req.url + " not found");
        res.send(404,{success:false,msg:" service not found !"});
        next();
    });
    return (server);

}



///--- Exports

module.exports = {
    createServer
};