import React, {Component, PropTypes} from 'react';
import {View, Text, Image, Dimensions, StyleSheet} from 'react-native';
import CustomViewPager from './CustomViewPager';
import CustomViewPageIndicator from './CustomViewPageIndicator';

const DEVICE_WIDTH = Dimensions.get('window').width;

const BANNER_IMGS = [
    require('./images/banner/ad_pic_1.jpg'),
    require('./images/banner/ad_pic_2.jpg'),
    require('./images/banner/ad_pic_3.jpg'),
    require('./images/banner/ad_pic_4.jpg'),
    require('./images/banner/ad_pic_5.jpg'),
];

export default class Home extends Component {

    constructor(props) {
        super(props);
        let dataSource = new CustomViewPager.DataSource({
            pageHasChanged: (p1, p2) => p1 !== p2,
        });
        this.state = {
            dataSource: dataSource.cloneWithPages(BANNER_IMGS)
        };
    }

    getRenderPage(pageKey: string, pageIndex: number, data: object) {
        return (<Image key={pageKey} style={styles.pagerImage} source={data}/>);
    }

    getRenderPageIndicator(props: object) {
        return (
            <CustomViewPageIndicator style={styles.pagerIndicator} {...props}/>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <CustomViewPager
                    style={styles.viewPager}
                    dataSource={this.state.dataSource}
                    renderPage={this.getRenderPage}
                    renderPageIndicator={this.getRenderPageIndicator}
                    isLoop={true}
                    autoPlay={true}
                />
            </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    viewPager: {
        width: DEVICE_WIDTH,
        height: 300,
        backgroundColor: 'red'
    },
    pagerImage: {
        flex: 1,
        resizeMode: 'stretch'
    },
    pagerIndicator: {
        bottom: 10,
        backgroundColor: 'blue'
    }
});