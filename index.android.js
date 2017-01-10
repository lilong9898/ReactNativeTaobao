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

class TouTiao extends Component {

    constructor(props) {
        super(props);
        this.state = {selectedTab: 'home'};
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

    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>
                    {this.generateTabNavigatorItem(TAB_NAME_HOME, TAB_TITLE_HOME, TAB_ICON_HOME_NOT_SELECTED, TAB_ICON_HOME_SELECTED, () =>
                        <Home/>)}
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

AppRegistry.registerComponent('TouTiao', () => TouTiao);
