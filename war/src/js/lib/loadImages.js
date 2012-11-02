/**
 * 图片预加载
 *
 *  loadImages(["url1.png", 'url2.png'], function(loadedUrls) {
 *      var i = 0,
 *          l = loadedUrls.length;
 *      for (; i<l; i++) {
 *          console.log(loadedUrls[i]);
 *      }
 *  });
 *
 * @author mzhou
 * @log 0.1 init
 */

/*jshint undef:true, browser:true, noarg:true, curly:true, regexp:true, newcap:true, trailing:false, noempty:true, regexp:false, strict:true, evil:true, funcscope:true, iterator:true, loopfunc:true, multistr:true, boss:true, eqnull:true, eqeqeq:false, undef:true */
/*global G:false, $:false, GLOBAL:false, alert:false */

G.def('loadImages', function() {
    'use strict';
    var loadOneImage = function(url, callback) {
        var img = new Image();
            img.src = url;

        // 命中缓存
        if (img.complete) {
            img = null;
            callback();
            return;
        }

        img.onload = function () {
            img = null;
            callback(true);
        };
        img.onabort = img.onerror = function() {
            img = null;
            callback(false);
        };
    };

    /**
     * 预加载图片
     *
     * @param {array/string} urls
     * @param {fucntion} callback
     */
    return function(urls, callback) {
        if (G.type(urls) === 'array') {
            urls = urls.concat();
            var i = 0,
                l = urls.length,
                loadedCount = 0,
                successUrls = [];

            for (; i<l; i++) {
                (function(url) {
                    loadOneImage(url, function(isSuccess) {
                        if (isSuccess) {
                            successUrls.push(url);
                        }
                        loadedCount++;
                        if (l === loadedCount) {
                            callback(successUrls);
                        }
                    });
                })(urls[i]);
            }
        } else {
            return loadOneImage(urls, function(isSuccess) {
                callback(isSuccess ? [urls] : []);
            });
        }
    };
});
