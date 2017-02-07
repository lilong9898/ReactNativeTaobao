import React, {Component, PropTypes} from 'react';
import {View, Text, Image, Dimensions, StyleSheet} from 'react-native';

import CustomProduct from './CustomProduct';

import GLOBAL_UI_SETTING from '../global/GlobalUISetting';

// 首页的普通商品组
export default class CustomProductGroup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewWidth: 0,
            viewHeight: 0,
        };
    }

    static propTypes = {
        title: React.PropTypes.string.isRequired,
        icon: React.PropTypes.number.isRequired,
        more: React.PropTypes.bool.isRequired,
        products: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
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

    getProduct(index: number, product: object) {

        let productStyle = {
            flex: product.flex,
            height: this.state.viewWidth * 1 / 3,
        };

        // 边线是否显示的控制，因为边线是梯形的，所以每条分割线都要由两条边线组成
        // 才能保证中心是齐的
        let borderProps = {
            borderTopOn: true,
            borderLeftOn: (index >= 1 && index <= 3) || (index >= 5),
            borderRightOn: (index <= 2) || (index >= 4 && index <= 6),
            borderBottomOn: index < 4,
        };

        return (
            <CustomProduct
                style={[styles.product, productStyle]}
                bigFont={product.bigFont}
                title={product.title}
                iconText={product.iconText}
                subtitle={product.subtitle}
                pic={product.pic}
                {...borderProps}
            />
        );
    }

    render() {

        let titleRowHeight = Math.min(Math.max(this.state.viewWidth * 0.08, 0), this.state.viewWidth);
        let titleRowStyle = {
            height: titleRowHeight,
            borderBottomWidth: 1,
            borderBottomColor: GLOBAL_UI_SETTING.BORDER_COLOR,
        };

        let iconDimension = 0.7 * titleRowHeight;
        let iconStyle = {
            width: iconDimension,
            height: iconDimension,
        };

        let titleStyle = {
            fontSize: 0.55 * titleRowHeight,
        }

        return (
            <View
                style={[this.props.style, styles.container]}
                onLayout={this.onLayout.bind(this)}
            >
                <View
                    style={[styles.titleRow, titleRowStyle]}
                >
                    <Image
                        style={[styles.icon, iconStyle]}
                        resizeMode='contain'
                        source={this.props.icon}
                    />
                    <Text
                        style={[styles.title, titleStyle]}
                    >
                        {this.props.title}
                    </Text>
                </View>
                <View
                    style={styles.row}
                >
                    {this.getProduct(0, this.props.products[0])}
                    {this.getProduct(1, this.props.products[1])}
                    {this.getProduct(2, this.props.products[2])}
                    {this.getProduct(3, this.props.products[3])}
                </View>
                <View
                    style={styles.row}
                >
                    {this.getProduct(4, this.props.products[4])}
                    {this.getProduct(5, this.props.products[5])}
                    {this.getProduct(6, this.props.products[6])}
                    {this.getProduct(7, this.props.products[7])}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'orange',
    },
    title: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'red',
    },
    icon: {
        marginRight: 5,
        // backgroundColor: 'blue',
    },
    row: {
        flexDirection: 'row',
    },
    product: {},
});