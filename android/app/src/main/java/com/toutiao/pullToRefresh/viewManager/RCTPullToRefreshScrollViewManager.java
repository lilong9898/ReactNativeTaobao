package com.toutiao.pullToRefresh.viewManager;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.ViewGroupManager;
import com.toutiao.pullToRefresh.event.PullStateChangeEvent;
import com.toutiao.pullToRefresh.view.RCTPullToRefreshScrollView;

import java.util.Map;

import javax.annotation.Nullable;

/**
 * {@link RCTPullToRefreshScrollView}与js层的接口
 */

public class RCTPullToRefreshScrollViewManager extends ViewGroupManager<RCTPullToRefreshScrollView> {

    private static final String NAME = "RCTPullToRefreshScrollView";
    private static final String CUSTOM_DIRECT_EVENT_TYPE_CONSTANTS_FIELD_REGISTRATION_NAME = "registrationName";
    private static final String JS_CALLBACK_NAME_PULL_STATE_CHANGE = "onPullStateChange";

    @Override
    protected RCTPullToRefreshScrollView createViewInstance(ThemedReactContext reactContext) {
        return new RCTPullToRefreshScrollView(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    protected void addEventEmitters(final ThemedReactContext reactContext, RCTPullToRefreshScrollView view) {

        /**
         * {@link com.toutiao.pullToRefresh.view.RCTPullToRefreshScrollView.OnPullStateChangeListener}
         * 向js端发送{@link com.toutiao.pullToRefresh.view.RCTPullToRefreshScrollView.State}变化的信息
         * */
        view.setOnPullStateChangeListener(new RCTPullToRefreshScrollView.OnPullStateChangeListener() {
            @Override
            public void onPullStateChange(RCTPullToRefreshScrollView v, RCTPullToRefreshScrollView.State state) {

                PullStateChangeEvent event = new PullStateChangeEvent(v.getId(), state);
                reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher().dispatchEvent(event);

            }
        });
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        Map fieldMap = MapBuilder.of(CUSTOM_DIRECT_EVENT_TYPE_CONSTANTS_FIELD_REGISTRATION_NAME, JS_CALLBACK_NAME_PULL_STATE_CHANGE);
        Map constantMap = MapBuilder.of(PullStateChangeEvent.EVENT_NAME, fieldMap);
        return constantMap;
    }

    /**
     * 需要java来负责本层的layout而非js，以便支持{@link com.toutiao.pullToRefresh.view.RCTPullToRefreshLoadingLayout}效果所必须的负的padding设置
     * 而css不支持负的padding
     */
    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }
}
