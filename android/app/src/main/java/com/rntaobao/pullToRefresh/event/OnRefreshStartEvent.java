package com.rntaobao.pullToRefresh.event;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * {@link com.rntaobao.pullToRefresh.view.RCTPullToRefreshScrollView.OnRefreshListener}
 * 所监听到的刷新开始的信号，将此信号发送给js端
 */

public class OnRefreshStartEvent extends Event {

    public static final String EVENT_NAME = "onRefreshStart";

    public OnRefreshStartEvent(int viewId) {
        super(viewId);
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        WritableMap message = Arguments.createMap();
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), message);
    }
}
