/**
 * 图片预加载
 *
 *  loadImages(["url1.png", 'url2.png'], function() {
 *      // do
 *  });
 *
 * @author mzhou
 * @log 0.1 init
 */

G.def('loadImages', function() {
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
            callback();
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
                checkLoaded = function() {
                    loadedCount++;
                    if (l === loadedCount) {
                        callback();
                    }
                };

            for (; i<l; i++) {
                loadOneImage(urls[i], checkLoaded);
            }
        } else {
            return loadOneImage(urls, callback);
        }
    };
});
