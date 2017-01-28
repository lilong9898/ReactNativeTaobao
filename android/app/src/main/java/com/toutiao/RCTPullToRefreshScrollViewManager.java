package com.toutiao;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.handmark.pulltorefresh.library.PullToRefreshBase;

import android.widget.ScrollView;

public class RCTPullToRefreshScrollViewManager extends ViewGroupManager<RCTPullToRefreshScrollView> {

    public static final String REACT_CLASS_NAME = "RCTPullToRefreshScrollView";

    @Override
    protected RCTPullToRefreshScrollView createViewInstance(final ThemedReactContext reactContext) {

        final RCTPullToRefreshScrollView v = new RCTPullToRefreshScrollView(reactContext);

        // PullEventListener接收到的pull event, 向js端的对应回调发送
        v.setOnPullEventListener(new PullToRefreshBase.OnPullEventListener<ScrollView>() {
            @Override
            public void onPullEvent(PullToRefreshBase<ScrollView> refreshView, PullToRefreshBase.State state, PullToRefreshBase.Mode direction) {
                WritableMap event = Arguments.createMap();
                event.putString("pullState", state.name());
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(v.getId(), "topChange", event);
            }
        });

        return v;
    }

    @Override
    public String getName() {
        return REACT_CLASS_NAME;
    }

}
