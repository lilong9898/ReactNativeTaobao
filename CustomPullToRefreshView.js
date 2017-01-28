import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    RefreshControl,
    PanResponder,
    Animated,
    Easing,
    Dimensions,
    ScrollView,
    DeviceEventEmitter,
} from 'react-native';

import CustomCircularProgressBar from './CustomCircularProgressBar';

// pull to refresh的状态机
// 原始状态
const STATUS_RESET = 'status_reset';
// 滑动过程中，未过触发刷新所需的偏移量
const STATUS_PULLING = 'status_pulling';
// 滑动过程中，已过触发刷新所需的滑动距离，再下拉，控件滑动的距离最大达到status_area_height为止
const STATUS_PULLING_HOLD = 'status_pulling_hold';
// 松手后，控件回到刷新数据时的偏移位置的过程中
const STATUS_RELEASED_TO_REFRESH = 'status_released_to_refresh';
// 松手后，控件回到了刷新数据时的偏移位置，并在此停顿直到刷新完成
const STATUS_RELEASED_DURING_REFRESH = 'status_released_during_refresh';

// 默认的status area的高度
const DEFAULT_STATUS_AREA_HEIGHT = 200;
// 默认的PULLING_HOLD的状态时控件的偏移距离的门槛值
const DEFAULT_PULLING_HOLD_TRANSLATE_Y = 75;
// 默认的RELEASED_DURING_REFRESH的状态时控件的偏移距离
const DEFAULT_RELEASED_DURING_REFRESH_TRANSLATE_Y = 50;
// 默认的下拉响应最小滑动距离，避免过度灵敏时误触导致滑动
const DEFAULT_MIN_PULL_RESPONSE_DISTANCE = 0;
// 默认的status area的背景颜色
const DEFAULT_STATUS_AREA_BACKGROUND_COLOR = 'green';

// 上级节点通知pull to refresh刷新数据完成时用的消息tag
const TAG_NOTIFICATION_REFRESH_COMPLETE = "tag_notification_refresh_complete";

export default class CustomPullToRefreshView extends Component {

    constructor(props) {
        super(props);

        // scrollView的因滚动导致的偏移量
        this.scrollY = 0;

        this.state = {
            // 纵向滑动动画的驱动量，值为纵向滑动距离占viewHeight的比例
            // 0为statusArea刚好隐藏在屏幕上边时的滑动值，也是默认状态的值
            scrollValue: new Animated.Value(0),
            // 控件在状态机中的状态
            status: STATUS_RESET,
            // CustomPullToRefreshView的宽度
            viewWidth: 0,
            // CustomPullToRefreshView的高度
            viewHeight: 0,
            scrollEnabled: true,
        }
        ;

        this.THRESHOLD_PULLINGHOLD = this.props.pullingHoldTranslateY / this.props.statusAreaHeight;
    }

    static propTypes = {
        // statusIndicator所在区域，即statusArea的高度
        statusAreaHeight: React.PropTypes.number,
        // PULLING_HOLD的状态时控件的偏移距离的门槛值
        pullingHoldTranslateY: React.PropTypes.number,
        // RELEASED_DURING_REFRESH的状态时控件的偏移距离
        releasedDuringRefreshTranslateY: React.PropTypes.number,
        // 默认的下拉响应最小滑动距离，避免过度灵敏时误触导致滑动
        minPullResponseDistance: React.PropTypes.number,
        // statusArea的背景颜色
        statusAreaBackgroundColor: React.PropTypes.string,
        // 渲染statusIndicator所需的函数
        renderStatusIndicator: React.PropTypes.func,
        // 松手后自动滑动到某个位置的静止态用的动画函数，
        animation: React.PropTypes.func,
        // RELEASED_DURING_REFRESH的状态时刷新内容所用的函数
        onRefresh: React.PropTypes.func.isRequired,
    }

    static defaultProps = {
        statusAreaHeight: DEFAULT_STATUS_AREA_HEIGHT,
        pullingHoldTranslateY: DEFAULT_PULLING_HOLD_TRANSLATE_Y,
        releasedDuringRefreshTranslateY: DEFAULT_RELEASED_DURING_REFRESH_TRANSLATE_Y,
        minPullResponseDistance: DEFAULT_MIN_PULL_RESPONSE_DISTANCE,
        statusAreaBackgroundColor: DEFAULT_STATUS_AREA_BACKGROUND_COLOR,

        // 默认的获取在各位置之间自动滑动所用的动画的函数
        animation: (animatedValue, toValue) => {
            return Animated.spring(animatedValue, {
                toValue: toValue,
                friction: 10,
                tension: 50,
            });
        },

        // 默认的onRefresh函数
        onRefresh: (tag_notification_refresh_complete: string) => {
            // 立刻通知pull to refresh刷新数据完成
            DeviceEventEmitter.emit(tag_notification_refresh_complete);
        },
    }

