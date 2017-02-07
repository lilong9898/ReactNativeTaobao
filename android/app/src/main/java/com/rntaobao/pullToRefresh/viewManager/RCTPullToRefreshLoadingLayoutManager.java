package com.rntaobao.pullToRefresh.viewManager;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.rntaobao.pullToRefresh.view.RCTPullToRefreshLoadingLayout;

/**
 * Created by lilong on 17-1-31.
 */

public class RCTPullToRefreshLoadingLayoutManager extends ViewGroupManager<RCTPullToRefreshLoadingLayout> {

    private static final String NAME = "RCTPullToRefreshLoadingLayout";

    @Override
    protected RCTPullToRefreshLoadingLayout createViewInstance(ThemedReactContext reactContext) {
        return new RCTPullToRefreshLoadingLayout(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }

}
