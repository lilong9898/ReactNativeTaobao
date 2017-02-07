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
ReactNative provides [ViewPagerAndroid](http://reactnative.cn/docs/0.41/viewpagerandroid.html#content) as a component to fullfill similar function of native ViewPager. In fact it just wraps ReactViewPager. The drawback of simply using ViewPagerAndroid is lack of flexibility: e.g., it's impossible to slide the content in vertical direction. 

