import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    DeviceEventEmitter
} from 'react-native';
import CustomViewPager from './CustomViewPager';
import CustomViewPageIndicator from './CustomViewPageIndicator';
import CustomFuctionButtonGroup from './CustomFunctionButtonGroup';
import CustomBulletinBoard from './CustomBulletinBoard';
import CustomHighlightProductGroup from './CustomHighlightProductGroup';
import CustomProductGroup from './CustomProductGroup';
import CustomAreaDivider from './CustomAreaDivider';

import PullToRefreshScrollView from './PullToRefreshScrollView';

// 首页轮播广告的图片
import BANNERS from './BannersDataArray';

// 导入全局UI设置
import GLOBAL_UI_SETTING from './GlobalUISetting';
// 导入商品信息
import PRODUCT_DATA from './ProductData';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class Home extends Component {

    constructor(props) {
        super(props);
        let dataSource = new CustomViewPager.DataSource({
            pageHasChanged: (p1, p2) => p1 !== p2,
        });
        this.state = {
            dataSource: dataSource.cloneWithPages(BANNERS)
        };

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

    getPullToRefreshViewOnRefresh(tag_notification_refresh_complete: string) {
        this.dummyLoadingTimer = setTimeout(
            () => {
                DeviceEventEmitter.emit(tag_notification_refresh_complete);
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
                style={styles.pullToRefreshView}
                collapsable={false}
            >
                <View
                    style={styles.contentContainer}
                    collapsable={false}>
                    <CustomViewPager
                        style={styles.viewPager}
                        dataSource={this.state.dataSource}
                        renderPage={this.getViewPagerPage}
                        renderPageIndicator={this.getViewPagerPageIndicator}
                        isLoop={true}
                        autoPlay={true}
                        slideIntervalMs={1000}
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
    pullToRefreshView: {
        // flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    contentContainer: {
        width: SCREEN_WIDTH,
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