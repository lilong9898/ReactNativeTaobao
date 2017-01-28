import React, {Component, PropTypes} from 'react';
import {View, Text, Image, Dimensions, StyleSheet} from 'react-native';

import CustomCountDownClock from './CustomCountDownClock';

import GLOBAL_UI_SETTING from './GlobalUISetting';

const PADDING = 4;

// 首页明星商品按钮
export default class CustomHighlightProduct extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewWidth: 0,
            viewHeight: 0,
        };
    }

    static propTypes = {
        title: React.PropTypes.string.isRequired,
        titleColor: React.PropTypes.string.isRequired,
        subtitle: React.PropTypes.string.isRequired,
        icon: React.PropTypes.number.isRequired,
        mainPic: React.PropTypes.number.isRequired,
        subPic: React.PropTypes.number.isRequired,
        countDown: React.PropTypes.object.isRequired,
        borderTopOn: React.PropTypes.bool,
        borderLeftOn: React.PropTypes.bool,
        borderRightOn: React.PropTypes.bool,
        borderBottomOn: React.PropTypes.bool,
    };

    static defaultProps = {
        borderTopOn: false,
        borderLeftOn: false,
        borderRightOn: false,
        borderBottomOn: false,
    };

    onLayout(event) {

        // 获取view的宽度
        let viewWidth = event.nativeEvent.layout.width;
        // 获取view的高度
        let viewHeight = event.nativeEvent.layout.height;

        // 若view的宽度或高度为空，或者宽高跟原来完全一样
        if (!viewWidth || !viewHeight || (this.state.viewWidth == viewWidth && this.state.viewHeight == viewHeight)) {
            return;
        }

        // 向state中更新最新的view宽度
        this.setState({
            viewWidth: viewWidth,
            viewHeight: viewHeight,
        });
    }

    // 如果有倒计时，subtitle栏显示倒计时时钟，否则显示subtitle文字
    getSubtitleRowContent(subtitleRowHeight: number) {

        // sub title
        let subtitleStyle = {
            fontSize: subtitleRowHeight * 0.8,
        };

        // 有倒计时
        if (this.props.countDown && this.props.countDown.show) {
            return (
                <CustomCountDownClock
                    digitFontSize={subtitleRowHeight * 0.5}
                    hour={this.props.countDown.hour}
                    min={this.props.countDown.min}
                    sec={this.props.countDown.sec}/>
            );
        }
        // 无倒计时
        else {
            return (
                <Text
                    style={[styles.subtitle, subtitleStyle]}
                    numberOfLines={1}
                >
                    {this.props.subtitle}
                </Text>
            );
        }
    }

    render() {

        let viewContentWidth = this.state.viewWidth - 2 * PADDING;
        let viewContentHeight = this.state.viewHeight - 2 * PADDING;

        // container的边线控制
        let containerStyle = {
            borderTopColor: this.props.borderTopOn ? GLOBAL_UI_SETTING.BORDER_COLOR : GLOBAL_UI_SETTING.BACKGROUND_COLOR,
            borderLeftColor: this.props.borderLeftOn ? GLOBAL_UI_SETTING.BORDER_COLOR : GLOBAL_UI_SETTING.BACKGROUND_COLOR,
            borderRightColor: this.props.borderRightOn ? GLOBAL_UI_SETTING.BORDER_COLOR : GLOBAL_UI_SETTING.BACKGROUND_COLOR,
            borderBottomColor: this.props.borderBottomOn ? GLOBAL_UI_SETTING.BORDER_COLOR : GLOBAL_UI_SETTING.BACKGROUND_COLOR,
        };

        // title栏的尺寸
        let titleRowHeight = Math.min(Math.max(viewContentHeight * 0.2, 0), viewContentHeight);
        let titleRowStyle = {
            height: titleRowHeight,
        };

        // title
        let titleStyle = {
            color: this.props.titleColor,
            fontSize: titleRowHeight * 0.7,
        };

        // 小图标的尺寸
        let iconDimension = Math.min(Math.max(titleRowHeight * 0.8, 0), viewContentHeight);
        let iconStyle = {
            width: iconDimension,
            height: iconDimension,
        };

        // sub title栏的尺寸
        let subtitleRowHeight = Math.min(Math.max(viewContentHeight * 0.15, 0), viewContentHeight);
        let subtitleRowStyle = {
            height: subtitleRowHeight,
        };

        // 图栏的尺寸
        let picRowHeight = viewContentHeight - titleRowHeight - subtitleRowHeight;
        let picRowStyle = {
            height: picRowHeight,
        };

        // 主图的尺寸
        let mainPicStyle = {
            width: viewContentWidth * 0.5,
            height: picRowHeight,
        };

        // 副图的尺寸
        let subPicStyle = {
            width: viewContentWidth * 0.5,
            height: picRowHeight,
        };

        return (
            <View
                style={[this.props.style, styles.container, containerStyle]}
                onLayout={this.onLayout.bind(this)}
            >
                <View
                    style={[styles.titleRow, titleRowStyle]}
                >
                    <Image
                        style={[styles.icon, iconStyle]}
                        source={this.props.icon}
                        resizeMode='stretch'
                    />
                    <Text
                        style={[styles.title, titleStyle]}
                        numberOfLines={1}
                    >
                        {this.props.title}
                    </Text>
                </View>
                <View
                    style={[styles.subtitleRow, subtitleRowStyle]}
                >
                    {this.getSubtitleRowContent(subtitleRowHeight)}
                </View>
                <View
                    style={[styles.picRow, picRowStyle]}
                >
                    <Image
                        style={[styles.mainPic, mainPicStyle]}
                        source={this.props.mainPic}
                        resizeMode='contain'
                    />
                </View>
                <Image
                    style={[styles.subPic, subPicStyle]}
                    source={this.props.subPic}
                    resizeMode='contain'
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: GLOBAL_UI_SETTING.BORDER_WIDTH,
        borderLeftWidth: GLOBAL_UI_SETTING.BORDER_WIDTH,
        borderRightWidth: GLOBAL_UI_SETTING.BORDER_WIDTH,
        borderBottomWidth: GLOBAL_UI_SETTING.BORDER_WIDTH,
        padding: PADDING,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
    },
    icon: {
        marginRight: 5,
    },
    title: {
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    subtitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
    },
    subtitle: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'gray',
    },
    picRow: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'cyan'
    },
    mainPic: {
        // backgroundColor: 'yellow',
    },
    subPic: {
        position: 'absolute',
        right: 5,
        bottom: 20,
        // backgroundColor: 'yellow',
    },
});
