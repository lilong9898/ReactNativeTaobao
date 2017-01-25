import React, {Component, PropTypes} from 'react';
import {View, Text, Image, Dimensions, StyleSheet} from 'react-native';

import CustomSaleButton from './CustomSaleButton';
import SALE_DATA from './SaleDataArray';

// 首页商品按钮组成的组
export default class CustomWaterFlowGroup extends Component {

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

    render() {

        // let labelIndex = Math.round(Math.random(SALE_DATA.labels.length - 1));
        // let imageIndex = Math.round(Math.random(SALE_DATA.images.length - 1));

        let saleButtonStyle = {
            width: this.state.viewWidth / 3,
            height: this.state.viewWidth * 2 / 3,
        };

        return (
            <View
                style={[this.props.style, styles.container]}
                onLayout={this.onLayout.bind(this)}
            >
                <CustomSaleButton
                    style={[styles.saleButton, saleButtonStyle]}
                    title={SALE_DATA.labels[0].title}
                    subtitle={SALE_DATA.labels[0].subtitle}
                    icon={SALE_DATA.labels[0].icon}
                    image={SALE_DATA.images[0]}
                />
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {},
    saleButton: {
        backgroundColor: 'cyan',
    },
});
