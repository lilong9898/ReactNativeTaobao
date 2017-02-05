import React, {Component, PropTypes} from 'react';
import {
    View, Text, ScrollView, Dimensions, StyleSheet, requireNativeComponent,
} from 'react-native';

import PULL_TO_REFRESH_STATE from './PullToRefreshState';

const STATE_RESET = PULL_TO_REFRESH_STATE.STATE_RESET;
const STATE_PULL_TO_REFRESH = PULL_TO_REFRESH_STATE.STATE_PULL_TO_REFRESH;
const STATE_RELEASE_TO_REFRESH = PULL_TO_REFRESH_STATE.STATE_RELEASE_TO_REFRESH;
const STATE_REFRESHING = PULL_TO_REFRESH_STATE.STATE_REFRESHING;
const STATE_MANUAL_REFRESHING = PULL_TO_REFRESH_STATE.STATE_MANUAL_REFRESHING;
const STATE_OVERSCROLLING = PULL_TO_REFRESH_STATE.STATE_OVERSCROLLING;

import CircularProgressBarART from './CircularProgressBarART';
import CircularProgressBarSvg from './CircularProgressBarSvg';

export default class PullToRefreshLoadingLayout extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewWidth: 0,
            viewHeight: 0,
            pullToRefreshState: STATE_RESET,
            loadingLayoutScrollPositionRatio: 0,
        }
    }

    static propTypes = {
        minDraggedDistanceToRefresh: React.PropTypes.number.isRequired,
        pullToRefreshState: React.PropTypes.string.isRequired,
        loadingLayoutScrollPositionRatio: React.PropTypes.number.isRequired,
    };

    static defaultProps = {
        pullToRefreshState: STATE_RESET,
        loadingLayoutScrollPositionRatio: 0,
    };

    componentWillReceiveProps(nextProps) {

        if (nextProps
            &&
            (
                nextProps.pullToRefreshState != this.props.pullToRefreshState
                || nextProps.loadingLayoutScrollPositionRatio != this.props.loadingLayoutScrollPositionRatio
            )
        ) {
            this.setState({
                pullToRefreshState: nextProps.pullToRefreshState,
                loadingLayoutScrollPositionRatio: nextProps.loadingLayoutScrollPositionRatio,
            });
        }

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

    getStatusText(pullToRefreshState: string): string {

        let text = "";

        switch (pullToRefreshState) {
            case STATE_PULL_TO_REFRESH:
                text = "下拉刷新";
                break;
            case STATE_RELEASE_TO_REFRESH:
                text = "松手可刷新"
                break;
            case STATE_REFRESHING:
                text = "玩命刷新中..."
                break;
            default:
                text = "下拉刷新";
                break;
        }

        return text;
    }

    render() {

        let circleSpanRadian = 2 * Math.PI * Math.min(1, Math.max(0, this.state.loadingLayoutScrollPositionRatio));

        return (
            <RCTPullToRefreshLoadingLayout
                {...this.props}
                style={[this.props.style, styles.container]}
                onLayout={this.onLayout.bind(this)}
            >
                <View
                    style={[{height:this.props.minDraggedDistanceToRefresh}, styles.contentArea]}
                >
                    <CircularProgressBarSvg/>
                    <CircularProgressBarART
                        style={styles.circleProgress}
                        circleRadius={10}
                        circleColor='gray'
                        circleSpanRadian={circleSpanRadian}
                    />
                    <Text
                        style={[styles.statusText]}
                        numberOfLines={1}
                    >
                        {this.getStatusText(this.state.pullToRefreshState)}
                    </Text>
                </View>
            </RCTPullToRefreshLoadingLayout>
        );
    }
}

const styles = {
    container: {
        justifyContent: 'flex-end',
    },
    contentArea: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    circleProgress: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    scrollRatioText: {
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    statusText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 15,
    },
};

const NATIVE_MODULE_REGISTERED_NAME = "RCTPullToRefreshLoadingLayout";

let iface = {
    name: NATIVE_MODULE_REGISTERED_NAME,
    propTypes: {
        ...View.propTypes,
    },
}

const RCTPullToRefreshLoadingLayout = requireNativeComponent(NATIVE_MODULE_REGISTERED_NAME, iface);
