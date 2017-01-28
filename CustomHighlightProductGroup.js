import React, {Component, PropTypes} from 'react';
import {View, Text, Image, Dimensions, StyleSheet} from 'react-native';

import CustomHighlightProduct from './CustomHighlightProduct';
import CustomAreaDivider from './CustomAreaDivider';

import PRODUCT_DATA from './ProductData';
const HIGHLIGHT_PRODUCTS = PRODUCT_DATA.HIGHLIGHT_PRODUCTS;

// 首页明星商品按钮组成的组
export default class CustomHighlightProductGroup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewWidth: 0,
            viewHeight: 0,
        };
    }

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

    getHighlightProduct(index: number, product: object) {

        let productStyle = {
            width: this.state.viewWidth / 2,
            height: this.state.viewWidth * 1 / 3,
        };

        // 边线是否显示的控制，因为边线是梯形的，所以每条分割线都要由两条边线组成
        // 才能保证中心是齐的
        let borderProps = {
            borderTopOn: index == 2 || index == 3,
            borderLeftOn: index == 1 || index == 3,
            borderRightOn: index == 0 || index == 2,
            borderBottomOn: index == 0 || index == 1,
        };

        return (
            <CustomHighlightProduct
                style={[styles.product, productStyle]}
                title={product.title}
                titleColor={product.titleColor}
                subtitle={product.subtitle}
                icon={product.icon}
                mainPic={product.mainPic}
                subPic={product.subPic }
                countDown={product.countDown}
                {...borderProps}
            />
        );
    }

    render() {

        return (
            <View
                style={[this.props.style, styles.container]}
                onLayout={this.onLayout.bind(this)}
            >
                <CustomAreaDivider/>
                <View
                    style={styles.row}
                >
                    {this.getHighlightProduct(0, HIGHLIGHT_PRODUCTS[0])}
                    {this.getHighlightProduct(1, HIGHLIGHT_PRODUCTS[1])}
                </View>
                <View
                    style={styles.row}
                >
                    {this.getHighlightProduct(2, HIGHLIGHT_PRODUCTS[2])}
                    {this.getHighlightProduct(3, HIGHLIGHT_PRODUCTS[3])}
                </View>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {},
    row: {
        flexDirection: 'row',
    },
    product: {},
});
