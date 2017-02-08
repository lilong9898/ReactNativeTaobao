[![Build Status](https://travis-ci.org/lilong9898/ReactNativeTaobao.svg?branch=master)](https://travis-ci.org/lilong9898/ReactNativeTaobao)

# React Native 仿淘宝安卓客户端首页

## 演示
![](./demo/demo1.gif) ![](./demo/demo2.gif)

## 如何运行
1. 准备环境: [配置环境](http://reactnative.cn/docs/0.41/getting-started.html#content)
2. Clone 这个 repo, 然后定位到project的根目录
3. 运行 `npm install`
4. 运行 `react-native run-android`
5. 看看效果^_^

Tips: 方便起见, 本demo开启了debug模式下的js & assets bundling, 所以没必要运行`react-native start`来启动js packager. 如果需要修改代码并热更新看看效果, 请修改[build.gradle](./android/app/build.gradle)，将`bundleInDebug`从`true`改成`false`, 运行`react-native start`启动js packager, 然后把设备连上. 详见[真机运行](http://reactnative.cn/docs/0.41/running-on-device-android.html#content).

## 支持的平台和ReactNative版本
目前只支持安卓平台，所以index.ios.js & ./ios是没有的. 
React版本是15.4.1. ReactNative的版本是0.41.2.

## 数据源
遗憾的是，目前所有图片和文字都是放在本地的，没找到免费的淘宝API.

## 内部实现

### ViewPager的实现
ReactNative提供了[ViewPagerAndroid](http://reactnative.cn/docs/0.41/viewpagerandroid.html#content)来实现原生`ViewPager`的功能. 实际上它就是包装了原生的`ReactViewPager`. 直接用`ViewPagerAndroid`的坏处是缺少灵活性: 比如说，不可能让它的内容竖直滑动. 受[race604/react-native-viewpager](https://github.com/race604/react-native-viewpager)的启发,　本demo中的viewPager增强了它的一些功能, 提供了更多的灵活性比如控制滑动方向, 指示圆点的形状和位置等. 本demo中，既有横向滑动的view pager，也有竖直滑动的.

代码: [CustomViewPager.js](./view/CustomViewPager.js).

### PullToRefresh的实现
从直觉上看，应该用纯js做一个pull-to-refresh-scrollview, 具体通过[ScrollView](http://reactnative.cn/docs/0.41/scrollview.html#content), [PanResponder](http://reactnative.cn/docs/0.41/panresponder.html#content)和[Animated](http://reactnative.cn/docs/0.41/animated.html#content). 基本想法是把一个loading layout和一个`ScrollView`拼起来: 当loading layout 隐藏的时候, `ScrollView`接收手势. 当loading layout被下拉出来的时候, `PanResponder`接收手势. 这样的话`ScrollView`就接收不到手势, 但loading layout就通过`Animation`被下拉出来了. 麻烦的是, 这种想法会遇到一个手势处理的问题:[react-native/issues/1046](https://github.com/facebook/react-native/issues/1046), 里面说:
> Ideally, once something gets the responder, it can prevent others from responding by setting onPanResponderTerminationRequest: () => false,

> However, we often have troubles while interacting with touch interactions happening on the main thread, like the iOS slider, or any scroll views. The problem is that javascript cannot immediately reject the responsiveness of the native event, because the main thread must synchronously decide if JS or the scroll view should become responder, and JS can only respond asynchronously.

> This is a difficult problem to solve, and is something we have been thinking about for a while. cc @vjeux @sahrens @jordwalke @lelandrichardson. This could be solved in a similar way as @kmagiera is moving animations to the UI thread. Basically we construct and serialize some logic such that these immediate operations can be resolved without waiting for the JS thread.

因为这个原因, 加上ReactNative `ScrollView`实际上就是包装的原生`ReactScrollView`, `PanResponder`没办法一定保证能屏蔽手势，不让它到原生的scrollview那里. 所以，有的时候下拉了想去刷新,　手势被原生的scrollview吸收，显示出一个滚动到头的效果, 但loading layout就拉不下来了.

为了解决这个问题, 本demo在原生，也就是java代码里处理手势, 然后把这个原生的控件导出到js端. 在广为人知的[chrisbanes/Android-PullToRefresh](https://github.com/chrisbanes/Android-PullToRefresh)的基础上, 本demo简化了它的代码, 去掉了用不上的模式和属性, 只保留了手势处理部分: [RCTPullToRefreshScrollView.java](./android/app/src/main/java/com/rntaobao/pullToRefresh/view/RCTPullToRefreshScrollView.java).　然后本demo通过[RCTPullToRefreshScrollViewManager.java](./android/app/src/main/java/com/rntaobao/pullToRefresh/viewManager/RCTPullToRefreshScrollViewManager.java)把它导出到js端, 对应的js控件是[PullToRefreshScrollView.js](./view/PullToRefreshScrollView.js).

另外的一个问题是怎么在js里定义loading layout, 而不是在java里.这样子就可以灵活的热更新loading layout的样式. 直觉上看, 应该把js元素通过[Props](https://facebook.github.io/react-native/docs/props.html)传给原生的控件. 但此路不通，因为[原生控件](http://reactnative.cn/docs/0.41/native-component-android.html#content)只接受基本类型的props,　或者是简单的数据结构比如`ReadableArray` & `ReadableMap`. 

为了绕过这个限制, 本demo定义了一个原生的[RCTPullToRefreshLoadingLayout.java](./android/app/src/main/java/com/rntaobao/pullToRefresh/view/RCTPullToRefreshLoadingLayout.java),　通过 [RCTPullToRefreshLoadingLayoutManager.java](./android/app/src/main/java/com/rntaobao/pullToRefresh/viewManager/RCTPullToRefreshLoadingLayoutManager.java)把它导出到js端, 对应的js控件是[PullToRefreshLoadingLayout.js](./view/PullToRefreshLoadingLayout.js).　当这个控件的js版本,　也就是 `<RCTPullToRefreshLoadingLayout>`作为一个子元素加入到`<RCTPullToRefreshScrollView>`的时候, 在java端, `RCTPullToRefreshLoadingLayout`同步作为一个子view加入到`RCTPullToRefreshScrollView`.　覆盖`RCTPullToRefreshScrollView`的`addView`方法，搜索`RCTPullToRefreshLoadingLayout`的实例. 一旦找到, 本demo就拿到了它的引用, 这个正是在js端定义的loading layout. 有了这个引用, 就可以在java端对loading layout进行操作了.

需要注意的是, 下拉刷新效果会用到负的padding, 所以`RCTPullToRefreshScrollView`应该自己处理自己这一层的layout,　而不是像默认的那样让js负责. 所以要在`RCTPullToRefreshScrollViewManager`中设置:
```java
    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }
```

### CircleProgressBar的实现

Loading layout中的circle progress bar, 是用[react-native-svg](https://www.npmjs.com/package/react-native-svg)和[d3-shape](https://www.npmjs.com/package/d3-shape)来画的. 想法来自于[fdnhkj/react-native-conical-gradient](https://github.com/fdnhkj/react-native-conical-gradient). 代码: [CircularProgressBarSvg.js](./view/CircularProgressBarSvg.js).

本demo里还有一个`ART`版本的circle progress bar.　遗憾的是`ART`没有官方文档: [react-native/issues/4789](https://github.com/facebook/react-native/issues/4789), 而且经常崩溃(未找到原因). 代码: [CircularProgressBarART.js](./view/CircularProgressBarART.js).

### TabNavigation's implementation
TabNavigation is supported by [react-native-tab-navigator](https://www.npmjs.com/package/react-native-tab-navigator). One thing to mention is that the `SceneContainer` of this lib uses a style of `position: absolute`, making the scene content actually takes up the whole space of its parent view. For this demo, the `SceneContainer` is set to fixed height, which is the screen height minus tabBar height.

