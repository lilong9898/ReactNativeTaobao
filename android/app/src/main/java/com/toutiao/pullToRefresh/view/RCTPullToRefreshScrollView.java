package com.toutiao.pullToRefresh.view;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.scroll.ReactScrollView;
import com.facebook.react.views.view.ReactViewGroup;

import android.support.v4.view.ViewCompat;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.ViewGroup;
import android.view.animation.DecelerateInterpolator;
import android.view.animation.Interpolator;
import android.widget.LinearLayout;

/**
 * 带下拉刷新功能的scrollView
 */

public class RCTPullToRefreshScrollView extends LinearLayout {

    private ThemedReactContext mContext;

    // ===========================================================
    // Constants
    // ===========================================================

    /**
     * DEBUG模式下会输出log
     */
    static final boolean DEBUG = true;
    /**
     * log tag
     */
    static final String LOG_TAG = "PullToRefresh";
    /**
     * {@link #smoothScrollTo(int)}方法使用的默认滚动时间
     */
    public static final int SMOOTH_SCROLL_DURATION_MS = 200;
    /**
     * 下拉拉出{@link RCTPullToRefreshLoadingLayout}时，滑动的距离时拉出距离的{@value #FRICTION}倍
     */
    static final float FRICTION = 2.0f;


    /**
     * 系统需要手势移动多少像素，才认为时开始scroll
     * {@link ViewConfiguration#getScaledTouchSlop()}
     */
    private int mTouchSlop;
    private float mLastMotionX, mLastMotionY;
    private float mInitialMotionX, mInitialMotionY;
    private boolean mIsBeingDragged = false;

    /**
     * 本控件在状态机中的状态，见{@link State}
     */
    private State mState = State.RESET;

    /**
     * 在{@link State#REFRESHING}{@link State#MANUAL_REFRESHING}时
     * {@link RCTPullToRefreshLoadingLayout}是完全缩回去还是保留底端的状态文字部分
     * 见{@link #onRefreshing(boolean)}
     */
    private boolean mShowPartOfTheLoadingLayoutWhileRefreshing = true;

    /**
     * 更新时是否允许滑动
     */
    private boolean mAllowScrollingWhileRefreshingEnabled = false;

    /**
     * 判断是否进入drag过程时，是否考虑横向和纵向上滑动距离的对比
     */
    private boolean mFilterTouchEventsByDirectionDiffComparison = true;

    private OnRefreshListener mOnRefreshListener;
    private OnPullStateChangeListener mOnPullStateChangeListener;

    private Interpolator mScrollAnimationInterpolator;

    private RCTPullToRefreshLoadingLayout mLoadingLayout;
    private ReactScrollView mScrollView;

    private SmoothScrollRunnable mCurrentSmoothScrollRunnable;

    public RCTPullToRefreshScrollView(ThemedReactContext context) {
        super(context);
        init(context);
    }

    private void init(ThemedReactContext context) {

        mContext = context;

        ViewConfiguration config = ViewConfiguration.get(context);
        mTouchSlop = config.getScaledTouchSlop();

    }

    /**
     * 提取js中定义的{@link RCTPullToRefreshLoadingLayout}和{@link ReactScrollView}，以便在java中操作
     */
    @Override
    public void addView(View child, int index, ViewGroup.LayoutParams params) {

        if (child instanceof ReactViewGroup) {

            ReactViewGroup vg = (ReactViewGroup) child;
            for (int i = 0; i < vg.getChildCount(); i++) {
                View v = vg.getChildAt(i);
                if (v instanceof RCTPullToRefreshLoadingLayout) {
                    mLoadingLayout = (RCTPullToRefreshLoadingLayout) v;
                } else if (v instanceof ReactScrollView) {
                    mScrollView = (ReactScrollView) v;
                }
            }

        }

        super.addView(child, index, params);
    }

