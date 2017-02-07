import React, {Component, PropTypes} from 'react';
import {View, Text, Image, Dimensions, StyleSheet} from 'react-native';

import CustomFunctionButton from './CustomFunctionButton';
import DATA_ARRAY from '../data/FunctionButtonData';

// 按钮行数
const ROW_COUNT = 2;
// 按钮列数
const COLUMN_COUNT = 5;

// 轮播广告下的功能按钮组成的组
export default class CustomFunctionGroup extends Component {

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

    // 获取单个functionButton
    getFunctionButton(key: number, icon: number, text: string, onClick: func) {

        let functionButtonStyle = {
            width: this.state.viewWidth / COLUMN_COUNT,
            height: this.state.viewHeight / ROW_COUNT,
        };

        return (
            <CustomFunctionButton
                key={key}
                style={functionButtonStyle}
                icon={icon}
                text={text}
                onClick={onClick}
            />
        );
    }

    render() {

        let functionButtons = [];

        for (let i = 0; i < DATA_ARRAY.length; i++) {
            functionButtons.push(
                this.getFunctionButton(i, DATA_ARRAY[i].icon, DATA_ARRAY[i].text, null)
            )
        }

        return (
            <View
                style={[this.props.style, styles.container]}
                onLayout={this.onLayout.bind(this)}
            >
                {functionButtons}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});
