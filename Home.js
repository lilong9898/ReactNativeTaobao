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

import RCTPullToRefreshScrollView from './RCTPullToRefreshScrollView';

// 首页轮播广告的图片
import BANNERS from './BannersDataArray';

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
        return (
            <CustomViewPageIndicator style={styles.pagerIndicator} {...props}/>
        );
    }

    getPullToRefreshViewOnRefresh(tag_notification_refresh_complete: string) {
        this.dummyLoadingTimer = setTimeout(
            () => {
                DeviceEventEmitter.emit(tag_notification_refresh_complete);
            }, 1000);
    }

    componentWillUnMount() {
        if (this.dummyLoadingTimer) {
            clearTimeout(this.dummyLoadingTimer);
            this.dummyLoadingTimer = null;
        }
    }

    render() {
        return (
            <RCTPullToRefreshScrollView
                style={styles.pullToRefreshView}
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
                </View>
            </RCTPullToRefreshScrollView>
        );
    }

}

const styles = StyleSheet.create({
    pullToRefreshView: {
        flex: 1,
        height: SCREEN_HEIGHT,
    },
    contentContainer: {
        height: SCREEN_HEIGHT * 2,
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
        backgroundColor: 'yellow',
    },
});