    getStatus() {
        return this.state.status;
    }

    getScrollValue() {
        return this.state.scrollValue;
    }

    getEffectiveSlideDistance(gestureState) {

        //向下拉且过了下拉触发门限距离
        if (gestureState.dy >= this.props.minPullResponseDistance) {
            return gestureState.dy - this.props.minPullResponseDistance;
        }
        // 向上拉无触发门限，全部距离都响应
        else if (gestureState.dy < 0) {
            return gestureState.dy;
        }
        // 向下拉且未过触发门限距离，则有效距离为零
        else {
            return 0;
        }
    }

    getInEffectiveSlideDistance(gestureState) {
        return gestureState.dx;
    }

    getEffectiveSlideRatio(gestureState) {
        return this.getEffectiveSlideDistance(gestureState) / this.state.viewHeight;
    }

    // 上级节点通知pull to refresh刷新已完成
    // 状态机：RELEASED_DURING_REFRESH -> PULLING -> RESET
    notifyRefreshComplete() {

        this.setState({
            status: STATUS_PULLING,
        });

        this.props.animation(this.state.scrollValue, 0).start(
            (event) => {
                if (event.finished) {
                    this.setState({
                        status: STATUS_RESET,
                    });
                }
            }
        );
    }

    componentWillMount() {

        let onMoveShouldSetPanResponder = (e, gestureState) => {

            // 只有从RESET状态开始的滑动，才响应后续手势
            if (this.scrollY == 0
                && this.getStatus() == STATUS_RESET
                && gestureState.dy > 0) {
                return true;
            } else {
                return false;
            }
        };

        let onPanResponderMove = (e, gestureState) => {

            let effectiveSlideRatio = this.getEffectiveSlideRatio(gestureState);

            console.log('4');
            // 竖直方向上没有移动或向下移动太少，导致有效距离为零，忽略，不跟随移动
            if (effectiveSlideRatio == 0) {
                return;
            }

            console.log('3');
            //因滑动而迁移到的新的状态
            let newStatus;

            // 未到pulling hold状态
            if (effectiveSlideRatio < this.THRESHOLD_PULLINGHOLD) {
                newStatus = STATUS_PULLING;
            }
            // 已到pulling hold状态
            else {
                newStatus = STATUS_PULLING_HOLD;
            }

            this.state.scrollValue.setValue(effectiveSlideRatio);

            if (this.getStatus() != newStatus) {
                this.setState({
                    status: newStatus,
                });
            }
        };

        let onPanResponderRelease = (e, gestureState) => {

            // 动画的目标值scrollValue
            let toScrollValue;
            // 动画开始时新的status
            let newStatusOnAnimStart;
            // 动画结束时新的status
            let newStatusOnAnimEnd;

            // 如果RESET状态松手，说明竖直滑动未过下拉触发门限，不做任何响应
            if (this.getStatus() == STATUS_RESET) {
                return;
            }
            // 如果从PULLING状态松手，则动画移动到RESET位置
            // 状态机：　PULLING -> RESET
            else if (this.getStatus() == STATUS_PULLING) {
                toScrollValue = 0;
                newStatusOnAnimStart = STATUS_PULLING;
                newStatusOnAnimEnd = STATUS_RESET;
            }
            // 如果从PULLING_HOLD状态松手，则动画移动到PULLING_HOLD位置
            // 状态机: PULLING_HOLD -> RELEASED_TO_REFRESH -> RELEASED_DURING_REFRESH
            else if (this.getStatus() == STATUS_PULLING_HOLD) {
                toScrollValue = this.THRESHOLD_PULLINGHOLD;
                newStatusOnAnimStart = STATUS_RELEASED_TO_REFRESH;
                newStatusOnAnimEnd = STATUS_RELEASED_DURING_REFRESH;
            }

            this.setState({
                status: newStatusOnAnimStart,
            });

            this.props.animation(this.state.scrollValue, toScrollValue).start(
                (event) => {
                    if (event.finished) {
                        this.setState({
                            status: newStatusOnAnimEnd,
                        });
                        // 如果动画结束后进入RELEASED_DURING_REFRESH状态，则开始刷新数据
                        if (this.getStatus() == STATUS_RELEASED_DURING_REFRESH) {
                            this.props.onRefresh(TAG_NOTIFICATION_REFRESH_COMPLETE);
                        }
                    }
                }
            );
        }

        this.pullToRefreshPanResponder = PanResponder.create({
            // onMoveShouldSetPanResponderCapture: onMoveShouldSetPanResponder,
            onMoveShouldSetPanResponderCapture: (e, gestureState) => {
                return true;
            },
            onPanResponderMove: onPanResponderMove,
            onPanResponderTerminate: onPanResponderRelease,
            onPanResponderRelease: onPanResponderRelease,
            onPanResponderTerminationRequest: (e, gestureState) => {
                false
            },
        })
        ;

        this.scrollViewContainerPanResponder = PanResponder.create({

            onMoveShouldSetPanResponder: (e, gestureState) => {
                return this.scrollY > 0;
            },
            onPanResponderTerminationRequest: (e, gestureState) => {
                return !(this.scrollY > 0);
            },
        });
    }

