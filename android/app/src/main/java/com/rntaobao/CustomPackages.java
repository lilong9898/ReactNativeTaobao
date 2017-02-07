package com.rntaobao;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.rntaobao.pullToRefresh.viewManager.RCTPullToRefreshLoadingLayoutManager;
import com.rntaobao.pullToRefresh.viewManager.RCTPullToRefreshScrollViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CustomPackages implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        ArrayList<ViewManager> list = new ArrayList<ViewManager>();
        list.add(new RCTPullToRefreshScrollViewManager());
        list.add(new RCTPullToRefreshLoadingLayoutManager());
        return list;
    }

}
