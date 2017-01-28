import React, {Component, PropTypes} from 'react';
import {View, Text, Image, Dimensions, StyleSheet} from 'react-native';

// 商品展示区的文字和图片
// 明星商品栏的
const HIGHLIGHT_PRODUCTS = [
    {
        icon: require('./images/highlightProduct/icon/xianshiqianggou.png'),
        title: '限时抢购',
        titleColor: 'red',
        subtitle: '快来',
        mainPic: require('./images/highlightProduct/product/mainpic_1.png'),
        subPic: require('./images/highlightProduct/product/subpic_1.png'),
        countDown: {
            show: true,
            hour: 15,
            min: 30,
            sec: 5,
        }
    },
    {
        icon: require('./images/highlightProduct/icon/youhaohuo.png'),
        title: '有好货',
        titleColor: 'blue',
        subtitle: '高颜值美物',
        mainPic: require('./images/highlightProduct/product/mainpic_2.png'),
        subPic: require('./images/highlightProduct/product/subpic_2.png'),
        countDown: {
            show: false,
        }
    },
    {
        icon: require('./images/highlightProduct/icon/aiguangjie.png'),
        title: '爱逛街',
        titleColor: 'orange',
        subtitle: '新品逛不停',
        mainPic: require('./images/highlightProduct/product/mainpic_3.png'),
        subPic: require('./images/highlightProduct/product/subpic_3.png'),
        countDown: {
            show: false,
        }
    },
    {
        icon: require('./images/highlightProduct/icon/bimaiqingdan.png'),
        title: '必买清单',
        titleColor: 'green',
        subtitle: '一站式攻略',
        mainPic: require('./images/highlightProduct/product/mainpic_4.png'),
        subPic: require('./images/highlightProduct/product/subpic_4.png'),
        countDown: {
            show: false,
        }
    },
];

// 普通商品栏的
const NORMAL_PRODUCT_GROUPS = [
    {
        title: '超实惠',
        icon: require('./images/normalProduct/icon/chaoshihui.png'),
        more: false,
        products: [
            {
                bigFont: true,
                title: '非常大牌',
                iconText: 'BRAND',
                subtitle: '好货好价好时尚',
                pic: require('./images/normalProduct/product/1.png'),
                flex: 1.8,
            },
            {
                bigFont: false,
                title: '全球精选',
                subtitle: '享品质生活',
                pic: require('./images/normalProduct/product/2.png'),
                flex: 1,
            },
            {
                bigFont: false,
                title: '量贩优选',
                subtitle: '1分钱疯抢',
                pic: require('./images/normalProduct/product/3.png'),
                flex: 1,
            },
            {
                bigFont: false,
                title: '聚名品',
                subtitle: '奢品不打烊',
                pic: require('./images/normalProduct/product/4.png'),
                flex: 1,
            },
            {
                bigFont: true,
                iconText: 'CHEAP',
                title: '天天特价',
                subtitle: '每日精选千款好货',
                pic: require('./images/normalProduct/product/5.png'),
                flex: 1.8,
            },
            {
                bigFont: false,
                title: '品牌店庆',
                subtitle: '限时3折起',
                pic: require('./images/normalProduct/product/6.png'),
                flex: 1,
            },
            {
                bigFont: false,
                title: '魅力惠',
                subtitle: '奢品限时购',
                pic: require('./images/normalProduct/product/7.png'),
                flex: 1,
            },
            {
                bigFont: false,
                title: '品牌清仓',
                subtitle: '好货超便宜',
                pic: require('./images/normalProduct/product/8.png'),
                flex: 1,
            },]
    },
    {
        title: '特色好货',
        icon: require('./images/normalProduct/icon/tesehaohuo.png'),
        more: true,
        products: [
            {
                bigFont: true,
                title: '全球购',
                iconText: 'GLOBAL',
                subtitle: '探索全球美好生活',
                pic: require('./images/normalProduct/product/9.png'),
                flex: 1.8,
            },
            {
                bigFont: false,
                title: '淘宝汇吃',
                subtitle: '美食任性吃',
                pic: require('./images/normalProduct/product/10.png'),
                flex: 1,
            },
            {
                bigFont: false,
                title: '极有家',
                subtitle: '造有品的家',
                pic: require('./images/normalProduct/product/11.png'),
                flex: 1,
            },
            {
                bigFont: false,
                title: '拍卖',
                subtitle: '1元起检漏',
                pic: require('./images/normalProduct/product/12.png'),
                flex: 1,
            },
            {
                bigFont: true,
                title: '中国质造',
                iconText: 'CHINA',
                subtitle: '好货不贵 质选良品',
                pic: require('./images/normalProduct/product/13.png'),
                flex: 1.8,
            },
            {
                bigFont: false,
                title: '医药健康',
                subtitle: '脱发选曼迪',
                pic: require('./images/normalProduct/product/14.png'),
                flex: 1,
            },
            {
                bigFont: false,
                title: '淘宝众筹',
                subtitle: '折叠自行车',
                pic: require('./images/normalProduct/product/15.png'),
                flex: 1,
            },
            {
                bigFont: false,
                title: '每日新品',
                subtitle: '找新品戳我',
                pic: require('./images/normalProduct/product/16.png'),
                flex: 1,
            },
        ],
    },

];

module.exports.HIGHLIGHT_PRODUCTS = HIGHLIGHT_PRODUCTS;
module.exports.NORMAL_PRODUCT_GROUPS = NORMAL_PRODUCT_GROUPS;
