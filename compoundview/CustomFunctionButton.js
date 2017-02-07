import React, {Component, PropTypes} from 'react';
import {View, Text, Image, TouchableOpacity, Dimensions, StyleSheet} from 'react-native';

// 首页轮播广告下的功能按钮
export default class CustomFunctionButton extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewWidth: 0,
            viewHeight: 0,
            icon: this.props.icon,
            text: this.props.text,
        };
    }

    static propTypes = {
        // 图标
        icon: React.PropTypes.number.isRequired,
        // 文字
        text: React.PropTypes.string.isRequired,
        // 点击响应
        onClick: React.PropTypes.func,
    }

    componentWillReceiveProps(nextProps) {

        if (this.state.icon == nextProps.icon && this.state.text == nextProps.text) {
            return;
        }

        this.setState({
            icon: nextProps.icon,
            text: nextProps.text,
        });
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

    render() {

        let iconDimension = Math.min(this.state.viewWidth * 0.7, this.state.viewHeight * 0.7);

        let iconStyle = {
            width: iconDimension,
            height: iconDimension,
        };

        return (
            <TouchableOpacity
                style={[this.props.style, styles.container]}
                activeOpacity={0.8}
                onLayout={this.onLayout.bind(this)}
                onPress={this.props.onClick}
            >
                    <Image
                        style={[styles.icon, iconStyle]}
                        source={this.props.icon}
                        resizeMode='stretch'
                    />

                    <Text
                        style={styles.text}
                    >
                        {this.state.text}
                    </Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        marginBottom: 5,
    },
    text: {},
});
