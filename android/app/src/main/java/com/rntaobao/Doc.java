/**
 * 最终生成的apk是ReactNativeTaobao/android/app/build/outputs/apk/app-debug.apk
 * apk结构：
 *
 * - lib目录:                   合计2M多
 *   - libjsc.so                2M
 *   - libicu_common.so         600k
 *   - libnustl_shared.so       400k
 *   - libreactnativejnifb.so   300k
 *   - libimagepipeline.so      200k
 *   - libfolly_json.so         80k
 *   - libyoga.so               70k
 *   - libfb.so                 50k
 *   - liblog.so                40k
 *   - libglog.so               40k
 *   - libglog_init.so          20k
 *   - libreactnativejni.so     20k
 * - assets目录：
 * 　- index.android.bundle      ....    文本文件，集合了用户和系统的js代码
 *   - index.android.bundle.meta ....
 * - resources.arsc
 * - META-INF目录
 * - AndroidManifest.xml
 *
 * RN支持热更新，有API层面的支持，这个API就是{@link com.facebook.react.ReactNativeHost#getJSBundleFile()}
 * 这个方法可以指定RN从哪个路径上加载jsBundle，所以只要在下次启动前下载新的bundle并放到这个位置上就行了
 * */

