package com.toutiao;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

public class RCTPullToRefreshScrollViewManager extends ViewGroupManager<RCTPullToRefreshScrollView> {

    public static final String REACT_CLASS_NAME = "RCTPullToRefreshScrollView";

    @Override
    protected RCTPullToRefreshScrollView createViewInstance(ThemedReactContext reactContext) {
        RCTPullToRefreshScrollView v = new RCTPullToRefreshScrollView(reactContext);
        return v;
    }

    @Override
    public String getName() {
        return REACT_CLASS_NAME;
    }

}
