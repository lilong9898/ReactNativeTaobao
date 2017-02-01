import React, {Component, PropTypes} from 'react';
import {
    View, Text, ScrollView, Dimensions, StyleSheet, requireNativeComponent,
} from 'react-native';

import PullToRefreshLoadingLayout from './PullToRefreshLoadingLayout';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

import PULL_TO_REFRESH_STATE from './PullToRefreshState';
const STATE_RESET = PULL_TO_REFRESH_STATE.STATE_RESET;
// const DEFAULT_LOADING_LAYOUT_HEIGHT = 50;
// const DEFAULT_LOADING_LAYOUT_CONTENT_HEIGHT = 25;

export default class PullToRefreshScrollView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewWidth: 0,
            viewHeight: 0,
            pullToRefreshState: STATE_RESET
        }
    }

    static propTypes = {
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

    onPullStateChange(event) {

        if (event.nativeEvent && event.nativeEvent.state != this.state.pullToRefreshState) {
            this.setState({
                pullToRefreshState: event.nativeEvent.state,
            });
        }

    }

    render() {
        return (
            <RCTPullToRefreshScrollView
                {...this.props}
                collapsable={false}
                style={[this.props.style, {backgroundColor: 'yellow'}]}
                onLayout={this.onLayout.bind(this)}
                onPullStateChange={this.onPullStateChange.bind(this)}
            >
                <View
                    collapsable={false}
                    style={{flex:1}}
                >
                    {
                        this.props.renderLoadingLayout(this.state.pullToRefreshState)
                    }
                    <ScrollView
                        style={{height: this.state.viewHeight, backgroundColor: 'cyan'}}
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
