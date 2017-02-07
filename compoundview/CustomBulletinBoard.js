import React, {Component, PropTypes} from 'react';
import {View, Text, Image, Dimensions, StyleSheet} from 'react-native';

import CustomViewPager from '../view/CustomViewPager';

// 淘宝头条图标
const TAOBAOTOUTIAO_IMG = require('./../images/bulletin/taobaotoutiao.png');
// 公告板的消息类型和文字
import news from '../data/BulletinData';

// 淘宝头条公告板
export default class CustomBulletinBoard extends Component {

    constructor(props) {
        super(props);

        let dataSource = new CustomViewPager.DataSource({
            pageHasChanged: (p1, p2) => p1 !== p2,
        });

        this.state = {
            viewWidth: 0,
            viewHeight: 0,
            dataSource: dataSource.cloneWithPages(news),
        };

    }

    onLayout(event) {

        // 获取view的宽度
        let viewWidth = event.nativeEvent.layout.width;
        // 获取view的高度
        let viewHeight = event.nativeEvent.layout.height;

        // 若view的宽度或高度为空，或者宽高跟原来完全一样
        if (!viewWidth || !viewHeight || (this.state.viewWidth === viewWidth && this.state.viewHeight === viewHeight)) {
            return;
        }

        // 向state中更新最新的view宽度
        this.setState({
            viewWidth: viewWidth,
            viewHeight: viewHeight,
        });
    }

    getViewPagerPage(pageKey: string, pageIndex: number, data: object, viewPagerWidth: number, viewPagerHeight: number) {

        let typeStyle = {
            width: Math.min(Math.max(viewPagerWidth * 0.2, 40), 200),
        };

        let textStyle = {
            flex: 1,
            marginLeft: 5,
        };

        return (

            <View
                style={styles.viewPagerPage}
                key={pageKey}
            >
                <View
                    style={{flex:1, flexDirection: 'row', marginTop: 3, marginBottom: 3}}
                >
                    <Text
                        style={[styles.viewPagerPageType, typeStyle]}
                    >
                        {data.upper.type}
                    </Text>
                    <Text
                        style={[styles.viewPagerPageText, textStyle]}
                        ellipsizeMode='tail'
                        numberOfLines={1}
                    >
                        {data.upper.text}
                    </Text>
                </View>
                <View
                    style={{flex:1, flexDirection: 'row', marginBottom: 3}}
                >
                    <Text
                        style={[styles.viewPagerPageType, typeStyle]}
                    >
                        {data.lower.type}
                    </Text>
                    <Text
                        style={[styles.viewPagerPageText, textStyle]}
                        ellipsizeMode='tail'
                        numberOfLines={1}
                    >
                        {data.lower.text}
                    </Text>
                </View>
            </View>
        );
    }

    render() {

        let imgHeight = this.state.viewHeight * 0.6;
        let imgWidth = 4 * imgHeight;

        let imgStyle = {
            width: imgWidth,
            height: imgHeight,
            marginLeft: 6,
        };

        let dividerStyle = {
            width: 1,
            height: this.state.viewHeight * 0.8,
            marginLeft: 6,
            marginRight: 6,
        };

        let viewPagerStyle = {
            flex: 1,
            height: this.state.viewHeight * 0.9,
            marginRight: this.state.viewHeight * 0.1,
        };

        return (
            <View
                style={[this.props.style, styles.container]}
                onLayout={this.onLayout.bind(this)}
            >
                <Image
                    style={[styles.img, imgStyle]}
                    source={TAOBAOTOUTIAO_IMG}
                />
                <View
                    style={[styles.divider, dividerStyle]}
                />
                <CustomViewPager
                    style={[styles.viewPager, viewPagerStyle]}
                    dataSource={this.state.dataSource}
                    renderPageIndicator={false}
                    renderPage={this.getViewPagerPage.bind(this)}
                    slideDirection='vertical'
                    autoPlay={true}
                    isLoop={true}
                    slideIntervalMs={2000}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    img: {
    },
    divider: {
        backgroundColor: 'gray',
    },
    viewPager: {
    },
    viewPagerPage: {
        flex: 1,
    },
    viewPagerPageType: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'red',
        borderWidth: 1.5,
        borderColor: 'red',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    },
    viewPagerPageText: {
        textAlign: 'left',
        textAlignVertical: 'center',
    },
});