    /**
     * 本控件的实际大小确定以后，按{@link RCTPullToRefreshLoadingLayout}的高度设置负的padding以便隐藏它
     */
    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);

        int pLeft = getPaddingLeft();
        int pTop = getPaddingTop();
        int pRight = getPaddingRight();
        int pBottom = getPaddingBottom();

        pTop = -mLoadingLayout.getHeight();
        setPadding(pLeft, pTop, pRight, pBottom);
    }

    public final boolean isRefreshing() {
        return mState == State.REFRESHING || mState == State.MANUAL_REFRESHING;
    }

    protected boolean isReadyForPull() {
        return mScrollView.getScrollY() == 0;
    }

    @Override
    public final boolean onInterceptTouchEvent(MotionEvent event) {

        final int action = event.getAction();

        if (action == MotionEvent.ACTION_CANCEL || action == MotionEvent.ACTION_UP) {
            mIsBeingDragged = false;
            return false;
        }

        if (action != MotionEvent.ACTION_DOWN && mIsBeingDragged) {
            return true;
        }

        switch (action) {
            case MotionEvent.ACTION_MOVE: {
                // If we're refreshing, and the flag is set. Eat all MOVE events
                if (!mAllowScrollingWhileRefreshingEnabled && isRefreshing()) {
                    return true;
                }

                if (isReadyForPull()) {
                    final float y = event.getY(), x = event.getX();
                    final float effectiveDirectionDiff, ineffectiveDirectionDiff, absEffectiveDirectionDiff;

                    effectiveDirectionDiff = y - mLastMotionY;
                    ineffectiveDirectionDiff = x - mLastMotionX;

                    absEffectiveDirectionDiff = Math.abs(effectiveDirectionDiff);

                    if (absEffectiveDirectionDiff > mTouchSlop && (!mFilterTouchEventsByDirectionDiffComparison || absEffectiveDirectionDiff > Math.abs(ineffectiveDirectionDiff))) {
                        if (effectiveDirectionDiff >= 1f && isReadyForPull()) {
                            mLastMotionY = y;
                            mLastMotionX = x;
                            mIsBeingDragged = true;
                        }
                    }
                }
                break;
            }
            case MotionEvent.ACTION_DOWN: {
                if (isReadyForPull()) {
                    mLastMotionY = mInitialMotionY = event.getY();
                    mLastMotionX = mInitialMotionX = event.getX();
                    mIsBeingDragged = false;
                }
                break;
            }
        }

        return mIsBeingDragged;
    }

    @Override
    public final boolean onTouchEvent(MotionEvent event) {

        // 如果正在正在更新中，且更新时不允许滑动，则抛弃该手势
        if (!mAllowScrollingWhileRefreshingEnabled && isRefreshing()) {
            return true;
        }

        if (event.getAction() == MotionEvent.ACTION_DOWN && event.getEdgeFlags() != 0) {
            return false;
        }

        switch (event.getAction()) {
            case MotionEvent.ACTION_MOVE: {
                if (mIsBeingDragged) {
                    mLastMotionY = event.getY();
                    mLastMotionX = event.getX();
                    scrollTheWholeView();
                    return true;
                }
                break;
            }

            case MotionEvent.ACTION_DOWN: {
                if (isReadyForPull()) {
                    mLastMotionY = mInitialMotionY = event.getY();
                    mLastMotionX = mInitialMotionX = event.getX();
                    return true;
                }
                break;
            }

            case MotionEvent.ACTION_CANCEL:
            case MotionEvent.ACTION_UP: {
                if (mIsBeingDragged) {
                    mIsBeingDragged = false;

                    /**
                     * 需要{@link mOnRefreshListener}存在才能进入{@link State#REFRESHING}状态
                     * 否则直接退回{@link State#RESET}状态
                     * 原因见{@link OnRefreshListener}
                     * */
                    if (mState == State.RELEASE_TO_REFRESH && mOnRefreshListener != null) {
                        setState(State.REFRESHING, true);
                        return true;
                    }

                    // If we're already refreshing, just scroll back to the top
                    if (isRefreshing()) {
                        smoothScrollTo(0);
                        return true;
                    }

                    // If we haven't returned by here, then we're not in a mState
                    // to pull, so just reset
                    setState(State.RESET);

                    return true;
                }
                break;
            }
        }

        return false;
    }

    // TODO
    private int getLoadingLayoutContentHeight() {
        return mLoadingLayout.getHeight() / 2;
    }

    /**
     * 平滑滚动到指定位置，滚动时间为{@value #SMOOTH_SCROLL_DURATION_MS} ms.
     */
    protected final void smoothScrollTo(int scrollValue) {
        smoothScrollTo(scrollValue, SMOOTH_SCROLL_DURATION_MS);
    }

    protected final void smoothScrollTo(int scrollValue, OnSmoothScrollFinishedListener listener) {
        smoothScrollTo(scrollValue, SMOOTH_SCROLL_DURATION_MS, 0, listener);
    }

    private final void smoothScrollTo(int scrollValue, long duration) {
        smoothScrollTo(scrollValue, duration, 0, null);
    }

    private final void smoothScrollTo(int newScrollValue, long duration, long delayMillis,
                                      OnSmoothScrollFinishedListener listener) {
        if (null != mCurrentSmoothScrollRunnable) {
            mCurrentSmoothScrollRunnable.stop();
        }

        final int oldScrollValue = getScrollY();

        if (oldScrollValue != newScrollValue) {
            if (null == mScrollAnimationInterpolator) {
                // Default interpolator is a Decelerate Interpolator
                mScrollAnimationInterpolator = new DecelerateInterpolator();
            }
            mCurrentSmoothScrollRunnable = new SmoothScrollRunnable(oldScrollValue, newScrollValue, duration, listener);

            if (delayMillis > 0) {
                postDelayed(mCurrentSmoothScrollRunnable, delayMillis);
            } else {
                post(mCurrentSmoothScrollRunnable);
            }
        }
    }

    /**
     * 进入{@link State#RESET}状态时触发
     */
    private void onReset() {
        mIsBeingDragged = false;
        smoothScrollTo(0);
    }

    /**
     * 进入{@link State#PULL_TO_REFRESH}状态时触发
     */
    private void onPullToRefresh() {
        // NO-OP
    }

    /**
     * 进入{@link State#RELEASE_TO_REFRESH}状态时触发
     */
    private void onReleaseToRefresh() {
        // NO-OP
    }

    /**
     * 外界刷新完成后，调用本方法通知{@link RCTPullToRefreshLoadingLayout}区域滚动至屏幕外从而隐藏
     */
    public void notifyRefreshComplete() {
        if (isRefreshing()) {
            setState(State.RESET);
        }
    }

    /**
     * 进入{@link State#REFRESHING}和{@link State#MANUAL_REFRESHING}时触发
     *
     * @param doScroll 此时{@link RCTPullToRefreshLoadingLayout}是否要缩回去全部或者一部分
     */
    private void onRefreshing(final boolean doScroll) {

        if (doScroll) {
            /**
             * {@link RCTPullToRefreshLoadingLayout}缩回去一部分，缩回的是底端的状态文字部分
             * */
            if (mShowPartOfTheLoadingLayoutWhileRefreshing) {

                // Call Refresh Listener when the Scroll has finished
                OnSmoothScrollFinishedListener listener = new OnSmoothScrollFinishedListener() {
                    @Override
                    public void onSmoothScrollFinished() {
                        callRefreshListener();
                    }
                };

                smoothScrollTo(-getLoadingLayoutContentHeight(), listener);
            }
            /**
             * {@link RCTPullToRefreshLoadingLayout}全部缩回去
             * */
            else {
                smoothScrollTo(0);
            }
        }
        /**
         * {@link RCTPullToRefreshLoadingLayout}维持完全显示状态，等{@link OnRefreshListener}回调中调到{@link #notifyRefreshComplete()}再缩回去
         * */
        else {
            callRefreshListener();
        }
    }

    private void callRefreshListener() {
        if (null != mOnRefreshListener) {
            mOnRefreshListener.onRefresh(this);
        }
    }

    /**
     * 不是由手势触发的直接将{@link State}转移到{@link State#MANUAL_REFRESHING}的情况
     * 目前<strong>暂无</strong>使用场景
     */
    public void moveToRefreshingStateNotByGesture() {
        moveToRefreshingStateNotByGesture(true);
    }

    private void moveToRefreshingStateNotByGesture(boolean doScroll) {
        if (!isRefreshing()) {
            setState(State.MANUAL_REFRESHING, doScroll);
        }
    }

    private void setState(State state, final boolean... params) {

        mState = state;

        if (null != mOnPullStateChangeListener) {
            mOnPullStateChangeListener.onPullStateChange(this, mState);
        }

        if (DEBUG) {
            Log.d(LOG_TAG, "State: " + mState.name());
        }

        switch (mState) {
            case RESET:
                onReset();
                break;
            case PULL_TO_REFRESH:
                onPullToRefresh();
                break;
            case RELEASE_TO_REFRESH:
                onReleaseToRefresh();
                break;
            case REFRESHING:
            case MANUAL_REFRESHING:
                onRefreshing(params[0]);
                break;
            case OVERSCROLLING:
                // NO-OP
                break;
        }

    }

    /**
     * {@link #scrollTheWholeViewImpl(int)}中能滚动到的最大位置
     */
    private int getMaximumPullScroll() {
        return Math.round(getHeight() / FRICTION);
    }

    /**
     * 根据新的手势，将本控件滚动到合适的位置，制造{@link RCTPullToRefreshLoadingLayout}的显示和隐藏效果
     * <strong>内部根据手势计算新的滚动值，并转换了{@link State}, 最终调用{@link #scrollTheWholeViewImpl(int)}</strong>
     */
    private void scrollTheWholeView() {

        final int newScrollValue;
        final int itemDimension;
        final float initialMotionValue, lastMotionValue;

        initialMotionValue = mInitialMotionY;
        lastMotionValue = mLastMotionY;

        newScrollValue = Math.round(Math.min(initialMotionValue - lastMotionValue, 0) / FRICTION);
        itemDimension = getLoadingLayoutContentHeight();

        scrollTheWholeViewImpl(newScrollValue);

        if (newScrollValue != 0 && !isRefreshing()) {

            float scale = Math.abs(newScrollValue) / (float) itemDimension;

            //TODO

            if (mState != State.PULL_TO_REFRESH && itemDimension >= Math.abs(newScrollValue)) {
                setState(State.PULL_TO_REFRESH);
            } else if (mState == State.PULL_TO_REFRESH && itemDimension < Math.abs(newScrollValue)) {
                setState(State.RELEASE_TO_REFRESH);
            }
        }
    }

    /**
     * 根据新的滚动值，将本控件滚动到合适的位置，制造{@link RCTPullToRefreshLoadingLayout}的显示和隐藏效果
     */
    private final void scrollTheWholeViewImpl(int value) {

        if (DEBUG) {
            Log.d(LOG_TAG, "scrollTheWholeViewImpl: " + value);
        }

        // 滑动位置要在[0, maximumPullScroll]之间
        final int maximumPullScroll = getMaximumPullScroll();
        value = Math.min(0, Math.max(-maximumPullScroll, value));

        scrollTo(0, value);
    }

    /**
     * 用户拖动控件，拖动到不同位置时，控件会进入状态机的不同状态，以便决定{@link RCTPullToRefreshLoadingLayout}区域的显示内容
     */
    public enum State {

        /**
         * 状态机的初始状态:{@link RCTPullToRefreshLoadingLayout}隐藏，用户没有开始下拉开始刷新
         */
        RESET(0x0),

        /**
         * 用户下拉刷新，但拖动距离<strong>不够</strong>松手后可以判定为需要刷新的程度
         */
        PULL_TO_REFRESH(0x1),

        /**
         * 用户下拉刷新，而且拖动距离<strong>已经够</strong>松手后可以判定为需要刷新的程度
         */
        RELEASE_TO_REFRESH(0x2),

        /**
         * 用户在{@link State#RELEASE_TO_REFRESH}状态下松手，开始刷新
         */
        REFRESHING(0x8),

        /**
         * 不是通过用户手势，而是通过{@link #moveToRefreshingStateNotByGesture()}直接启动刷新的情况下，进入该状态
         * <strong>暂无</strong>该场景
         */
        MANUAL_REFRESHING(0x9),

        /**
         * 在{@link android.os.Build.VERSION_CODES#GINGERBREAD}版本的系统上，
         * {@link android.widget.ScrollView#overScrollBy(int, int, int, int, int, int, int, int, boolean)}方法中，
         * 模拟overscroll效果时会进入该状态
         * <strong>暂无</strong>该场景
         */
        OVERSCROLLING(0x10);

        /**
         * 根据{@link State}的名字获得对应枚举值
         */
        static State mapIntToValue(final int stateInt) {
            for (State value : State.values()) {
                if (stateInt == value.getIntValue()) {
                    return value;
                }
            }

            // 默认返回
            return RESET;
        }

        private int mIntValue;

        State(int intValue) {
            mIntValue = intValue;
        }

        int getIntValue() {
            return mIntValue;
        }
    }

    /**
     * {@link #smoothScrollTo(int)}时用的实际执行动画
     */
    private class SmoothScrollRunnable implements Runnable {

        private final Interpolator mInterpolator;
        private final int mScrollToY;
        private final int mScrollFromY;
        private final long mDuration;
        private OnSmoothScrollFinishedListener mListener;

        private boolean mContinueRunning = true;
        private long mStartTime = -1;
        private int mCurrentY = -1;

        public SmoothScrollRunnable(int fromY, int toY, long duration, OnSmoothScrollFinishedListener listener) {
            mScrollFromY = fromY;
            mScrollToY = toY;
            mInterpolator = mScrollAnimationInterpolator;
            mDuration = duration;
            mListener = listener;
        }

        @Override
        public void run() {

            /**
             * Only set mStartTime if this is the first time we're starting,
             * else actually calculate the Y delta
             */
            if (mStartTime == -1) {
                mStartTime = System.currentTimeMillis();
            } else {

                /**
                 * We do do all calculations in long to reduce software float
                 * calculations. We use 1000 as it gives us good accuracy and
                 * small rounding errors
                 */
                long normalizedTime = (1000 * (System.currentTimeMillis() - mStartTime)) / mDuration;
                normalizedTime = Math.max(Math.min(normalizedTime, 1000), 0);

                final int deltaY = Math.round((mScrollFromY - mScrollToY)
                        * mInterpolator.getInterpolation(normalizedTime / 1000f));
                mCurrentY = mScrollFromY - deltaY;
                scrollTheWholeViewImpl(mCurrentY);
            }

            // If we're not at the target Y, keep going...
            if (mContinueRunning && mScrollToY != mCurrentY) {
                ViewCompat.postOnAnimation(RCTPullToRefreshScrollView.this, this);
            } else {
                if (null != mListener) {
                    mListener.onSmoothScrollFinished();
                }
            }
        }

        public void stop() {
            mContinueRunning = false;
            removeCallbacks(this);
        }
    }

    interface OnSmoothScrollFinishedListener {
        void onSmoothScrollFinished();
    }

    public void setOnRefreshListener(OnRefreshListener l) {
        mOnRefreshListener = l;
    }

    public void setOnPullStateChangeListener(OnPullStateChangeListener l) {
        mOnPullStateChangeListener = l;
    }

    /**
     * 当用户拖动控件，使得其状态改变时，通过该回调通知外界
     * 状态详见{@link State}
     */
    public interface OnPullStateChangeListener {
        void onPullStateChange(final RCTPullToRefreshScrollView v, State state);
    }

    /**
     * 本控件通过这个回调告诉外界应该开始刷新了
     * 外界刷新完成后调用本控件的{@link #notifyRefreshComplete}方法通知本控件数据刷新完毕，可以回滚隐藏{@link RCTPullToRefreshLoadingLayout}区域了
     * 如果外界不设置该回调，则外界无法通知本控件刷新完毕，则本控件不进入{@link State#REFRESHING}状态（否则<strong>无法</strong>,而是直接回到{@link State#RESET}状态
     */
    public interface OnRefreshListener {
        void onRefresh(final RCTPullToRefreshScrollView v);
    }


}
