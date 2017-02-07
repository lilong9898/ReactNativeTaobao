import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    DeviceEventEmitter
} from 'react-native';
import CustomViewPager from '../view/CustomViewPager';
import CustomViewPageIndicator from '../view/CustomViewPageIndicator';
import CustomFuctionButtonGroup from '../compoundview/CustomFunctionButtonGroup';
import CustomBulletinBoard from '../compoundview/CustomBulletinBoard';
import CustomHighlightProductGroup from '../compoundview/CustomHighlightProductGroup';
import CustomProductGroup from '../compoundview/CustomProductGroup';
import CustomAreaDivider from '../compoundview/CustomAreaDivider';

import PullToRefreshScrollView from '../view/PullToRefreshScrollView';
import PullToRefreshLoadingLayout from '../view/PullToRefreshLoadingLayout';

// 首页轮播广告的图片
import BANNERS from '../data/BannerData';

// 导入全局UI设置
import GLOBAL_UI_SETTING from '../global/GlobalUISetting';
// 导入商品信息
import PRODUCT_DATA from '../data/ProductData';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const DEVICE_EVENT_TYPE_NOTIFY_REFRESH_COMPLETE = "notify_refresh_complete";

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.dataSetIndex = 0;

        this.state = {
            viewPagerDataSource: this.getNewViewPagerDataSource(BANNERS[0])
        };

    }

    static propTypes = {
        height: React.PropTypes.number.isRequired,
    };

    getNewViewPagerDataSource(data) {
        return new CustomViewPager.DataSource({
            pageHasChanged: (p1, p2) => p1 !== p2,
        }).cloneWithPages(data);
    }

    getLoadingLayout(loadingLayoutHeight: number, minDraggedDistanceToRefesh: number, pullToRefreshState: string, loadingLayoutScrollPositionRatio: number) {
        return (
            <PullToRefreshLoadingLayout
                style={{height: loadingLayoutHeight}}
                minDraggedDistanceToRefresh={minDraggedDistanceToRefesh}
                pullToRefreshState={pullToRefreshState}
                loadingLayoutScrollPositionRatio={loadingLayoutScrollPositionRatio}
            />
        );
    }

    getViewPagerPage(pageKey: string, pageIndex: number, data: object, viewPagerWidth: number, viewPagerHeight: number) {
        return (<Image key={pageKey}
                       style={{width: viewPagerWidth, height: viewPagerHeight, resizeMode: 'cover'}}
                       resizeMethod='scale'
                       source={data}/>);
    }

    getViewPagerPageIndicator(props: object) {
        let pageInidcatorProps = {
            dotSize: 6,
            dotSpace: 6,
        };

        return (
            <CustomViewPageIndicator {...pageInidcatorProps} {...props}/>
        );
    }

    onRefresh() {

        if (this.dataSetIndex == 0) {
            this.dataSetIndex = 1;
        } else if (this.dataSetIndex == 1) {
            this.dataSetIndex = 0;
        }

        this.setState({
            viewPagerDataSource: this.getNewViewPagerDataSource(BANNERS[this.dataSetIndex])
        });

        this.dummyLoadingTimer = setTimeout(
            () => {
                DeviceEventEmitter.emit(DEVICE_EVENT_TYPE_NOTIFY_REFRESH_COMPLETE);
            }, 1000);
    }

    componentWillUnmount() {
        if (this.dummyLoadingTimer) {
            clearTimeout(this.dummyLoadingTimer);
            this.dummyLoadingTimer = null;
        }
    }

    render() {

        return (
            <PullToRefreshScrollView
                height={this.props.height}
                loadingLayoutHeight={100}
                style={styles.pullToRefreshView}
                minDraggedDistanceToRefresh={75}
                renderLoadingLayout={this.getLoadingLayout}
                onRefreshStart={this.onRefresh.bind(this)}
            >
                <View
                    style={styles.contentContainer}
                    collapsable={false}>
                    <CustomViewPager
                        style={styles.viewPager}
                        dataSource={this.state.viewPagerDataSource}
                        renderPage={this.getViewPagerPage}
                        renderPageIndicator={this.getViewPagerPageIndicator}
                        isLoop={true}
                        autoPlay={true}
                        slideIntervalMs={3000}
                    />
                    <CustomFuctionButtonGroup
                        style={styles.functionButtonGroup}
                    />
                    <CustomBulletinBoard
                        style={styles.bulletinBoard}
                    />
                    <CustomHighlightProductGroup
                        style={styles.highlightProduct}
                    />
                    <CustomAreaDivider/>
                    <CustomProductGroup
                        style={styles.product}
                        title={PRODUCT_DATA.NORMAL_PRODUCT_GROUPS[0].title}
                        icon={PRODUCT_DATA.NORMAL_PRODUCT_GROUPS[0].icon}
                        more={PRODUCT_DATA.NORMAL_PRODUCT_GROUPS[0].more}
                        products={PRODUCT_DATA.NORMAL_PRODUCT_GROUPS[0].products}
                    />
                    <CustomAreaDivider/>
                    <CustomProductGroup
                        style={styles.product}
                        title={PRODUCT_DATA.NORMAL_PRODUCT_GROUPS[1].title}
                        icon={PRODUCT_DATA.NORMAL_PRODUCT_GROUPS[1].icon}
                        more={PRODUCT_DATA.NORMAL_PRODUCT_GROUPS[1].more}
                        products={PRODUCT_DATA.NORMAL_PRODUCT_GROUPS[1].products}
                    />
                    <CustomAreaDivider/>
                </View>
            </PullToRefreshScrollView>
        );
    }

}

const styles = StyleSheet.create({
    pullToRefreshView: {},
    contentContainer: {
        height: SCREEN_HEIGHT * 2.5,
        backgroundColor: GLOBAL_UI_SETTING.BACKGROUND_COLOR,
    },
    viewPager: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 0.5,
    },
    functionButtonGroup: {
        height: 180,
    },
    bulletinBoard: {
        height: 60,
    },
    highlightProduct: {},
    product: {},
});