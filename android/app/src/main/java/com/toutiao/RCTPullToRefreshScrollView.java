package com.toutiao;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.scroll.ReactScrollView;
import com.handmark.pulltorefresh.library.PullToRefreshScrollView;

import android.content.Context;
import android.util.AttributeSet;

public class RCTPullToRefreshScrollView extends PullToRefreshScrollView {

    public RCTPullToRefreshScrollView(Context context) {
        super(context);
    }

    @Override
    protected ReactScrollView createRefreshableView(Context context, AttributeSet attrs) {
        ReactScrollView scrollView = new ReactScrollView((ThemedReactContext) context);
        scrollView.setId(com.handmark.pulltorefresh.library.R.id.scrollview);
        return scrollView;
    }

    private final Runnable measureAndLayout = new Runnable() {
        @Override
        public void run() {
            measure(
                    MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                    MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
            layout(getLeft(), getTop(), getRight(), getBottom());
        }
    };

    // 导入到react中的原生viewgroup要自己发起measure和layout pass
    // 否则有可能会出现onMeasure中某一项尺寸为零的情况
    // 详见http://tickanswer.com/solved/6389347760/cannot-resize-linear-layout-children-in-android-react-native-module
    @Override
    public void requestLayout() {
        super.requestLayout();
        post(measureAndLayout);
    }

}
