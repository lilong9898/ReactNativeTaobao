import React, {Component, PropTypes} from 'react';
import {
    View, Text, ScrollView, Dimensions, StyleSheet, requireNativeComponent,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

import PULL_TO_REFRESH_STATE from './PullToRefreshState';
const STATE_RESET = PULL_TO_REFRESH_STATE.STATE_RESET;

export default class PullToRefreshScrollView extends Component {

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
        height: React.PropTypes.number.isRequired,
        loadingLayoutHeight: React.PropTypes.number.isRequired,
        minDraggedDistanceToRefresh: React.PropTypes.number.isRequired,
        renderLoadingLayout: React.PropTypes.func.isRequired,
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

    onPullToRefreshStateChange(event) {

        if (event.nativeEvent && event.nativeEvent.pullToRefreshState != this.state.pullToRefreshState) {
            this.setState({
                pullToRefreshState: event.nativeEvent.pullToRefreshState,
            });
        }

    }

    onLoadingLayoutScrollPositionRatioChange(event) {

        if (event.nativeEvent && event.nativeEvent.loadingLayoutScrollPositionRatio != this.state.loadingLayoutScrollPositionRatio) {
            this.setState({
                loadingLayoutScrollPositionRatio: event.nativeEvent.loadingLayoutScrollPositionRatio,
            });
        }
    }

    render() {

        // 考虑到为了隐藏loadingLayout需要用负的padding，则本控件的高度要比屏幕高度大,
        // 这样当loadingLayout隐藏了的时候scrollView刚好占满全屏，否则scrollView高度会不足
        let heightStyle = {
            height: this.props.height + this.props.loadingLayoutHeight,
        };

        return (
            <RCTPullToRefreshScrollView
                {...this.props}
                collapsable={false}
                style={[this.props.style, heightStyle, ]}
                onLayout={this.onLayout.bind(this)}
                onPullToRefreshStateChange={this.onPullToRefreshStateChange.bind(this)}
                onLoadingLayoutScrollPositionChange={this.onLoadingLayoutScrollPositionRatioChange.bind(this)}
            >
                <View
                    collapsable={false}
                    style={{flex:1}}
                >
                    {
                        this.props.renderLoadingLayout(this.props.loadingLayoutHeight, this.props.minDraggedDistanceToRefresh, this.state.pullToRefreshState, this.state.loadingLayoutScrollPositionRatio)
                    }
                    <ScrollView
                        style={{height: this.props.height}}
                    >
                        {this.props.children}
                    </ScrollView>
                </View>
            </RCTPullToRefreshScrollView>
        );
    }
}

const NATIVE_MODULE_REGISTERED_NAME = "RCTPullToRefreshScrollView";

let iface = {
    name: NATIVE_MODULE_REGISTERED_NAME,
    propTypes: {
        minDraggedDistanceToRefresh: React.PropTypes.number,
        ...View.propTypes,
    },
}

const RCTPullToRefreshScrollView = requireNativeComponent(NATIVE_MODULE_REGISTERED_NAME, iface);
