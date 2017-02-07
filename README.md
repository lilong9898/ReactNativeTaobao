# First Page of Taobao Android Mobile App by ReactNative

## Demo
![](./demo/demo1.gif) ![](./demo/demo2.gif)

## How to run
1. Prepare your environment: [Requirements](http://facebook.github.io/react-native/docs/getting-started.html#requirements) and [Android Setup](http://facebook.github.io/react-native/docs/android-setup.html)
2. Clone this repo, and goto the project root directory
3. run `npm install`
4. run `react-native run-android`
5. Enjoy

## Platform & ReactNative version
Currently there's only Android implementation. So index.ios.js & ./ios are absent. 
React version of this demo is 15.4.1. ReactNative version of this demo is 0.41.2.

## Insight & Pitfalls

### ViewPager's implementation
ReactNative provides [ViewPagerAndroid](https://facebook.github.io/react-native/docs/viewpagerandroid.html) as a component to fullfill similar function of native ViewPager. In fact it just wraps ReactViewPager. The drawback of simply using ViewPagerAndroid is lack of flexibility: e.g., it's impossible to slide the content in vertical direction. Inspired by [race604/react-native-viewpager](https://github.com/race604/react-native-viewpager), the viewpager in this demo enhances it, adds more flexibility such as control of slide direction, pager indicator style & position, etc. In this demo, there are both horizontal & vertical sliding viewpagers.

Related code: [CustomViewPager](./view/CustomViewPager.js).

### PullToRefresh's implementation
At first the demo tries to implement a pull-to-refresh-scrollview in pure js, using [ScrollView](https://facebook.github.io/react-native/docs/scrollview.html), [PanResponder](https://facebook.github.io/react-native/docs/panresponder.html) and [Animated](https://facebook.github.io/react-native/docs/animated.html). Basic idea is to concatenate a loading layout and a scrollView: when loading layout is hidden, scrollView is receiving gestures. When loading layout is pulled out to show, panresponder is receiving gestures, so scrollview receives no gesture, and loading layout is pulled out using Animation. However, this idea encounters a gesture processing problem : [react-native/issue/1046](https://github.com/facebook/react-native/issues/1046), which indicates:
> Ideally, once something gets the responder, it can prevent others from responding by setting onPanResponderTerminationRequest: () => false,

> However, we often have troubles while interacting with touch interactions happening on the main thread, like the iOS slider, or any scroll views. The problem is that javascript cannot immediately reject the responsiveness of the native event, because the main thread must synchronously decide if JS or the scroll view should become responder, and JS can only respond asynchronously.

> This is a difficult problem to solve, and is something we have been thinking about for a while. cc @vjeux @sahrens @jordwalke @lelandrichardson. This could be solved in a similar way as @kmagiera is moving animations to the UI thread. Basically we construct and serialize some logic such that these immediate operations can be resolved without waiting for the JS thread.

Due to this issue, and the fact that ReactNative scrollView wraps a native scrollView, panresponder can not totally block gestures from passing to the native scrollview. As a result, sometimes when we try to pull down to refresh, gestures are absorbed by native scrollview to show an overscroll effect, not the pulldown of loading layout.

To solve this problem, the demo processes gestures in native code, then export the native view to ReactNative's js realm. Based on widely-known [chrisbanes/Android-PullToRefresh](https://github.com/chrisbanes/Android-PullToRefresh), the demo simplifies its code, deleting unnecessary mode & attribute, retaining just the gesture processing part: [RCTPullToRefreshScrollView.java](./android/app/src/main/java/com/rntaobao/pullToRefresh/view/RCTPullToRefreshScrollView.java). The demo exports it to js realm by [RCTPullToRefreshScrollViewManager.java](./android/app/src/main/java/com/rntaobao/pullToRefresh/viewManager/RCTPullToRefreshScrollViewManager.java).

Another problem is how to define loading layout in js, not in java. This offers flexibility to hot reload the UI of loading layout. Intuitively, the demo tries to pass js element to native view by [Props](https://facebook.github.io/react-native/docs/props.html). But this doesn't work since [Native UI Components](https://facebook.github.io/react-native/docs/native-components-android.html) only imports props of primitive types, or simple data structure such as ReadableArray & 'ReadableMap'.
