/*
Navicat MySQL Data Transfer

Source Server         : 47.93.121.1
Source Server Version : 50717
Source Host           : 47.93.121.1:3306
Source Database       : log_cu

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2019-03-27 10:02:02
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for `admin_user`
-- ----------------------------
DROP TABLE IF EXISTS `admin_user`;
CREATE TABLE `admin_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
  `real_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '真名',
  `password` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户密码',
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机号',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态(0-停用,1-可用)',
  `type` tinyint(4) NOT NULL DEFAULT '1',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10001 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `app_version`
-- ----------------------------
DROP TABLE IF EXISTS `app_version`;
CREATE TABLE `app_version` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `app` tinyint(1) unsigned NOT NULL COMMENT 'app类别(1-storage,2-truck,3-dispatch,4-drive,5-damage)',
  `type` tinyint(1) NOT NULL COMMENT '类型(1-android,2-ios)',
  `version` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '版本',
  `url` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '地址',
  `force_update` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '更新类别(0-否,1-是)',
  `serial` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '序列号',
  `remark` varchar(400) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `check_car_info`
-- ----------------------------
DROP TABLE IF EXISTS `check_car_info`;
CREATE TABLE `check_car_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supervise_id` int(11) NOT NULL COMMENT '交警id',
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `car_id` int(11) NOT NULL COMMENT '车辆id',
  `date_id` int(4) DEFAULT NULL,
  `address` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '详细地址',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态(0-不显示,1-显示)',
  `type` tinyint(1) NOT NULL DEFAULT '1',
  `lon` decimal(10,4) DEFAULT '0.0000' COMMENT '经纬度',
  `lat` decimal(10,4) DEFAULT '0.0000' COMMENT '经纬度',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=149 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `date_base`
-- ----------------------------
DROP TABLE IF EXISTS `date_base`;
CREATE TABLE `date_base` (
  `id` int(4) NOT NULL,
  `day` int(4) NOT NULL,
  `week` int(4) NOT NULL,
  `month` int(4) NOT NULL,
  `year` int(4) NOT NULL,
  `y_month` int(4) NOT NULL,
  `y_week` int(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for `log_company`
-- ----------------------------
DROP TABLE IF EXISTS `log_company`;
CREATE TABLE `log_company` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `remark` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `log_info`
-- ----------------------------
DROP TABLE IF EXISTS `log_info`;
CREATE TABLE `log_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `order_id` int(11) NOT NULL,
  `log_company_id` int(100) DEFAULT NULL COMMENT '快递公司',
  `log_num` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '快递单号',
  `product_des` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '产品描述',
  `freight` decimal(10,2) DEFAULT NULL,
  `remark` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_id` int(4) DEFAULT NULL,
  `recv_name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '收货人',
  `recv_phone` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '收货人电话',
  `recv_address` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '收货人地址',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0未发货1已发货',
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `message_status`
-- ----------------------------
DROP TABLE IF EXISTS `message_status`;
CREATE TABLE `message_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `order_feedback`
-- ----------------------------
DROP TABLE IF EXISTS `order_feedback`;
CREATE TABLE `order_feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `order_id` int(11) NOT NULL,
  `apply_reason` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '申请原因',
  `process_remark` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '处理描述（对客户）',
  `process_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '处理方法（对内）',
  `date_id` int(4) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0未处理1处理中2已处理',
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `order_info`
-- ----------------------------
DROP TABLE IF EXISTS `order_info`;
CREATE TABLE `order_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `order_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '商品名称',
  `total_price` decimal(10,2) DEFAULT NULL COMMENT '订单总价',
  `prod_count` int(10) DEFAULT NULL COMMENT '商品数量',
  `total_freight` decimal(10,2) DEFAULT NULL COMMENT '总运费',
  `remark` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_id` int(4) DEFAULT NULL,
  `recv_name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recv_phone` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recv_address` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `log_status` tinyint(1) NOT NULL DEFAULT '0',
  `payment_status` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '订单状态0未取消1已取消',
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=200641 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `order_item`
-- ----------------------------
DROP TABLE IF EXISTS `order_item`;
CREATE TABLE `order_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `car_id` int(11) DEFAULT NULL,
  `product_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL COMMENT '单价',
  `prod_count` int(10) DEFAULT NULL COMMENT '商品数量',
  `total_price` decimal(10,2) DEFAULT NULL COMMENT '总价',
  `freight` decimal(10,2) DEFAULT NULL,
  `remark` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0未下单1已下单2已支付3已发货',
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `imag` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=938 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `payment_info`
-- ----------------------------
DROP TABLE IF EXISTS `payment_info`;
CREATE TABLE `payment_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `order_id` int(11) NOT NULL,
  `total_fee` decimal(10,2) DEFAULT '0.00' COMMENT '支付金额',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `date_id` int(4) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0未1已',
  `payment_type` tinyint(1) DEFAULT '0' COMMENT '支付方式1微信2支付宝3其他',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '结果：1支付2退款',
  `transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nonce_str` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `p_id` int(11) DEFAULT NULL COMMENT '支付退款标记',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=200 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `product_info`
-- ----------------------------
DROP TABLE IF EXISTS `product_info`;
CREATE TABLE `product_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `original_price` decimal(10,2) DEFAULT NULL COMMENT '原价',
  `unit_price` decimal(10,2) DEFAULT NULL COMMENT '现价',
  `freight` decimal(10,2) DEFAULT NULL,
  `product_remark` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '商品描述',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0下架1所有商品2销售中',
  `type` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1所有商品2实物3服务',
  `img` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remark` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `supervise_device`
-- ----------------------------
DROP TABLE IF EXISTS `supervise_device`;
CREATE TABLE `supervise_device` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `supervise_id` int(11) NOT NULL COMMENT '用户ID',
  `device_token` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '设备标识',
  `version` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '设备版本',
  `app_type` tinyint(1) NOT NULL COMMENT 'app登录类型(1-仓储app,2-车管app,3-调度app,4-司机app)',
  `device_type` tinyint(1) NOT NULL DEFAULT '1' COMMENT '设备类型(1-android,2-ios)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `supervise_info`
-- ----------------------------
DROP TABLE IF EXISTS `supervise_info`;
CREATE TABLE `supervise_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名字',
  `gender` tinyint(1) NOT NULL DEFAULT '1' COMMENT '性别',
  `password` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户密码',
  `phone` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '电话',
  `avatar_image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `type` tinyint(1) NOT NULL DEFAULT '1',
  `last_login_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10023 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `user_car`
-- ----------------------------
DROP TABLE IF EXISTS `user_car`;
CREATE TABLE `user_car` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `vin` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '商品车识别码',
  `make_id` int(10) DEFAULT NULL COMMENT '品牌ID',
  `make_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '品牌名称',
  `model_id` int(10) DEFAULT NULL COMMENT '型号ID',
  `model_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '型号名称',
  `engine_num` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '发动机号',
  `license_plate` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '车牌号码',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态(0-不显示,1-显示)',
  `type` tinyint(1) NOT NULL DEFAULT '1',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10051 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `user_device`
-- ----------------------------
DROP TABLE IF EXISTS `user_device`;
CREATE TABLE `user_device` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `device_token` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '设备标识',
  `version` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '设备版本',
  `app_type` tinyint(1) NOT NULL COMMENT 'app登录类型(1-仓储app,2-车管app,3-调度app,4-司机app)',
  `device_type` tinyint(1) NOT NULL DEFAULT '1' COMMENT '设备类型(1-android,2-ios)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `user_info`
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `wechat_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wechat_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '昵称',
  `password` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_image` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像',
  `gender` tinyint(1) DEFAULT NULL,
  `num` int(10) DEFAULT '0',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_id` int(4) DEFAULT NULL,
  `birth` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '出生年月日',
  `wechat_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '微信状态(0-停用,1-可用)',
  `auth_status` tinyint(1) DEFAULT '0' COMMENT '认证状态(0-停用,1-可用)',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0停用1启用',
  `type` tinyint(1) NOT NULL DEFAULT '1',
  `auth_time` timestamp NULL DEFAULT NULL COMMENT '认证时间',
  `last_login_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最后一次登录时间',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10050 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `user_message`
-- ----------------------------
DROP TABLE IF EXISTS `user_message`;
CREATE TABLE `user_message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `phone` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '扫描交警名字',
  `title` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '消息名称',
  `content` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '消息内容',
  `date_id` int(4) DEFAULT NULL,
  `read_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0未读1已读',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0不是默认1默认',
  `type` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1验证码2违停',
  `user_type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1普通用户2警察',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=162 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `user_ship_address`
-- ----------------------------
DROP TABLE IF EXISTS `user_ship_address`;
CREATE TABLE `user_ship_address` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `address` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '地址',
  `detail_address` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '相抵地址',
  `user_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0停用地址1启用地址',
  `type` tinyint(1) NOT NULL DEFAULT '1',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Event structure for `date_base_event`
-- ----------------------------
DROP EVENT IF EXISTS `date_base_event`;
DELIMITER ;;
CREATE DEFINER=`cu_db_user`@`%` EVENT `date_base_event` ON SCHEDULE EVERY 1 DAY STARTS '2019-01-14 13:37:33' ON COMPLETION NOT PRESERVE ENABLE DO INSERT INTO date_base (`id`,`day`,`week`,`month`,`year`,`y_month`,`y_week`) 
values (DATE_FORMAT(NOW(),'%Y%m%d'),DATE_FORMAT(NOW(),'%d'),WEEK(NOW(),1),DATE_FORMAT(NOW(),'%m'),
DATE_FORMAT(NOW(),'%Y'),DATE_FORMAT(NOW(),'%Y%m'),CONCAT(DATE_FORMAT(NOW(),'%Y'),LPAD(WEEK(NOW(),1),2,0)))
;;
DELIMITER ;
