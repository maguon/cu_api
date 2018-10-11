const path = require('path');
const restify = require('restify');

const serverLogger = require('./util/ServerLogger');
const logger = serverLogger.createLogger('Server');
const police = require('./bl/Police.js');
const car = require('./bl/Car.js');
const user = require('./bl/User.js');
const userCar = require('./bl/UserCar.js');
const userMessage = require('./bl/UserMessage.js');


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
    /**
     police_info
     */
    server.post({path:'/api/police',contentType: 'application/json'},police.createPolice);
    server.post({path:'/api/policeLogin',contentType: 'application/json'},police.policeLogin);
    server.get('/api/police/:policeId',police.queryPolice);
    server.put({path:'/api/police/:policeId',contentType: 'application/json'},police.updatePoliceInfo);
    server.put({path:'/api/police/:policeId/password',contentType: 'application/json'},police.changePolicePassword);
    /**
     check_car_detail
     */
    server.get('/api/car',car.queryCarInfo);
    server.put({path:'/api/car/:carId/status',contentType: 'application/json'},car.updateStatus);
    server.post({path:'/api/police/:policeId/addCar',contentType: 'application/json'},car.addCar);
    server.get('/api/police/:policeId/yMonth',car.queryCarNumByDate);
    server.get('/api/police/:policeId/yMonthDay',car.queryCarInfoByDate);
    server.get('/api/police/:policeId/todayCar/:yMonthDay',car.queryCarInfoByToday);
    /**
     user_info
     */
    server.get('/api/user/:userId/queryUser',user.queryUser);
    //server.post({path:'/api/wechatLogin',contentType: 'application/json'},user.userLogin);
    server.post({path:'/api/userLogin',contentType: 'application/json'},user.userLogin);
    server.put({path:'/api/user/:userId/updateUser',contentType: 'application/json'},user.updateUser);
    server.put({path:'/api/user/:userId/password',contentType: 'application/json'},user.updatePassword);
    server.put({path:'/api/admin/:adminId/user/:userId/wechatStatus/:wechatStatus',contentType: 'application/json'},user.updateStatus);
    server.put({path:'/api/user/:userId/phone/:phone',contentType: 'application/json'},user.updatePhone);
    /**
     user_car
     */
    server.get('/api/user/:userId/queryUserCar',userCar.queryUserCar);
    server.get('/api/user/:userId/queryUserCar/:userCarId/userCar',userCar.queryUserCar);
    server.put({path:'/api/userCar/:userCarId/updatePaperRemark',contentType: 'application/json'},userCar.updatePaperRemark);
    server.post({path:'/api/user/:userId/addUserCar',contentType: 'application/json'},userCar.addUserCar);
    server.del({path:'/api/user/:userId/userCar/:userCarId',contentType: 'application/json'},userCar.delUserCar)

    /**
     user_car
     */
    server.post({path:'/api/user/:userId/addMessage',contentType: 'application/json'},userMessage.addMessage);
    server.get('/api/user/:userId/getMessage',userMessage.getMessage);
    server.get('/api/user/:userId/getMessage/:userMessageId/getMessage',userMessage.getMessage);


    server.on('NotFound', function (req, res ,next) {
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