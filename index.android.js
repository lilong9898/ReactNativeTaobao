import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    Image
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';

import Home from './Home';
import WeTao from './Wetao';
import Ask from './Ask';
import Cart from './Cart';
import Mine from './Mine';

const TAB_ICON_HOME_NOT_SELECTED = require('./images/tabIcon/tab_icon_home_not_selected.png');
const TAB_ICON_HOME_SELECTED = require('./images/tabIcon/tab_icon_home_selected.png');
const TAB_ICON_WETAO_NOT_SELECTED = require('./images/tabIcon/tab_icon_wetao_not_selected.png');
const TAB_ICON_WETAO_SELECTED = require('./images/tabIcon/tab_icon_wetao_selected.png');
const TAB_ICON_ASK_NOT_SELECTED = require('./images/tabIcon/tab_icon_ask_not_selected.png');
const TAB_ICON_ASK_SELECTED = require('./images/tabIcon/tab_icon_ask_selected.png');
const TAB_ICON_CART_NOT_SELECTED = require('./images/tabIcon/tab_icon_cart_not_selected.png');
const TAB_ICON_CART_SELECTED = require('./images/tabIcon/tab_icon_cart_selected.png');
const TAB_ICON_MINE_NOT_SELECTED = require('./images/tabIcon/tab_icon_mine_not_selected.png');
const TAB_ICON_MINE_SELECTED = require('./images/tabIcon/tab_icon_mine_selected.png')

const TAB_NAME_HOME = 'home';
const TAB_NAME_WETAO = 'wetao';
const TAB_NAME_ASK = 'ask';
const TAB_NAME_CART = 'cart';
const TAB_NAME_MINE = 'mine';

const TAB_TITLE_HOME = '首页';
const TAB_TITLE_WETAO = '微淘';
const TAB_TITLE_ASK = '问大家';
const TAB_TITLE_CART = '购物车';
const TAB_TITLE_MINE = '我的淘宝';

/**
 * 在顶级模块里，不要在尺寸上直接用Dimensions.get('window').width之类来获取屏幕宽高
 * 因为发现这种方法获取的屏幕宽高是可能变的
 * 顶级模块用flex:1，需要具体尺寸时用onLayout回调来获取
 * */
class RNTaobao extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedTab: 'home',
            viewWidth: 0,
            viewHeight: 0,
        };

    }

    generateTabNavigatorItem(tabName: string,
                             title: string,
                             renderIconSource: object,
                             renderSelectedIconSource: object,
                             getContent: func): any {
        return (
            <TabNavigator.Item
                title={title}
                titleStyle={styles.tabTitleStyle}
                selectedTitleStyle={styles.tabTitleSelectedStyle}
                renderIcon={()=><Image style={styles.tabIcon} source={renderIconSource}/>}
                renderSelectedIcon={()=><Image style={styles.tabIcon} source={renderSelectedIconSource}/>}
                selected={this.state.selectedTab === tabName}
                onPress={()=>{this.setState({selectedTab:tabName})}}
            >
                {getContent()}
            </TabNavigator.Item>
        );
    }

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

    render() {

        let tabBarHeightStyle = {
            height: 50,
        };

        let sceneHeightStyle = {
            height: this.state.viewHeight - tabBarHeightStyle.height,
        };

        return (
            <View
                style={styles.container}
                onLayout={this.onLayout.bind(this)}
            >
                <TabNavigator
                    tabBarStyle={tabBarHeightStyle}
                    sceneStyle={sceneHeightStyle}
                >
                    {this.generateTabNavigatorItem(TAB_NAME_HOME, TAB_TITLE_HOME, TAB_ICON_HOME_NOT_SELECTED, TAB_ICON_HOME_SELECTED, () =>
                        <Home height={sceneHeightStyle.height}/>)}
                    {this.generateTabNavigatorItem(TAB_NAME_WETAO, TAB_TITLE_WETAO, TAB_ICON_WETAO_NOT_SELECTED, TAB_ICON_WETAO_SELECTED, () =>
                        <WeTao/>)}
                    {this.generateTabNavigatorItem(TAB_NAME_ASK, TAB_TITLE_ASK, TAB_ICON_ASK_NOT_SELECTED, TAB_ICON_ASK_SELECTED, () =>
                        <Ask/>)}
                    {this.generateTabNavigatorItem(TAB_NAME_CART, TAB_TITLE_CART, TAB_ICON_CART_NOT_SELECTED, TAB_ICON_CART_SELECTED, () =>
                        <Cart/>)}
                    {this.generateTabNavigatorItem(TAB_NAME_MINE, TAB_TITLE_MINE, TAB_ICON_MINE_NOT_SELECTED, TAB_ICON_MINE_SELECTED, () =>
                        <Mine/>)}
                </TabNavigator>
            </View>
        );
    }
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#F5FCFF'
        },
        tabTitleStyle: {
            fontSize: 10,
            color: 'black',
            marginBottom: 4
        },
        tabTitleSelectedStyle: {
            color: 'red'
        },
        tabIcon: {
            width: 20,
            height: 20
        }
    })
    ;

AppRegistry.registerComponent('RNTaobao', () => RNTaobao);
