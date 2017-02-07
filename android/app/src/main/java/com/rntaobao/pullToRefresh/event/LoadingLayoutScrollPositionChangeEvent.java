package com.rntaobao.pullToRefresh.event;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * {@link com.rntaobao.pullToRefresh.view.RCTPullToRefreshScrollView.OnLoadingLayoutScrollPositionChangeListener}
 * 所监听到的{@link com.rntaobao.pullToRefresh.view.RCTPullToRefreshLoadingLayout}的滑动距离的变化
 * 将变化发送给js端
 */

public class LoadingLayoutScrollPositionChangeEvent extends Event {

    public static final String EVENT_NAME = "loadingLayoutScrollPositionChange";
    public static final String MESSAGE_NAME = "loadingLayoutScrollPositionRatio";

    private float mLoadingLayoutScrollPositionRatio;

    public LoadingLayoutScrollPositionChangeEvent(int viewId, float loadingLayoutScrollPositionRatio) {
        super(viewId);
        mLoadingLayoutScrollPositionRatio = loadingLayoutScrollPositionRatio;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        WritableMap message = Arguments.createMap();
        message.putDouble(MESSAGE_NAME, mLoadingLayoutScrollPositionRatio);
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), message);
    }

}
