import React, {Component, PropTypes} from 'react';
import {Dimensions, Animated, Text, View, TouchableOpacity, PanResponder, StyleSheet} from 'react-native';

import StaticRenderer from 'react-native/Libraries/Components/StaticRenderer';

import CustomViewPageIndicator from './CustomViewPageIndicator';
import CustomViewPagerDataSource from './CustomViewPagerDataSource';

const DEFAULT_SLIDE_INTERVAL_MS = 500;
const DEFAULT_SLIDE_DIRECTION = 'horizontal';

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

                    // 在任何模式下，如果只有一页，则不响应手势
                    if (this.getPageCount() == 1) {
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
        // 当没有定时器，且页数大于一页时，启动定时滑动
        if (!this.autoPlayer && this.getPageCount() > 1) {
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

        // 如果只有两页，则滑动方向只取决于手势方向，与页位置无关，pageIndexDiff只能取±1
        if (this.getPageCount() == 2) {
            toScrollValue = -pageIndexDiff;
        }
        // 如果多于两页，则滑动方向取决于页位置
        else if (this.getPageCount() > 2) {
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
                // 如果多于两页，则滑动方向取决于页位置
                // 从末页向左滑动到首页
                if (this.getCurrentPageIndex() == this.getPageCount() - 1 && jumpToPageIndexRounded == 0) {
                    toScrollValue = -1;
                }
                // 从非末页向右滑动到它的前一页
                else {
                    toScrollValue = 1;
                }
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
            isMoved && this.props.onChangePage && this.props.onChangePage(jumpToPageIndexRounded);
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

    getPage(pageKey: string, pageIndex: number) {
        return this.props.renderPage(pageKey, pageIndex, this.props.dataSource.getPageData(pageIndex));
    }

    render() {

        // 页数小于等于零，不生成任何内容，返回由上级设定style的空容器
        if (this.getPageCount() <= 0) {
            return <View style={this.props.style}/>;
        }

        if (this.state.viewWidth < 0) {
            return <View style={this.props.style}/>;
        }

        // 前面的页
        let prevPage;
        // 当前的页
        let curPage;
        // 后面的页
        let nextPage;

        // 因为react-native使用key来进行dom-diff中的同一节点的识别，所以相同的节点必须设置相同的key
        // 如果只有一页，则需要将当前页的内容设置到当前页的前面和后面，同时禁止panResponder响应手势
        if (this.getPageCount() == 1) {
            prevPage = this.getPage("0_fake_prev", 0);
            curPage = this.getPage("0", 0);
            nextPage = this.getPage("0_fake_next", 0);
        }
        // 如果只有两页，则需要将非当前页的内容设置到当前页的前面和后面
        else if (this.getPageCount() == 2) {
            // 如果当前页是第一页
            if (this.getCurrentPageIndex() == 0) {
                prevPage = this.getPage("1_fake", 1);
                curPage = this.getPage("0", 0);
                nextPage = this.getPage("1", 1);
            }
            // 如果当前页是第二页
            else if (this.getCurrentPageIndex() == 1) {
                prevPage = this.getPage("0", 0);
                curPage = this.getPage("1", 1);
                nextPage = this.getPage("0_fake", 0);
            }
        }
        // 如果多于两页
        else if (this.getPageCount() > 2) {

            // 前面一页是最后一页
            if (this.getCurrentPageIndex() == 0) {
                prevPage = this.getPage(this.getPageCount() - 1, this.getPageCount() - 1);
            }
            // 前面一页不是最后一页
            else {
                prevPage = this.getPage(this.getCurrentPageIndex() - 1, this.getCurrentPageIndex() - 1);
            }

            // 当前页
            curPage = this.getPage(this.getCurrentPageIndex(), this.getCurrentPageIndex());

            // 后面一页是第一页

            if (this.getCurrentPageIndex() == this.getPageCount() - 1) {
                nextPage = this.getPage(0, 0);
            }
            // 后面一页不是第一页
            else {
                nextPage = this.getPage(this.getCurrentPageIndex() + 1, this.getCurrentPageIndex() + 1);
            }

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