    componentDidMount() {
        // 注册监听器，监听外部传来的数据刷新完成的消息
        this.subscription = DeviceEventEmitter.addListener(TAG_NOTIFICATION_REFRESH_COMPLETE, () => {
            this.notifyRefreshComplete();
        });
    }

    componentWillUnmount() {
        this.subscription && this.subscription.remove();
    }

    enableScroll() {
        this.setState({
            scrollEnabled: true,
        });
    }

    disableScroll() {
        this.setState({
            scrollEnabled: false,
        });
    }

    getStatusIndicator(getStatus, getScrollValue) {

        let status = getStatus();
        let scrollValue = getScrollValue();

        // 如果外界不提供，则用默认的statusIndicator样式
        if (this.props.renderStatusIndicator == null) {

            // status indicator显示的状态文字
            let statusTextString;

            if (status == STATUS_RESET || status == STATUS_PULLING) {
                statusTextString = "下拉以刷新";
            } else if (status == STATUS_PULLING_HOLD) {
                statusTextString = "松开以刷新";
            } else if (status == STATUS_RELEASED_TO_REFRESH || status == STATUS_RELEASED_DURING_REFRESH) {
                statusTextString = "刷新中";
            }

            return (
                <View
                    style={{backgroundColor : 'red', height : 50, flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                    <CustomCircularProgressBar
                        style={styles.circularProgressBar}
                        circleRadius={10}
                        scrollValue={this.state.scrollValue}
                        thresholdPullingHold={this.THRESHOLD_PULLINGHOLD}/>
                    <Text style={{marginLeft : 10}}>{statusTextString}</Text>
                </View>
            );
        }
        // 如果外部提供了status indicator样式
        else {
            return this.props.renderStatusIndicator(getStatus, getScrollValue);
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

    onScroll(event) {
        this.scrollY = event.nativeEvent.contentOffset.y;
        // if (this.scrollY == 0) {
        //     this.disableScroll();
        // }
    }


    render() {

        let customStatusAreaStyle = {
            height: this.props.statusAreaHeight,
            backgroundColor: this.props.statusAreaBackgroundColor,
            justifyContent: 'flex-end',
        };

        let customAnimatedAreaStyle = {
            height: customStatusAreaStyle.height + this.state.viewHeight,
        };

        let customContentAreaStyle = {
            height: this.state.viewHeight,
            backgroundColor: 'orange'
        };

        let transformStyle = {
            transform: [{
                translateY: this.state.scrollValue.interpolate({
                    inputRange: [-1, 0, 1, 10],
                    outputRange: [-this.props.statusAreaHeight, -this.props.statusAreaHeight, 0, 0],
                })
            }]
        };

        return (
            // 最外层容器的style由上级节点提供
            <View style={this.props.style}
                  onLayout={this.onLayout.bind(this)}>
                <Animated.View style={[customAnimatedAreaStyle, transformStyle]}
                >
                    <View style={customStatusAreaStyle}>
                        {this.getStatusIndicator(this.getStatus.bind(this), this.getScrollValue.bind(this))}
                    </View>
                    <ScrollView
                        style={customContentAreaStyle}
                        onScroll={this.onScroll.bind(this)}
                        {...this.pullToRefreshPanResponder.panHandlers}
                    >
                        {this.props.children}
                    </ScrollView>
                </Animated.View>
            </View>);
    }
}

const styles = StyleSheet.create({
    circularProgressBar: {
        width: 40,
        height: 40,
        backgroundColor: 'blue'
    }
});