import React, {Component, PropTypes} from 'react';
import {View, StyleSheet, ART} from "react-native";

// 圆弧的延伸方向为顺时针
const ARC_SPAN_DIRECTION_CLOCKWISE = "arc_span_direction_clockwise";
// 圆弧的延伸方向为逆时针
const ARC_SPAN_DIRECTION_COUNTERCLOCKWISE = "arc_span_direction_counterclockwise";

// 圆圈形下拉刷新状态指示条
export default class CustomPullToRefreshIndicator extends Component{

    constructor(props) {
        super(props);

        this.state = {
            viewWidth: 0,
            viewHeight: 0,
        };
    }

    static propTypes = {
        // 圆弧起点的弧度位置，从圆心正上方起算，以弧度计，[0, 2π]
        arcStartRadianPos: React.PropTypes.number,
        // 圆弧的延伸弧度，以弧度计，[0, 2π]
        arcSpanRadian: React.PropTypes.number,
        // 圆弧的延伸方向：顺时针，逆时针，这个属性也决定了arcStartRadianPos的起算方向
        arcSpanDirection: React.PropTypes.oneOf([ARC_SPAN_DIRECTION_CLOCKWISE, ARC_SPAN_DIRECTION_COUNTERCLOCKWISE]),
    }

    static defaultProps = {
        arcStartRadianPos: 0,
        arcSpanRadian: 2 * Math.PI,
        arcSpanDirection: ARC_SPAN_DIRECTION_COUNTERCLOCKWISE,
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

        const path = new ART.Path().
        moveTo(50, 5).
        arc(0, 30, 5);
        // arc(0, -99, 25);
        // close();

        return (
            <View style={this.props.style} onLayout={this.onLayout.bind(this)} >
                <ART.Surface width={100} height={100} style={{backgroundColor:'red'}}>
                    <ART.Shape d={path} stroke="#000000" strokeWidth={5}/>
                </ART.Surface>
            </View>
        );
    }
}
