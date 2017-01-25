import React, {Component, PropTypes} from 'react';
import {View, Text, Image, Dimensions, StyleSheet} from 'react-native';

// 首页商品按钮
export default class CustomSaleButton extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewWidth: 0,
            viewHeight: 0,
        };
    }

    static propTypes = {
        title: React.PropTypes.string.isRequired,
        subtitle: React.PropTypes.string.isRequired,
        icon: React.PropTypes.number.isRequired,
        image: React.PropTypes.number.isRequired,
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

    render() {

        // 小图标的尺寸
        let iconDimension = Math.min(Math.max(this.state.viewWidth * 0.1, 30), 50);
        let iconStyle = {
            width: iconDimension,
            height: iconDimension,
        };

        // 大图的尺寸
        let imageWidth = Math.min(Math.max(this.state.viewWidth * 0.5, 50), 200);
        let imageHeight = Math.min(Math.max(this.state.viewHeight * 0.5, 50), 300);
        let imageStyle = {
            width: imageWidth,
            height: imageHeight,
        };

        return (
            <View
                style={[this.props.style, styles.container]}
                onLayout={this.onLayout.bind(this)}
            >
                <View
                    style={styles.titleRow}
                >
                    <Image
                        style={[styles.icon, iconStyle]}
                        source={this.props.icon}
                        resizeMode='stretch'
                    />
                    <Text
                        style={[styles.title]}
                    >
                        {this.props.title}
                    </Text>
                </View>
                <View
                    style={[styles.subtitleRow]}
                >
                    <Text
                        style={styles.subtitle}
                    >
                        {this.props.subtitle}
                    </Text>
                </View>
                <Image
                    style={[styles.image, imageStyle]}
                    source={this.props.image}
                    resizeMode='stretch'
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'green',
    },
    titleRow: {
        flexDirection: 'row',
        backgroundColor: 'cyan',
    },
    icon: {
        marginRight: 5,
    },
    title: {},
    subtitleRow: {
        backgroundColor: 'red',
    },
    subtitle: {},
    image: {},
});
