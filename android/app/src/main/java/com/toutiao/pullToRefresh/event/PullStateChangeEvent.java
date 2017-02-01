package com.toutiao.pullToRefresh.event;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.toutiao.pullToRefresh.view.RCTPullToRefreshScrollView;

/**
 * {@link com.toutiao.pullToRefresh.view.RCTPullToRefreshScrollView.OnPullStateChangeListener}
 * 所监听到的{@link com.toutiao.pullToRefresh.view.RCTPullToRefreshScrollView.State}变化
 * 将改变化发送给js端
 */

public class PullStateChangeEvent extends Event<PullStateChangeEvent> {

    public static final String EVENT_NAME = "pullStateChange";
    public static final String MESSAGE_NAME = "state";

    public RCTPullToRefreshScrollView.State mState;

    public PullStateChangeEvent(int viewId, RCTPullToRefreshScrollView.State state) {
        super(viewId);
        mState = state;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        WritableMap message = Arguments.createMap();
        message.putString(MESSAGE_NAME, mState.name());
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), message);
    }
}
