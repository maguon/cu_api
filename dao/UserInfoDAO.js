'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('UserDAO.js');
const db = require('../db/connection/MysqlDb.js');

const queryUser = (params,callback) => {
    let query = "select id,num,wechat_id,user_name,wechat_name,avatar_image,gender,phone,birth,wechat_status,auth_status,auth_time,last_login_on,created_on,updated_on from user_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and id = ? ";
    }
    if(params.wechatName){
        query = query + " and wechat_name like '%"+params.wechatName+"%'";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and phone = ? "
    }
    if(params.wechatId){
        paramsArray[i++] = params.wechatId;
        query = query + " and wechat_id = ? "
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and user_name = ? "
    }
    if(params.gender){
        paramsArray[i++] = params.gender;
        query = query + " and gender = ? "
    }
    if(params.authStartTime){
        paramsArray[i++] = params.authStartTime+" 00:00:00";
        query = query + " and auth_time >= ? "
    }
    if(params.authEndTime){
        paramsArray[i++] = params.authEndTime+" 23:59:59";
        query = query + " and auth_time <= ? "
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart+" 00:00:00";
        query = query + " and created_on >= ? "
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd+" 23:59:59";
        query = query + " and created_on <= ? "
    }
    if(params.wechatStatus){
        paramsArray[i++] = params.wechatStatus;
        query = query + " and wechat_status = ? "
    }
    if(params.authStatus){
        paramsArray[i++] = params.authStatus;
        query = query + " and auth_status = ? "
    }
    if(params.start&&params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?, ? "
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('queryUser');
        callback(error,rows);
    })
}
const createUser = (params,callback)=>{
    let query = "insert into user_info (auth_time,user_name,date_id,wechat_name,wechat_id,gender,avatar_image) values(?,?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++]=params.authTime;
    paramsArray[i++]=params.wechatName;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.wechatName;
    paramsArray[i++]=params.wechatId;
    paramsArray[i++]=params.gender;
    paramsArray[i]=params.avatarImage;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('createUser');
        callback(error,rows);
    });
}
const updateUser=(params,callback)=>{
    let query = "update user_info set user_name=? ,gender=? ,birth=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userName;
    paramsArray[i++] = params.gender;
    paramsArray[i++] = params.birth;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateUser');
        callback(error,rows);
    });
}
const lastLoginOn=(params,callback)=>{
    let query = "update user_info set last_login_on = ? where wechat_id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.lastLoginOn;
    paramsArray[i] = params.wechatId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('lastLoginOn');
        callback(error,rows);
    });
}
const updatePassword=(params,callback)=>{
    let query = "update user_info set password = ? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.newPassword;
    paramsArray[i++] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updatePassword');
        callback(error,rows);
    });
};
const updatePhone=(params,callback)=>{
    let query = "update user_info set phone = ?,auth_status = ?,auth_time=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.phone;
    paramsArray[i++] = params.authStatus;
    paramsArray[i++] = params.myDate;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updatePhone');
        callback(error,rows);
    });
}
const updateStatus=(params,callback)=>{
    let query = "update user_info set wechat_status = ? where id = ? ";
    let paramsArray =[],i=0;
    paramsArray[i++] = params.wechatStatus;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateStatus');
        callback(error,rows);
    });
}
const updateType=(params,callback)=>{
    let query = "update user_info set auth_status = ? where id = ? ";
    let paramsArray =[],i=0;
    paramsArray[i++] = params.authStatus;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateType');
        callback(error,rows);
    });
}
const updateAuthTime=(params,callback)=>{
    let query = "update user_info set auth_time = ? where id = ? ";
    let paramsArray =[],i=0;
    paramsArray[i++] = params.myDate;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateType');
        callback(error,rows);
    });
}
const updateCreatedTime=(params,callback)=>{
    let query = "update user_info set auth_time = ?,auth_status=? where id = ? ";
    let paramsArray =[],i=0;
    paramsArray[i++] = params.myDate;
    paramsArray[i++] = params.authStatus;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateType');
        callback(error,rows);
    });
}
const getUserStatByDay=(params,callback)=>{
    let query = " select db.id,count(ui.id) as user_count from date_base db " +
                " left join user_info ui on db.id=ui.date_id " +
                " where db.id is not null ";
    let paramsArray =[],i=0;
    if(params.dateIdStart){
        paramsArray[i++] = params.dateIdStart;
        query = query + " and db.id >= ? "
    }
    if(params.dateId){
        paramsArray[i] = params.dateId;
        query = query + " and db.id <= ? "
    }
    query = query + " group by db.id order by db.id desc ";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getUserStatByDay');
        callback(error,rows);
    });
}
const getUserStatByMonth=(params,callback)=>{
    let query = " select db.y_month,count(ui.id) as user_count from date_base db " +
                " left join user_info ui on db.id=ui.date_id " +
                " where db.id is not null ";
    let paramsArray =[],i=0;
    if(params.yMonthStart){
        paramsArray[i++] = params.yMonthStart;
        query = query + " and db.y_month >= ? "
    }
    if(params.yMonthEnd){
        paramsArray[i] = params.yMonthEnd;
        query = query + " and db.y_month <= ? "
    }
    query = query + " group by db.y_month order by db.y_month desc ";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getUserStatByMonth');
        callback(error,rows);
    });
}
const updateUserImg=(params,callback)=>{
    let query = "update user_info set avatar_image = ? where id = ? ";
    let paramsArray =[],i=0;
    paramsArray[i++] = params.avatarImage;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateUserImg');
        callback(error,rows);
    });
}
module.exports = {
    queryUser,
    createUser,
    lastLoginOn,
    updateUser,
    updatePassword,
    updatePhone,
    updateStatus,
    updateType,
    updateAuthTime,
    updateCreatedTime,
    getUserStatByDay,
    getUserStatByMonth,
    updateUserImg
}