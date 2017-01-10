import React, {Component, PropTypes} from 'react';
import {Dimensions, Animated, Text, View, TouchableOpacity, PanResponder, StyleSheet} from 'react-native';

import StaticRenderer from 'react-native/Libraries/Components/StaticRenderer';

import CustomViewPageIndicator from './CustomViewPageIndicator';
import CustomViewPagerDataSource from './CustomViewPagerDataSource';

const DEFAULT_SLIDE_INTERVAL_MS = 500;
const DEFAULT_SLIDE_DIRECTION = 'horizontal';

const KEY_PREV_PAGE = "key_prev_page";
const KEY_CUR_PAGE = "key_cur_page";
const KEY_NEXT_PAGE = "key_next_page";

export default class CustomViewPager extends Component {

    constructor() {
        super();
        this.duringFling = false;
        this.state = {
            // 当前页的序号
            currentPageIndex: 0,
            // viewPager的宽度
            viewWidth: 0,
            // 一次滑动过程中，标示滑动程度的百分比，从-1到1
            scrollValue: new Animated.Value(0),
        };
    }

    static DataSource = CustomViewPagerDataSource;

    static propTypes = {
        ...View.propTypes,
        dataSource: PropTypes.instanceOf(CustomViewPagerDataSource).isRequired,
        renderPage: PropTypes.func.isRequired,
        onChangePage: PropTypes.func,
        renderPageIndicator: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.bool
        ]),
        isLoop: PropTypes.bool,
        locked: PropTypes.bool,
        autoPlay: PropTypes.bool,
        animation: PropTypes.func,
        initialPage: PropTypes.number,
        slideIntervalMs: PropTypes.number,
        slideDirection: PropTypes.string,
    };

    static defaultProps = {
        isLoop: false,
        locked: false,
        initialPage: 0,
        slideIntervalMs: DEFAULT_SLIDE_INTERVAL_MS,
        slideDirection: DEFAULT_SLIDE_DIRECTION,
        // 动画函数，
        animation: function (animatedValue, toValue) {
            return Animated.spring(animatedValue,
                {
                    toValue: toValue,
                    friction: 10,
                    tension: 50,
                })
        },
    }

    componentWillMount() {

        let onRelease = (e, gestureState) => {

            let dxToViewWidthRatio = gestureState.dx / this.state.viewWidth;
            let vx = gestureState.vx;

            let pageIndexDiff = 0;
            if (dxToViewWidthRatio < -0.5 || (dxToViewWidthRatio < 0 && vx <= -1e-2)) {
                pageIndexDiff = 1;
            } else if (dxToViewWidthRatio > 0.5 || (dxToViewWidthRatio > 0 && vx >= 1e-2)) {
                pageIndexDiff = -1;
            }

            this.movePage(pageIndexDiff);
        }

        this.panResponder = PanResponder.create({

            // 触摸点开始移动时,询问是否响应
            onMoveShouldSetPanResponder: (e, gestureState) => {

                // 如果横向移动距离大于纵向移动距离
                if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {

                    // 正在滑动动画中，不响应手势
                    if (this.duringFling) {
                        return false;
                    }

                    // 非loop模式下，在首页向右滑，或在末页向左滑，不响应手势
                    if (this.props.isLoop === false) {
                        if (this.getCurrentPageIndex() == 0 && gestureState.dx > 0) {
                            return false;
                        } else if (this.getCurrentPageIndex() == this.getPageCount() - 1 && gestureState.dx < 0) {
                            return false;
                        }
                    }

                    // 其它情况下响应手势
                    return true;
                }
            },

            // 滑动结束,或者responder被其他view夺去,根据上次滑动的距离和速度来跳到最接近的页
            onPanResponderRelease: onRelease,
            onPanResponderTerminate: onRelease,

            // 滑动中,页跟着触摸点移动
            onPanResponderMove: (e, gestureState) => {

                let scrollValue = gestureState.dx / this.state.viewWidth;
                this.state.scrollValue.setValue(scrollValue);
            },
        });

        // 如果规定了最初的页序号，则跳转到该页
        if (this.props.initialPage) {
            let initialPage = Number(this.props.initialPage);
            if (initialPage > 0) {
                this.goToPage(initialPage, false);
            }
        }
    }

    componentDidMount() {
        if (this.props.autoPlay) {
            this.startAutoPlay();
        }
    }

    // viewPager从外部接收到的props有了新的值(外部改变的)
    componentWillReceiveProps(nextProps) {

        if (nextProps.autoPlay) {
            this.startAutoPlay();
        } else {
            if (this.autoPlayer) {
                clearInterval(this.autoPlayer);
                this.autoPlayer = null;
            }
        }

        if (nextProps.dataSource) {
            // 最大的页序号
            let maxPage = nextProps.dataSource.getPageCount() - 1;
            // 最大页序号改变后的当前页序号
            let newCurrentPageIndex = Math.min(this.getCurrentPageIndex(), maxPage);
            // 移动到新的当前页序号
            this.movePage(newCurrentPageIndex - this.getCurrentPageIndex(), false);
        }

    }

    componentWillUnMount() {
        if (this.autoPlayer) {
            clearInterval(this.autoPlayer);
            this.autoPlayer = null;
        }
    }

    startAutoPlay() {
        if (!this.autoPlayer) {
            // 定时移动一页
            this.autoPlayer = setInterval(
                () => {
                    this.movePage(1)
                },
                this.props.slideIntervalMs
            );
        }
    }

    goToPage(pageIndex, animate = true) {

        // 总页数
        let pageCount = this.getPageCount();

        // 要跳转到的页序号为负或太大
        if (pageIndex < 0 || pageIndex >= pageCount) {
            console.error('Invalid page number: ', pageIndex);
            return
        }

        // 跳转到的页序号与当前页序号的差
        let pageIndexDiff = pageIndex - this.getCurrentPageIndex();

        this.movePage(pageIndexDiff, animate);
    }

    movePage(pageIndexDiff, animate = true) {

        // 总页数
        let pageCount = this.getPageCount();
        // 要跳转到的页序号, 因为未经循环处理, 有可能为负值
        let jumpToPageIndexUnrounded = this.getCurrentPageIndex() + pageIndexDiff;

        // 经过循环处理的要跳转到的页序号, 经过循环处理, 一定落在[0, pageCount - 1]范围内
        let jumpToPageIndexRounded = 0;

        // 要跳到的序号大于总数
        if (jumpToPageIndexUnrounded > this.getPageCount() - 1) {
            jumpToPageIndexRounded = jumpToPageIndexUnrounded % this.getPageCount();
        }
        // 要跳到的序号小于零
        else if (jumpToPageIndexUnrounded < 0) {
            jumpToPageIndexRounded = this.getPageCount() + jumpToPageIndexUnrounded % (-this.getPageCount());
        }
        // 其它情况
        else {
            jumpToPageIndexRounded = jumpToPageIndexUnrounded;
        }

        let isMoved = jumpToPageIndexRounded !== this.getCurrentPageIndex();

        let scrollValueDiff = jumpToPageIndexRounded - this.getCurrentPageIndex();

        // 要变化到的scrollValue，默认党scrollValueDiff=0时表示不翻页，则不动
        let toScrollValue = 0;

        //跳到序号更大的页
        if (scrollValueDiff > 0) {
            // 从首页向右滑动到末页
            if (this.getCurrentPageIndex() == 0 && jumpToPageIndexRounded == this.getPageCount() - 1) {
                toScrollValue = 1;
            }
            // 从非首页向左滑动到它的后一页
            else {
                toScrollValue = -1;
            }
        }
        //跳到序号更小的页
        else if (scrollValueDiff < 0) {
            // 从末页向左滑动到首页
            if (this.getCurrentPageIndex() == this.getPageCount() - 1 && jumpToPageIndexRounded == 0) {
                toScrollValue = -1;
            }
            // 从非末页向右滑动到它的前一页
            else {
                toScrollValue = 1;
            }
        }

        // 页面滑动完毕，设置新的state，触发viewPager的render
        let onMovePageFinished = () => {
            this.duringFling = false;
            this.state.scrollValue.setValue(0);

            this.setState({
                currentPageIndex: jumpToPageIndexRounded,
            });
        };

        if (animate) {
            this.duringFling = true;
            this.props.animation(this
                .state.scrollValue, toScrollValue)
                .start((event) => {
                    if (event.finished) {
                        onMovePageFinished();
                    }
                    isMoved && this.props.onChangePage && this.props.onChangePage(jumpToPageIndexRounded);
                });
        } else {
            onMovePageFinished();
            isMoved && this.props.onChangePage && this.props.onChangePage(jumpToPageIndexUnrounded);
        }
    }

    getCurrentPageIndex() {
        return this.state.currentPageIndex;
    }

    getPageCount() {
        return this.props.dataSource.pageIdentities.length;
    }

    renderPageIndicator(props) {
        if (this.props.renderPageIndicator === false) {
            return null;
        } else if (this.props.renderPageIndicator) {
            return React.cloneElement(this.props.renderPageIndicator(props), props);
        } else {
            return (
                <View style={styles.indicators}>
                    <CustomViewPageIndicator {...props} />
                </View>
            );
        }
    }

    getPage(pageIndex: number) {
        return this.props.renderPage(pageIndex, this.props.dataSource.getPageData(pageIndex));
    }

    render() {

        if (this.getPageCount() < 0) {
            return;
        }

        if (this.state.viewWidth < 0) {
            return;
        }

        // 前面的页
        let prevPage;

        // 前面一页是最后一页
        if (this.getCurrentPageIndex() == 0) {
            prevPage = this.getPage(this.getPageCount() - 1);
        }
        // 前面一页不是最后一页
        else {
            prevPage = this.getPage(this.getCurrentPageIndex() - 1);
        }

        // 当前页
        let curPage = this.getPage(this.getCurrentPageIndex());

        // 后面的页
        let nextPage;
        // 后面一页是第一页

        if (this.getCurrentPageIndex() == this.getPageCount() - 1) {
            nextPage = this.getPage(0);
        }
        // 后面一页不是第一页
        else {
            nextPage = this.getPage(this.getCurrentPageIndex() + 1);
        }

        // 拼接前面,当前,后面的页,生成3个page组成的组合体来显示,并在其上面平移到正确page
        let threePagesCompositionStyle = {
            width: this.state.viewWidth * 3,
            flex: 1,
            flexDirection: 'row'
        };

        let translateX = this.state.scrollValue.interpolate({
            inputRange: [-1, 1], outputRange: [-2 * this.state.viewWidth, 0]
        });

        return (
            // style由上级提供
            <View style={this.props.style}
                  onLayout={(event) => {

            // 获取view的宽度
            let viewWidth = event.nativeEvent.layout.width;

            // 若view的宽度为空或等于之前的宽度
            if (!viewWidth || this.state.viewWidth === viewWidth) {
              return;
            }

            // 向state中更新最新的view宽度
            this.setState({
              currentPageIndex: this.state.currentPageIndex,
              viewWidth: viewWidth,
            });
          }}
            >

                <Animated.View
                    style={[threePagesCompositionStyle, {transform: [{translateX : translateX}]}]}
                    {...this.panResponder.panHandlers}>
                    {prevPage}{curPage}{nextPage}
                </Animated.View>

                {this.renderPageIndicator({
                    goToPage: this.goToPage.bind(this),
                    pageCount: this.getPageCount(),
                    currentPageIndex: this.state.currentPageIndex,
                    scrollValue: this.state.scrollValue,
                })}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    indicators: {
        flex: 1,
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
    },
});

