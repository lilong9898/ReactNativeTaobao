package com.rntaobao;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.horcrux.svg.SvgPackage;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Nullable;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            ArrayList<ReactPackage> packages = new ArrayList<ReactPackage>();
            packages.add(new MainReactPackage());
            packages.add(new CustomPackages());
            packages.add(new SvgPackage());
            return packages;
        }

        /**
         * 这个方法可以让RN从指定的路径加载jsBundle
         * 热更新的原理就是在下次启动前，下载新的jsBundle并放到这个路径上
         * */
        @Nullable
        @Override
        protected String getJSBundleFile() {
            return super.getJSBundleFile();
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
