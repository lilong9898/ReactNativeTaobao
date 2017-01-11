import React, {Component, PropTypes} from 'react';
import {Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View, Animated} from 'react-native'

const DEFAULT_DOT_SIZE = 18;
const DEFAULT_DOT_SPACE = 18;
const DEFAULT_DOT_COLOR = '#E0E1E2';
const DEFAULT_CUR_DOT_COLOR = '#80ACD0';

export default class CustomViewPageIndicator extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewWidth: 0,
        };
    }

    static propTypes = {
        dotSize: React.PropTypes.number,
        dotSpace: React.PropTypes.number,
        dotColor: React.PropTypes.string,
        curDotColor: React.PropTypes.string,
        goToPage: React.PropTypes.func.isRequired,
        pageCount: React.PropTypes.number.isRequired,
        currentPageIndex: React.PropTypes.number.isRequired,
        scrollValue: React.PropTypes.instanceOf(Animated.Value).isRequired,
    };

    static defaultProps = {
        dotSize: DEFAULT_DOT_SIZE,
        dotSpace: DEFAULT_DOT_SPACE,
        dotColor: DEFAULT_DOT_COLOR,
        curDotColor: DEFAULT_CUR_DOT_COLOR,
    };

    renderIndicator(pageIndex) {

        let customDotStyle = {
            width: this.props.dotSize,
            height: this.props.dotSize,
            borderRadius: this.props.dotSize / 2,
            backgroundColor: this.props.dotColor,
            marginLeft: this.props.dotSpace,
            marginRight: this.props.dotSpace
        };

        return (
            <TouchableWithoutFeedback style={styles.tab} key={'indicator_' + pageIndex}
                              onPress={()=> this.props.goToPage(pageIndex, false)}>
                <View style={[styles.dot, customDotStyle]}/>
            </TouchableWithoutFeedback>
        );
    }

    render() {

        let pageCount = this.props.pageCount;
        let itemWidth = this.props.dotSize + (this.props.dotSpace * 2);

        // 最左边的圆点位置
        let firstDotPosition = (this.state.viewWidth - itemWidth * pageCount) / 2;
        // 根据当前页序号的位置增量
        let curDotDeltaPosition = itemWidth * this.props.currentPageIndex;
        // 当前页序号下的curDot基准位置
        let curDotBasePosition = firstDotPosition + curDotDeltaPosition;
        // curDot允许的最左位置
        let curDotPositionLeftLimit = firstDotPosition;
        // curDot允许的最右位置
        let curDotPositionRightLimit = firstDotPosition + (this.props.pageCount - 1) * itemWidth;

        // 从上级的CustomViewPager中获取的scrollValue，取值范围为[-1, 1]
        // 对应的curDot的left值的取值范围
        let left;
        // 当前是首页
        if (this.props.currentPageIndex == 0) {
            left = this.props.scrollValue.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [curDotPositionLeftLimit + itemWidth, curDotPositionLeftLimit, curDotPositionLeftLimit]
            });
        }
        // 当前是末页
        else if (this.props.currentPageIndex == this.props.pageCount - 1) {
            left = this.props.scrollValue.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [curDotPositionRightLimit, curDotPositionRightLimit, curDotPositionRightLimit - itemWidth]
            });
        }
        // 当前页既不是首页，也不是末页
        else {
            left = this.props.scrollValue.interpolate({
                inputRange: [-1, 1],
                outputRange: [curDotBasePosition + itemWidth, curDotBasePosition - itemWidth]
            });
        }

        // 存储indicator dot的容器
        let indicators = [];

        for (let i = 0; i < pageCount; i++) {
            indicators.push(this.renderIndicator(i))
        }

        let customCurDotStyle = {
            width: this.props.dotSize,
            height: this.props.dotSize,
            borderRadius: this.props.dotSize / 2,
            backgroundColor: this.props.curDotColor,
            margin: this.props.dotSpace,
        };

        return (
            // style由本级和上级共同提供
            <View style={[styles.tabs, this.props.style]}
                  onLayout={(event) => {
             viewWidth = event.nativeEvent.layout.width;
            if (!viewWidth || this.state.viewWidth === viewWidth) {
              return;
            }
            this.setState({
              viewWidth: viewWidth,
            });
          }}>
                {indicators}
                <Animated.View style={[styles.curDot, {left : left}, customCurDotStyle]}/>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    tab: {
        alignItems: 'center',
    },

    tabs: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    dot: {
        width: DEFAULT_DOT_SIZE,
        height: DEFAULT_DOT_SIZE,
        borderRadius: DEFAULT_DOT_SIZE / 2,
        backgroundColor: DEFAULT_DOT_COLOR,
        marginLeft: DEFAULT_DOT_SPACE,
        marginRight: DEFAULT_DOT_SPACE,
    },

    curDot: {
        position: 'absolute',
        width: DEFAULT_DOT_SIZE,
        height: DEFAULT_DOT_SIZE,
        borderRadius: DEFAULT_DOT_SIZE / 2,
        backgroundColor: DEFAULT_CUR_DOT_COLOR,
        margin: DEFAULT_DOT_SPACE,
        bottom: 0,
    },
});