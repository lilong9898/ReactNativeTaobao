import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    Image,
    ListView,
    Dimensions,
    StyleSheet
} from 'react-native';

import GLOBAL_UI_SETTING from '../global/GlobalUISetting';

const PADDING = 4;

export default class CustomProduct extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewWidth: 0,
            viewHeight: 0,
        }
    }

    static propTypes = {
        bigFont: React.PropTypes.bool.isRequired,
        title: React.PropTypes.string.isRequired,
        iconText: React.PropTypes.string,
        subtitle: React.PropTypes.string.isRequired,
        pic: React.PropTypes.number.isRequired,
        borderTopOn: React.PropTypes.bool,
        borderLeftOn: React.PropTypes.bool,
        borderRightOn: React.PropTypes.bool,
        borderBottomOn: React.PropTypes.bool,
    };

    static defaultProps = {
        bigFont: false,
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

    getIconText(rowHeight: number) {

        let height = rowHeight * 0.9;

        // iconText
        let iconText = {
            fontSize: rowHeight * 0.5,
            width: rowHeight * 2.3,
            height: height,
            borderTopLeftRadius: height / 2,
            borderTopRightRadius: height / 2,
            borderBottomLeftRadius: height / 2,
            borderBottomRightRadius: height / 2,
        };

        if (this.props.iconText) {
            return (
                <Text
                    style={[styles.iconText, iconText]}
                >
                    {this.props.iconText}
                </Text>
            );
        } else {
            return null;
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
            fontSize: this.props.bigFont ? titleRowHeight * 0.7 : titleRowHeight * 0.6,
        };

        // sub title栏的尺寸
        let subtitleRowHeight = Math.min(Math.max(viewContentHeight * 0.15, 0), viewContentHeight);
        let subtitleRowStyle = {
            height: subtitleRowHeight,
        };

        // sub title
        let subtitleStyle = {
            fontSize: this.props.bigFont ? subtitleRowHeight * 0.7 : subtitleRowHeight * 0.6,
            color: this.props.bigFont ? 'red' : 'gray',
        };

        // 图的尺寸
        let picHeight = viewContentHeight - titleRowHeight - subtitleRowHeight;
        let picStyle = {
            width: viewContentWidth * 0.9,
            height: picHeight * 0.9,
        };

        return (
            <View
                style={[this.props.style, styles.container, containerStyle]}
                onLayout={this.onLayout.bind(this)}
            >
                <View
                    style={[styles.titleRow, titleRowStyle]}
                >
                    <Text
                        style={[styles.title, titleStyle]}
                    >
                        {this.props.title}
                    </Text>
                    {this.getIconText(titleRowHeight)}
                </View>
                <View
                    style={[styles.subtitleRow, subtitleRowStyle]}
                >
                    <Text
                        style={[styles.subtitle, subtitleStyle]}
                    >
                        {this.props.subtitle}
                    </Text>
                </View>
                <View
                    style={{flex:1}}
                />
                <Image
                    style={[styles.pic, picStyle]}
                    source={this.props.pic}
                    resizeMode="contain"
                />
                <View
                    style={{flex:1}}
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
        // backgroundColor: 'yellow',
        padding: PADDING,
    },
    titleRow: {
        // backgroundColor: 'orange',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    title: {
        fontWeight: 'bold',
        // backgroundColor: 'blue',
    },
    iconText: {
        color: 'red',
        borderWidth: 1.5,
        marginLeft: 3,
        borderColor: 'red',
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
        // backgroundColor: 'blue',
        alignSelf: 'center',
    },
    subtitleRow: {
        // backgroundColor: 'red',
        justifyContent: 'flex-end',
    },
    subtitle: {
        // backgroundColor: 'cyan',
    },
    pic: {
        alignSelf: 'center',
        // backgroundColor: 'black',
    },
});
