//功能区的分隔线
import React, {Component, PropTypes} from 'react';
import {View, Text, Image, Dimensions, StyleSheet} from 'react-native';

export default class CustomAreaDivider extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewWidth: 0,
            viewHeight: 0,
        };

    }

    static propTypes = {
        // 分隔线的上边线宽度
        upperLineStrokeWidth: React.PropTypes.number,
        // 分隔线的上边线颜色
        upperLineColor: React.PropTypes.string,
        // 分隔线的中间线宽度
        middleLineStrokeWidth: React.PropTypes.number,
        // 分隔线的中间线的颜色
        middleLineColor: React.PropTypes.string,
        // 分隔线的下边线宽度
        lowerLineStrokeWidth: React.PropTypes.number,
        // 分隔线的下边线颜色
        lowerLineColor: React.PropTypes.string,
    };

    static defaultProps = {
        upperLineStrokeWidth: 1,
        upperLineColor: '#c0c0c0',
        middleLineStrokeWidth: 8,
        middleLineColor: '#e0e0e0',
        lowerLineStrokeWidth: 0,
        lowerLineColor: '#cccccc',
    };

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

        let containerStyle = {
            height: this.props.upperLineStrokeWidth + this.props.middleLineStrokeWidth + this.props.lowerLineStrokeWidth,
        };

        let upperLineStyle = {
            height: this.props.upperLineStrokeWidth,
            backgroundColor: this.props.upperLineColor,
        };

        let middleLineStyle = {
            height: this.props.middleLineStrokeWidth,
            backgroundColor: this.props.middleLineColor,
        };

        let lowerLineStyle = {
            height: this.props.lowerLineStrokeWidth,
            backgroundColor: this.props.lowerLineColor,
        };
        return (
            <View
                style={[this.props.style, styles.container, containerStyle]}
                onLayout={this.onLayout.bind(this)}
            >
                <View
                    style={upperLineStyle}
                />
                <View
                    style={middleLineStyle}
                />
                <View
                    style={lowerLineStyle}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
    },
});
