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

### PullToRefresh's implementation
At first the demo tries to implement a pull-to-refresh-scrollview in pure js, using [ScrollView](https://facebook.github.io/react-native/docs/scrollview.html), [PanResponder](https://facebook.github.io/react-native/docs/panresponder.html) and [Animated](https://facebook.github.io/react-native/docs/animated.html). Basic idea is to concatenate a loading layout and a `ScrollView`: when loading layout is hidden, `ScrollView` is receiving gestures. When loading layout is pulled out to show, panresponder is receiving gestures, so scrollview receives no gesture, and loading layout is pulled out using `Animation`. However, this idea encounters a gesture processing problem : [react-native/issues/1046](https://github.com/facebook/react-native/issues/1046), which indicates:
> Ideally, once something gets the responder, it can prevent others from responding by setting onPanResponderTerminationRequest: () => false,

> However, we often have troubles while interacting with touch interactions happening on the main thread, like the iOS slider, or any scroll views. The problem is that javascript cannot immediately reject the responsiveness of the native event, because the main thread must synchronously decide if JS or the scroll view should become responder, and JS can only respond asynchronously.

> This is a difficult problem to solve, and is something we have been thinking about for a while. cc @vjeux @sahrens @jordwalke @lelandrichardson. This could be solved in a similar way as @kmagiera is moving animations to the UI thread. Basically we construct and serialize some logic such that these immediate operations can be resolved without waiting for the JS thread.

Due to this issue, and the fact that ReactNative `ScrollView` wraps a native `ReactScrollView`, `PanResponder` can not totally block gestures from passing to the native scrollview. As a result, sometimes when we try to pull down to refresh, gestures are absorbed by native scrollview to show an overscroll effect, not the pulldown of loading layout.

To solve this problem, the demo processes gestures in native code, then export the native view to ReactNative's js realm. Based on widely-known [chrisbanes/Android-PullToRefresh](https://github.com/chrisbanes/Android-PullToRefresh), the demo simplifies its code, deleting unnecessary mode & attribute, retaining just the gesture processing part: [RCTPullToRefreshScrollView.java](./android/app/src/main/java/com/rntaobao/pullToRefresh/view/RCTPullToRefreshScrollView.java). Then the demo exports it to js realm by [RCTPullToRefreshScrollViewManager.java](./android/app/src/main/java/com/rntaobao/pullToRefresh/viewManager/RCTPullToRefreshScrollViewManager.java), the js component is [PullToRefreshScrollView.js](./view/PullToRefreshScrollView.js).

Another problem is how to define loading layout in js, not in java. This offers flexibility to hot reload the UI of loading layout. Intuitively, the demo tries to pass js element to native view by [Props](https://facebook.github.io/react-native/docs/props.html). But this doesn't work since [Native UI Components](https://facebook.github.io/react-native/docs/native-components-android.html) only imports props of primitive types, or simple data structure such as `ReadableArray` & `ReadableMap`. 

To hack this, the demo defines a native [RCTPullToRefreshLoadingLayout.java](./android/app/src/main/java/com/rntaobao/pullToRefresh/view/RCTPullToRefreshLoadingLayout.java), exports it to js by [RCTPullToRefreshLoadingLayoutManager.java](./android/app/src/main/java/com/rntaobao/pullToRefresh/viewManager/RCTPullToRefreshLoadingLayoutManager.java), the js component is [PullToRefreshLoadingLayout.js](./view/PullToRefreshLoadingLayout.js). When the js component of this view, `<RCTPullToRefreshLoadingLayout>` is added as a child of `<RCTPullToRefreshScrollView>`, on the java side, `RCTPullToRefreshLoadingLayout` is also added as a child of `RCTPullToRefreshScrollView`. Override the `addView` method of `RCTPullToRefreshScrollView` to search for instance of `RCTPullToRefreshLoadingLayout`. Once found, the demo gets the reference to it, i.e. the loading layout defined in js. With this reference, further manipulation with the loading layout is possible on java side.

Notably, to support the negative padding necessary for the pull down effect, `RCTPullToRefreshScrollView` should handle its own layout, rather than leaving it to js. This is made possible by:
```java
    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }
```
in `RCTPullToRefreshScrollViewManager`.

### CircleProgressBar's implementation

The circle progress bar in loading layout, is drawn by [react-native-svg](https://www.npmjs.com/package/react-native-svg) and [d3-shape](https://www.npmjs.com/package/d3-shape). The idea comes from [fdnhkj/react-native-conical-gradient](https://github.com/fdnhkj/react-native-conical-gradient). Related code: [CircularProgressBarSvg.js](./view/CircularProgressBarSvg.js).

The demo also provides a `ART` version of circle progress bar. Sadly `ART` has NO official documentation: [react-native/issues/4789](https://github.com/facebook/react-native/issues/4789), and it frequently crashes (reason still not known). Related code: [CircularProgressBarART.js](./view/CircularProgressBarART.js).

### TabNavigation's implementation
TabNavigation is supported by [react-native-tab-navigator](https://www.npmjs.com/package/react-native-tab-navigator). One thing to mention is that the `SceneContainer` of this lib uses a style of `position: absolute`, making the scene content actually takes up the whole space of its parent view. For this demo, the `SceneContainer` is set to fixed height, which is the screen height minus tabBar height.

