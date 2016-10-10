/*
Navicat MySQL Data Transfer

Source Server         : connectMysql
Source Server Version : 50547
Source Host           : localhost:3306
Source Database       : intelssd

Target Server Type    : MYSQL
Target Server Version : 50547
File Encoding         : 65001

Date: 2016-06-02 15:03:35
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for activity
-- ----------------------------
DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Year` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Date` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Content` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Address` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of activity
-- ----------------------------
INSERT INTO `activity` VALUES ('1', 'CJ', '2016', '4.15-4.16', '11111', '上海');
INSERT INTO `activity` VALUES ('3', 'name2-edit', '2016-edit', '3.14-3.14-edit', '内容-edit', '无锡-edit');
INSERT INTO `activity` VALUES ('5', 'test1-', '2015', '4', null, 'WX');
INSERT INTO `activity` VALUES ('6', 'test', '2016', '1-5', '<p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>', 'wx');
INSERT INTO `activity` VALUES ('7', 'test1', '2015', '2', '<p>ssssssssssssss</p>', 'WX');
INSERT INTO `activity` VALUES ('8', 'ee', '2015', '1-5', '<p>eeeeeeeeeeee-edit</p>', 'WX');
INSERT INTO `activity` VALUES ('9', 'eeeee', '2015', '1-5', '<p>ss</p>', 'WX');

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `Id` int(4) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Pic` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES ('1', '消费级-edit', 'uploads\\product\\xfile-1464596954860.jpeg');
INSERT INTO `category` VALUES ('2', '专业级', 'uploads\\product\\xfile-1464596944771.jpeg');
INSERT INTO `category` VALUES ('3', '数据中心级', 'uploads\\product\\xfile-1464596934585.jpeg');
INSERT INTO `category` VALUES ('4', '嵌入式级', 'uploads\\product\\xfile-1464596925707.jpeg');
INSERT INTO `category` VALUES ('12', 'test1-edit', 'uploads\\product\\xfile-1464596915292.jpeg');

-- ----------------------------
-- Table structure for material_pic
-- ----------------------------
DROP TABLE IF EXISTS `material_pic`;
CREATE TABLE `material_pic` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Url` varchar(10000) COLLATE utf8_unicode_ci DEFAULT NULL,
  `SeriesId` int(11) DEFAULT NULL,
  `CategoryId` int(11) DEFAULT NULL,
  `Time` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of material_pic
-- ----------------------------
INSERT INTO `material_pic` VALUES ('22', 'test1', '[{\"uid\":\"-1464598473000/1.699\",\"picPath\":\"\\\\uploads\\\\pic\\\\xfile-1464598473061.jpeg\",\"picName\":\"540s-2.5-Connector-Angled-Shadow.jpg\"},{\"uid\":-1463974789000,\"picPath\":\"\\\\uploads\\\\49d48467978231d7dd33507264e70fbd\",\"picName\":\"750 AIC Box Contents Shadow.jpg\"},{\"uid\":-1463974782000,\"picPath\":\"\\\\uploads\\\\8248ad3650d8d41efef85489168c74bb\",\"picName\":\"750 AIC Back Flat Shadow.jpg\"},{\"uid\":-1463974626000,\"picPath\":\"\\\\uploads\\\\ea82424a40a3d2695b4707449cc369b5\",\"picName\":\"1.png\"},{\"uid\":\"-1464598473000/1.202\",\"picPath\":\"\\\\uploads\\\\pic\\\\xfile-1464598473059.jpeg\",\"picName\":\"540s-2.5-Box-Contents-Shadow.jpg\"},{\"uid\":\"-1464598473000/1.527\",\"picPath\":\"\\\\uploads\\\\pic\\\\xfile-1464598473063.jpeg\",\"picName\":\"540s-2.5-Connector-Flat-Shdaow.jpg\"},{\"uid\":\"-1464598473000/1.085\",\"picPath\":\"\\\\uploads\\\\pic\\\\xfile-1464598473057.jpeg\",\"picName\":\"540s-2.5-Back-Flat-Shadow.jpg\"},{\"uid\":\"-1464598473000/1.541\",\"picPath\":\"\\\\uploads\\\\pic\\\\xfile-1464598473064.jpeg\",\"picName\":\"540s-2.5-Front-Flat-Shadow.jpg\"},{\"uid\":\"-1464598473000/1.334\",\"picPath\":\"\\\\uploads\\\\pic\\\\xfile-1464598473070.jpeg\",\"picName\":\"540s-2.5-Isometric-Shadow.jpg\"}]', '108', '1', '2016-05-23 11:37:09');
INSERT INTO `material_pic` VALUES ('23', 'test-2', '[{\"uid\":\"-1464598351000/1.1682636439800262\",\"picPath\":\"\\\\uploads\\\\pic\\\\xfile-1464598351945.jpeg\",\"picName\":\"540s-2.5-Back-Flat-Shadow.jpg\"},{\"uid\":-1464597812000,\"picPath\":\"\\\\uploads\\\\pic\\\\xfile-1464597812331.png\",\"picName\":\"data_page_hover.png\"},{\"uid\":-1464054785000,\"picPath\":\"\\\\uploads\\\\44433b8abe50e0d1bec3807c43700f3b\",\"picName\":\"1.png\"},{\"uid\":\"-1464598351000/1.789819659665227\",\"picPath\":\"\\\\uploads\\\\pic\\\\xfile-1464598351948.jpeg\",\"picName\":\"540s-2.5-Box-Contents-Shadow.jpg\"},{\"uid\":\"-1464598351000/1.3238511909730732\",\"picPath\":\"\\\\uploads\\\\pic\\\\xfile-1464598351949.jpeg\",\"picName\":\"540s-2.5-Connector-Angled-Shadow.jpg\"}]', '107', '2', '2016-05-24 09:53:11');
INSERT INTO `material_pic` VALUES ('26', 'test-3-e', '[{\"uid\":-1464598036000,\"picPath\":\"\\\\uploads\\\\pic\\\\xfile-1464598036497.jpeg\",\"picName\":\"2.jpg\"},{\"uid\":-1464598036001,\"picPath\":\"\\\\uploads\\\\pic\\\\xfile-1464598036495.jpeg\",\"picName\":\"1.jpg\"},{\"uid\":-1464598036002,\"picPath\":\"\\\\uploads\\\\pic\\\\xfile-1464598036498.png\",\"picName\":\"2.png\"}]', '113', '4', '2016-05-24 10:01:22');
INSERT INTO `material_pic` VALUES ('29', 'test图片-edit', '[{\"uid\":\"-1464599857000/1.115\",\"picPath\":\"\\\\uploads\\\\pic\\\\xfile-1464599857851.jpeg\",\"picName\":\"540s-2.5-Back-Flat-Shadow.jpg\"}]', '111', '1', '2016-05-30 17:17:39');

-- ----------------------------
-- Table structure for product
-- ----------------------------
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `SeriesId` int(11) DEFAULT NULL,
  `Time` datetime DEFAULT NULL,
  `CategoryId` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of product
-- ----------------------------
INSERT INTO `product` VALUES ('4', 'x4', '107', '2016-05-25 15:01:24', null);
INSERT INTO `product` VALUES ('5', '1.2TB, 2.5in PCIe 3.0, 20nm, MLC', '113', null, '4');
INSERT INTO `product` VALUES ('6', '1.2TB, 1/2 Height PCIe 3.0, 20nm, MLC', '113', null, '4');
INSERT INTO `product` VALUES ('7', '800GB, 2.5in PCIe 3.0 x4, 20nm, MLC', '113', null, '4');
INSERT INTO `product` VALUES ('8', '400GB, 2.5in PCIe 3.0, 20nm, MLC', '113', null, '4');
INSERT INTO `product` VALUES ('10', '400GB, 1/2 Height PCIe 3.0, 20nm, MLC', '113', null, '4');
INSERT INTO `product` VALUES ('11', '(test2)', '113', null, '4');
INSERT INTO `product` VALUES ('12', '产品1', '108', null, '1');
INSERT INTO `product` VALUES ('13', '产品2', '108', null, '1');
INSERT INTO `product` VALUES ('14', '产品3', '108', null, '1');
INSERT INTO `product` VALUES ('15', '产品4', '108', null, '1');
INSERT INTO `product` VALUES ('16', '产品535-1', '109', null, '1');
INSERT INTO `product` VALUES ('17', 'test6/1', '114', null, '12');

-- ----------------------------
-- Table structure for series
-- ----------------------------
DROP TABLE IF EXISTS `series`;
CREATE TABLE `series` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `CategoryId` int(11) DEFAULT NULL,
  `Time` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of series
-- ----------------------------
INSERT INTO `series` VALUES ('107', 'test1', '2', '2016-05-30 14:00:01');
INSERT INTO `series` VALUES ('108', 'Intel® SSD 750 Series', '1', '2016-05-25 09:25:48');
INSERT INTO `series` VALUES ('109', 'Intel® SSD 535 Series', '1', '2016-05-25 09:26:21');
INSERT INTO `series` VALUES ('110', 'Intel® SSD 730 Series', '1', '2016-05-25 09:26:36');
INSERT INTO `series` VALUES ('111', 'Intel® SSD 540s Series', '1', '2016-05-25 09:26:49');
INSERT INTO `series` VALUES ('113', 'Intel® SSD 525 Series', '4', '2016-05-26 09:59:34');
INSERT INTO `series` VALUES ('114', 'test1-edit22222', '12', '2016-05-30 15:02:40');

-- ----------------------------
-- Table structure for solution
-- ----------------------------
DROP TABLE IF EXISTS `solution`;
CREATE TABLE `solution` (
  `Id` int(4) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `IndustryId` int(4) DEFAULT NULL,
  `Publisher` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Intro` varchar(1000) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Text` varchar(1000) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Time` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of solution
-- ----------------------------
INSERT INTO `solution` VALUES ('41', '河南移动：英特尔® 基于 NVMe* 协议 的 PCIe* 加速 Oracle* 数据库的应用', '1', 'admin', 'uploads\\solution\\xfile-1464660430179.jpeg', '“河南移动* 应用了英特尔® 基于 NVMe* 协议的 PCIe* DC P3700 系列的解决方 案，大大减少了 BI 系统数 据的查询时间，数据服务 响应效率提升显著，改善 了内部客互服务感知。在 4G 大数据时代，感谢 英特尔® 固态盘帮我们 改善了用户体验。” 河南移动业务支撑部 系统架构师 李远', null, '2016-05-26 15:42:26');
INSERT INTO `solution` VALUES ('42', '浙江移动*：基于英特尔® 固态盘的 虚拟化资源池解决方案', '1', 'admin', 'uploads\\solution\\xfile-1464660525239.jpeg', '“应用了南京斯坦德* 基于 英特尔® 固态盘 DC S3500 系列的解决方案，大大降低 了我们的部署成本，提高了 网络传输数据的效率。在减 少耗电量和缩减机房空间上 都有了可喜的提升。在 4G 时代，感谢英特尔® 固态盘 帮我们增强了用户黏性。” 中国移动阅读基地 中国移动浙江移动网管 IT 架构 康祖令 博士', null, '2016-05-26 15:46:06');
INSERT INTO `solution` VALUES ('43', '中国联通研究院基于 Ceph 分布式 存储的使用', '1', 'admin', 'uploads\\solution\\xfile-1464660430179.jpeg', null, null, '2016-05-26 15:46:36');
INSERT INTO `solution` VALUES ('44', '英特尔® NVMe 固态盘在百度数据 中心的使用', '2', 'admin', 'uploads\\solution\\xfile-1464660430179.jpeg', null, null, '2016-05-26 15:47:08');
INSERT INTO `solution` VALUES ('45', '云创存储*：英特尔® 固态盘在 PM2.5 物联网监测系统中的应用', '2', 'admin', 'uploads\\solution\\xfile-1464660525239.jpeg', '“江苏省环保厅 1831 平台部 署了基于英特尔® 固态盘 DC S3500 系列全新的云创存储 解决方案之后，对于 PM2.5 的数据采集、处理和监测效 率有了巨大的帮助。新方案 整体延迟下降了 150 倍，满 足公民实时监测的需求，从 而增强政府公信力。” 2013 年度中国十大杰出 CIO 称号获得者 江苏省环保厅 1831 平台负责人 江苏省生态环境监控中心 何春银主任', null, '2016-05-26 15:47:37');
INSERT INTO `solution` VALUES ('46', '拉卡拉集团 ——高性能NVME四路服务器', '2', 'admin', 'uploads\\solution\\xfile-1464660430179.jpeg', 'Intel PCI-E SSD 开启城市市民购物付款高速道', null, '2016-05-26 15:48:20');
INSERT INTO `solution` VALUES ('47', 'Powerleader*：英特尔® 基于 NVMe* 协议的 PCIe* 固态盘在教育行业应用', '3', 'admin', 'uploads\\solution\\xfile-1464660430179.jpeg', '“应用了 Powerleader 基 于英特尔® NVMe* 协议的 PCIe* 固态盘 P3600 系列的 解决方案，大大降低了我们 的部署成本，解决了虚拟桌 面启动风暴及其稳定性的问 题，提高了网络传输数据的 效率。在 3D 渲染与视频制 作的教学过程中使得学生得 到了更好的教学体验，在教 学的效率与质量上都有了可 喜的提升。” 中央国家机关政府采购专家组组长 徐英杰', null, '2016-05-26 15:48:53');
INSERT INTO `solution` VALUES ('48', '西安电子科技大学：基于英特尔固态盘 优化的并行核外高阶矩量法解决方案', '3', 'admin', 'uploads\\solution\\xfile-1464660525239.jpeg', '“使用英特尔固态盘进行并行 核外算法的矩阵填充和矩阵方 程求解，所用时间比使用 SAS 机械硬盘明显减少，而且使用 英特尔固态盘的核外算法与核 内算法相比几乎获得相同的性 能。因此，我们可以利用 SSD 更快的读写速度，运用核外算 法，解决计算电大尺寸模型内 存不足的问题。” 西安电子科技大学 赵勋旺 副教授', null, '2016-05-26 15:49:17');
INSERT INTO `solution` VALUES ('49', '凯翔信息科技*：英特尔® 基于 NVMe* 协议的 PCIe* 固态盘在视频服务器中的 应用', '4', 'admin', 'uploads\\solution\\xfile-1464660430179.jpeg', '“采用英特尔® 基于 NVMe* 协 议的 PCIe* 固态盘 P3600 系列 1.2TB，一方面保证了我们的 视频服务器具备高性能和高并 发流输出能力，另一方面，这 款固态盘的大存储容量，也很 好地满足了视频服务器业务的 需求。新的视频解决方案可在 视频服务器上提供高带宽并发 流输出，在同类产品中具有 较强的技术优势，同时，高 带宽、大并发输出也降低了 单流成本。” 上海凯翔信息科技公司 产品总监 朱懿', null, '2016-05-26 15:49:53');
INSERT INTO `solution` VALUES ('50', '深圳骄阳：基于英特尔 NVMe 协议的 PCIe 固态盘优化的大型 CG 制作环境 INFINITY 高性能集群存储解决方案', '4', 'admin', 'uploads\\solution\\xfile-1464660430179.jpeg', '“德拓结合英特尔推出了 PCIe 固态盘高速缓存解决方案，利 用 PCIe SSD 高速特性，不仅 可以满足大规模 CG 应用环境 下对于高清视音频渲染的 IO 吞吐率需求，还可以进一步提 升存储系统的 IOPS 能力，对 不同类型的数据请求做出快速 反应，降低成本的同时提高了 创作效率。” 深圳骄阳技术有限责任公司 任立东 IT 经理', null, '2016-05-26 15:50:16');
INSERT INTO `solution` VALUES ('51', '虹软科技*：基于 NVMe* 协议的适用 PCIe* 的英特尔® 固态盘优化的专业视 频高速云转码解决方案', '4', 'admin', 'uploads\\solution\\xfile-1464660525239.jpeg', '“基于 NVMe* 协议的适用 PCIe* 的英特尔® 固态盘 DC P3700 系列的解决方案，极 大的加速了高速云转码的读 写性能，使得整体性能得到 了显著的提升。 严苛的压力测试和实际商用 表明，单块英特尔固态盘 DC P3700 系列即可满足 40 路 高清大码率视频数据的同时 并发读写要求。” 虹软科技有限公司 架构师 黄进', null, '2016-05-31 10:08:46');
INSERT INTO `solution` VALUES ('52', '歌华有线*：基于英特尔® 固态盘的全媒体聚合云服务平台', '4', 'admin', 'uploads\\solution\\xfile-1464660499736.jpeg', '在部署了英特尔® 固态盘 DC S3700 系列作为缓存器后， 使得我们的视频服务器性能 大大提升。这种提升集中体 现在高并发性、低延迟以及 高 SLA 上。除此之外，降低 了 50% 的单个视频流成本也 是我们考虑使用英特尔® 固态 盘最重要的因素之一。 北京天地超云科技有限公司 高级产品经理 伍瑞', null, '2016-05-31 10:08:20');
INSERT INTO `solution` VALUES ('53', '大华股份*：英特尔 ® 基于 NVMe* 协议的 PCIe* 固态盘在智慧城市中的应用', '5', 'admin', 'uploads\\solution\\xfile-1464660486838.jpeg', '“通过采用英特尔® P3700 系列固态盘，保证了我们的 元数据服务器具备快速的读 取和写入能力。基于英特尔® NVMe* 协议的 PCIe* 固态盘 的高耐用性和稳定性，很好 地满足了整体解决方案的高 寿命需求。应用英特尔® 固态 盘，大华股份的全新智慧城 市解决方案能够以高性能、 高稳定性和高寿命为客户带 来更加出色的服务体验。” 大华技术股份有限公司 技术总监 许焰', null, '2016-05-31 10:08:07');
INSERT INTO `solution` VALUES ('54', '华夏人寿：基于英特尔 NVMe 协议的 PCIe 固态盘优化的数据库解决方案', '5', 'admin', 'uploads\\solution\\xfile-1464660471774.jpeg', '英特尔基于 NVMe 协议 PCIe 固态盘性能对于银保通业务 的推广起着重要的作用，在 数据库 IO 读写方面，英特尔 基于 NVMe 协议的 PCIe 固态 盘比原有小型机加存储具有 明显优势，缩短了业务处理 时间与数据查询时间，让用 户体验更好。 华夏人寿 任玉 系统管理处架构师', null, '2016-05-31 10:07:52');
INSERT INTO `solution` VALUES ('55', 'NStor2000 构建新一代智能电网数据 中心高性能、易扩展分布式存储解决方案', '5', 'admin', 'uploads\\solution\\xfile-1464660462574.jpeg', '南瑞信息系统集成分公司采用南瑞集成自主研发 cachestore 块存储算法，搭配新一 代英特尔® 至强™ 处理器 E5 产品家族及高性能 NVMe* 接口固态盘，构建高性能可 扩展的智能分布式存储解决方', null, '2016-05-31 10:07:43');
INSERT INTO `solution` VALUES ('56', 'Ceph 助力构建高性能横向扩展存储 解决方案', '6', 'admin', 'uploads\\solution\\xfile-1464660430179.jpeg', '北京完美世界网络技术有限公司（以下简称完美世界）通过英特尔® 至强™ 处理器 E5-2600 产品家 族和 PCI-E 固态盘构建高性能私有云和基于 Ceph 的横向扩展存储解决方案', null, '2016-05-31 17:10:25');
INSERT INTO `solution` VALUES ('64', 'test1-edit', '7', 'admin', null, null, null, '2016-05-31 16:47:57');

-- ----------------------------
-- Table structure for sol_industry
-- ----------------------------
DROP TABLE IF EXISTS `sol_industry`;
CREATE TABLE `sol_industry` (
  `Id` int(4) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sol_industry
-- ----------------------------
INSERT INTO `sol_industry` VALUES ('1', '电信行业');
INSERT INTO `sol_industry` VALUES ('2', '互联网行业');
INSERT INTO `sol_industry` VALUES ('3', '教育行业');
INSERT INTO `sol_industry` VALUES ('4', '媒体行业');
INSERT INTO `sol_industry` VALUES ('5', '政府行业');
INSERT INTO `sol_industry` VALUES ('6', '游戏行业');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Pwd` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Role` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'admin', '9e91995bf987a4be7cd9838338a2306f', null);
INSERT INTO `users` VALUES ('14', 'test1', '9e91995bf987a4be7cd9838338a2306f', null);
INSERT INTO `users` VALUES ('15', 'test3-edit-edit', '9e91995bf987a4be7cd9838338a2306f', null);

-- ----------------------------
-- Table structure for whitepage
-- ----------------------------
DROP TABLE IF EXISTS `whitepage`;
CREATE TABLE `whitepage` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `Url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Time` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of whitepage
-- ----------------------------
INSERT INTO `whitepage` VALUES ('1', '面向 NVMe* 的英特尔® 固态盘数据中心产品家族持续提供卓越性能', null, '2016-05-16 13:58:32');
INSERT INTO `whitepage` VALUES ('7', '322-ed', null, '2016-05-24 15:21:00');
INSERT INTO `whitepage` VALUES ('10', '固态盘在服务器存储系统中的应用族持续提供卓越性能', null, '2016-05-26 16:20:47');
INSERT INTO `whitepage` VALUES ('11', '使用通过 OEM 验证的英特尔® 固态盘 DC S3700 系列评估 VMware* VSAN', null, '2016-05-26 16:20:54');
INSERT INTO `whitepage` VALUES ('12', '为何选择英特尔非易失性存储 (NVM) 解决方案？', null, '2016-05-26 16:21:00');
INSERT INTO `whitepage` VALUES ('13', '面向 PCIe* 和 NVMe* 企业固态盘的性能指标评测', null, '2016-05-26 16:21:06');
INSERT INTO `whitepage` VALUES ('14', '面向企业的经济高效可扩展存储', null, '2016-05-26 16:21:14');
INSERT INTO `whitepage` VALUES ('15', '英特尔® 固态盘助力 SQL Server 2014 优化', null, '2016-05-26 16:21:20');
INSERT INTO `whitepage` VALUES ('16', '借助英特尔® 固态盘 DC S3500 系列打造低成本的高 IOPS 虚拟机数据存储 — *CloudExpo 13’演示', null, '2016-05-26 16:21:27');
INSERT INTO `whitepage` VALUES ('17', '英特尔 SSD DC S3500 在 RAID 配置中的工作负载特征', null, '2016-05-26 16:21:33');
INSERT INTO `whitepage` VALUES ('18', '英特尔® 固态盘 Pro 2500 系列非易失性存储解决方案', null, '2016-05-26 16:21:38');
INSERT INTO `whitepage` VALUES ('19', '向固态盘迁移', null, '2016-05-26 16:21:43');
INSERT INTO `whitepage` VALUES ('20', '为何选择数据中心级固态盘？', null, '2016-05-26 16:21:48');
INSERT INTO `whitepage` VALUES ('21', 'In-Memory NoSQL* 数据库，纵向扩展高性能多 TB 纯闪存存储', null, '2016-05-26 16:21:54');
INSERT INTO `whitepage` VALUES ('22', '基于 PCIe* 的英特尔® 数据中心级固态盘家族', null, '2016-05-26 16:21:59');
INSERT INTO `whitepage` VALUES ('23', 'Intel® PCIe NVMe SSD 安装测试指导书 ', 'uploads\\whitePage\\1464658868052-Intel SSD Wechat 相关方案推荐v5.docx', '2016-05-31 09:41:10');
INSERT INTO `whitepage` VALUES ('27', 'test1', 'uploads\\whitePage\\1464658823553-Intel SSD Wechat 相关方案推荐v5.docx', '2016-05-31 09:40:26');
