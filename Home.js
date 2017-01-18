import React, {Component, PropTypes} from 'react';
import {View, Text, Image, Dimensions, StyleSheet, DeviceEventEmitter} from 'react-native';
import CustomViewPager from './CustomViewPager';
import CustomViewPageIndicator from './CustomViewPageIndicator';
import CustomPullToRefreshView from './CustomPullToRefreshView';
import CustomFuctionButtonGroup from './CustomFunctionButtonGroup';
import BANNERS from './BannersDataArray';

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

    getViewPagerPage(pageKey: string, pageIndex: number, data: object) {
        return (<Image key={pageKey} style={{flex:1, resizeMode: 'cover'}} resizeMethod='scale' source={data}/>);
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
            <View style={styles.container}>
                <CustomPullToRefreshView
                    style={styles.pullToRefreshView}
                    onRefresh={this.getPullToRefreshViewOnRefresh}>
                    <CustomViewPager
                        style={styles.viewPager}
                        dataSource={this.state.dataSource}
                        renderPage={this.getViewPagerPage}
                        renderPageIndicator={this.getViewPagerPageIndicator}
                        isLoop={true}
                        autoPlay={false}
                    />
                    <CustomFuctionButtonGroup
                        style={styles.functionButtonGroup}
                    />
                </CustomPullToRefreshView>
            </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pullToRefreshView: {
        flex: 1,
    },
    viewPager: {
        height: 200,
    },
    functionButtonGroup: {
        height: 180,
    },
});