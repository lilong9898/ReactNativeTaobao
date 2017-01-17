import React, {Component, PropTypes} from 'react';
import {View, StyleSheet, Animated, ART} from "react-native";

// 圆弧的延伸方向为顺时针
const CIRCLE_SPAN_DIRECTION_CLOCKWISE = "clockwise";
// 圆弧的延伸方向为逆时针
const CIRCLE_SPAN_DIRECTION_COUNTERCLOCKWISE = "counterclockwise";

// 默认的圆弧线宽
const DEFAULT_CIRCLE_STROKE_WIDTH = 2;
// 默认的圆弧颜色
const DEFAULT_CIRCLE_COLOR = 'black';
// 默认的圆弧起点的弧度位置，从圆心正上方起算，以弧度计，[0, 2π]
const DEFAULT_CIRCLE_START_RADIAN_POS = 0;
// 默认的圆弧的延伸弧度，以弧度计，[0, 2π]
const DEFAULT_CIRCLE_SPAN_RADIAN = 2 * Math.PI;
// 默认的圆弧的延伸方向：顺时针，逆时针，这个属性也决定了arcStartRadianPos的起算方向，两者相同
const DEFAULT_CIRCLE_SPAN_DIRECTION = CIRCLE_SPAN_DIRECTION_COUNTERCLOCKWISE;

const path = new ART.Path();

// 圆圈形进度条
export default class CustomCircularProgressBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            //圆弧延展的角度
            circleSpanRadian: 0,
            viewWidth: 0,
            viewHeight: 0,
        };

    }

    componentDidMount() {

        if (this.props.scrollValue == null) {
            return;
        }

        // 给scrollValue加监听器,以便外界可以用异步方式监听它的值(文档中表示无法以同步方式直接读取)
        this.scrollValueNumberListener = this.props.scrollValue.addListener(
            (state) => {

                let progress = Math.max(0, Math.min(state.value / this.props.thresholdPullingHold, 1));
                let circleSpanRadian = 2 * Math.PI * progress;

                if (this.state.circleSpanRadian != circleSpanRadian)
                    this.setState({
                        circleSpanRadian: circleSpanRadian,
                    });
            }
        );
    }

    componentWillMount() {
        this.props.scrollValue && this.props.scrollValue.removeListener(this.scrollValueNumberListener);
    }

    static propTypes = {
        // 从pullToRefreshView输入的scrollValue
        scrollValue: React.PropTypes.instanceOf(Animated.Value),
        // 从pullToRefreshView输入的进入PULLING_HOLD状态的滑动门限
        thresholdPullingHold: React.PropTypes.number,
        // 圆弧半径
        circleRadius: React.PropTypes.number.isRequired,
        // 圆弧圆心相对控件左上角的x位置，不指定的话设置为控件中心
        circleCenterX: React.PropTypes.number,
        // 圆弧圆心相对控件左上角的y位置，不指定的话设置为控件中心
        circleCenterY: React.PropTypes.number,
        // 圆弧线宽
        circleStrokeWidth: React.PropTypes.number,
        // 圆弧颜色
        circleColor: React.PropTypes.string,
        // 圆弧起点的弧度位置，从圆心正上方起算，以弧度计，[0, 2π]
        circleStartRadianPos: React.PropTypes.number,
        // 圆弧的延伸弧度，以弧度计，[0, 2π]
        circleSpanRadian: React.PropTypes.number,
        // 圆弧的延伸方向：顺时针，逆时针，这个属性也决定了arcStartRadianPos的起算方向，两者相同
        circleSpanDirection: React.PropTypes.oneOf([CIRCLE_SPAN_DIRECTION_CLOCKWISE, CIRCLE_SPAN_DIRECTION_COUNTERCLOCKWISE]),
    }

    static defaultProps = {
        circleStrokeWidth: DEFAULT_CIRCLE_STROKE_WIDTH,
        circleColor: DEFAULT_CIRCLE_COLOR,
        circleStartRadianPos: DEFAULT_CIRCLE_START_RADIAN_POS,
        circleSpanRadian: DEFAULT_CIRCLE_SPAN_RADIAN,
        circleSpanDirection: DEFAULT_CIRCLE_SPAN_DIRECTION,
    }

    componentWillReceiveProps(nextProps) {

        if (this.state.circleSpanRadian != nextProps.circleSpanRadian) {
            this.setState({
                circleSpanRadian: nextProps.circleSpanRadian,
            });
        }
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

        // 圆心x坐标相对控件左边的距离
        let centerX = this.state.viewWidth / 2;
        // 圆心y坐标相对控件上边的距离
        let centerY = this.state.viewHeight / 2;

        // 起始角度
        let startRadianPos = this.props.circleStartRadianPos;
        //　延续角度, 如果没有输入scrollValue, 则用props中的
        let spanRadian = (this.props.scrollValue == null) ? this.props.circleSpanRadian : this.state.circleSpanRadian;
        // 计算和画弧的方向
        let spanDirection = this.props.circleSpanDirection;
        // 半径
        let radius = this.props.circleRadius;

        // 圆弧起点坐标, 也是相对控件左边和上边距离
        let arcStartX, arcStartY;
        // 圆弧的终点坐标，也是相对距离
        let arcEndX, arcEndY;

        // 逆时针算的圆弧
        if (spanDirection == CIRCLE_SPAN_DIRECTION_COUNTERCLOCKWISE) {
            arcStartX = centerX - radius * Math.sin(startRadianPos);
            arcStartY = centerY - radius * Math.cos(startRadianPos);
            arcEndX = centerX - radius * Math.sin(startRadianPos + spanRadian);
            arcEndY = centerY - radius * Math.cos(startRadianPos + spanRadian);
        }
        // 顺时针算的圆弧
        else if (spanDirection == CIRCLE_SPAN_DIRECTION_CLOCKWISE) {
            arcStartX = centerX + radius * Math.sin(startRadianPos);
            arcStartY = centerY - radius * Math.cos(startRadianPos);
            arcEndX = centerX + radius * Math.sin(startRadianPos + spanRadian);
            arcEndY = centerY - radius * Math.cos(startRadianPos + spanRadian);
        }

        // 是否为逆时针
        let isCounterClockwise = this.props.circleSpanDirection == CIRCLE_SPAN_DIRECTION_COUNTERCLOCKWISE;

        // 是否画大弧，即大于１８０°的弧
        let isBigArc = spanRadian > Math.PI;

        // arcTo方法的最后一个参数含义不知，但看上去应该一直是true才对
        // 这里不要new Path(), render多了之后似乎有内存泄露问题会导致crash
        path.reset();
        path.moveTo(arcStartX, arcStartY).arcTo(arcEndX, arcEndY, radius, radius, isBigArc, isCounterClockwise, true);

        return (
            <View style={this.props.style} onLayout={this.onLayout.bind(this)}>
                <ART.Surface width={this.state.viewWidth} height={this.state.viewHeight}>
                    <ART.Shape d={path} stroke={this.props.circleColor} strokeWidth={this.props.circleStrokeWidth}/>
                </ART.Surface>
            </View>
        );
    }
}
