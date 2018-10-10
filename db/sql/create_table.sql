-- ----------------------------
-- Table structure for police_info
-- ----------------------------
DROP TABLE IF EXISTS `police_info`;
CREATE TABLE `police_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名字',
  `gender` tinyint(1) NOT NULL DEFAULT '1' COMMENT '性别',
  `password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户密码',
  `phone` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '电话',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `type` tinyint(1) NOT NULL DEFAULT '1',
  `last_login_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for date_base
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
-- Table structure for car_info
-- ----------------------------
DROP TABLE IF EXISTS `car_info`;
CREATE TABLE `car_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `police_id` int(11) NOT NULL COMMENT '交警id',
  `date_id` int(4) DEFAULT NULL,
  `vin` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '商品车识别码',
  `engine_num` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '发动机号',
  `license_plate` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '车牌号码',
  `phone` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '电话',
  `city` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '城市',
  `address` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '详细地址',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态(0-不显示,1-显示)',
  `type` tinyint(1) NOT NULL DEFAULT '1',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;