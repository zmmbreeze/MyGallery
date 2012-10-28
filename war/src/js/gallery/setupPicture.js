
/*jshint undef:true, browser:true, noarg:true, curly:true, regexp:true, newcap:true, trailing:false, noempty:true, regexp:false, strict:true, evil:true, funcscope:true, iterator:true, loopfunc:true, multistr:true, boss:true, eqnull:true, eqeqeq:false, undef:true */
/*global G:false, $:false, alert:false */

//@import "./setupLayout.js";
//@import "../lib/loadImages.js";

G.def(
    './gallery/setupPicture',
    ['./setupLayout', 'loadImages'],
    function(setupLayout, loadImages) {
        'use strict';

        // --- load pics ---
        var $pics = $('#pics'),
            picTmpl = '<li>\
                        <a href="{url}" target="_blank"><img src="{url}"/></a>\
                        <p class="ellipsis">{fileName}<br/>{uploadTime}</p>\
                        <a href="javascript:void 0;" data-id="{id}" data-do="deletePics" class="icon-close">删除</a>\
                    </li>',
            $pullUp = $('#pullUp'),
            pageSize = 10,
            oldCursor,
            cursor,
            picsApi = {
                /**
                 * 获取图片
                 * @param {string} c cursor
                 * @param {function} cb callback
                 */
                getPicsApi: function(c, cb) {
                    $.ajax({
                        url: '/api/pic/',
                        data: {pageSize: pageSize, cursor: c || ''},
                        success: function(data) {
                            var html = [],
                                sameCursor = cursor === data.cursor,
                                noMoreData = (data.pics.length < pageSize) || sameCursor,
                                urls = [];

                            if (!sameCursor) {
                                G.each(data.pics, function(v) {
                                    urls.push(v.url);
                                    html.push(G.format(picTmpl, v));
                                });
                                // preload image
                                loadImages(urls, function() {
                                    cb.call(this, html.join(''), noMoreData);
                                    cursor = data.cursor;
                                });
                            } else {
                                cb.call(this, '', noMoreData);
                            }
                        },
                        cache: false,
                        dataType: 'json'
                    });
                },
                lock: false,
                /**
                 * 加载更多图片
                 */
                loadMorePics: function () {
                    if (picsApi.lock) {
                        return;
                    }
                    picsApi.lock = true;
                    $pullUp.css('opacity', 0.5);
                    picsApi.getPicsApi(cursor, function(html, noMoreData) {
                        $pics.append(html);
                        if (noMoreData) {
                            $pullUp.hide();
                        }
                        $pullUp.css('opacity', 1);
                        picsApi.lock = false;
                    });
                },
                /**
                 * 更新图片
                 */
                updatePics: function() {
                    if (picsApi.lock) {
                        return;
                    }
                    picsApi.lock = true;
                    $pullUp.css('opacity', 0.5);
                    picsApi.getPicsApi(null, function(html, noMoreData) {
                        $pics.html(html);
                        if (noMoreData) {
                            $pullUp.hide();
                        } else {
                            $pullUp.show();
                        }
                        $pullUp.css('opacity', 1);
                        picsApi.lock = false;
                    });
                },
                /**
                 * 在最前面插入图片
                 */
                prependPicture: function(data) {
                    $pics.prepend(G.format(picTmpl, data));
                }
            };

        picsApi.updatePics();
        $pullUp.click(picsApi.loadMorePics);

        // --- setup edit ---
        var $container = setupLayout.$container,
            $startEdit = $('#startEdit'),
            startEditing = false;

        // 进入与离开编辑模式
        $startEdit.click(function() {
            if (startEditing) {
                startEditing = false;
                $startEdit.text('编辑');
                $container.removeClass('start-edit');
            } else {
                startEditing = true;
                $startEdit.text('取消编辑');
                $container.addClass('start-edit');
            }
        });
        // 删除图片
        $container.delegate('a[data-do=deletePics]', 'click', function() {
            if (startEditing && !this.lock) {
                this.lock = true;
                var $this = $(this);
                $this.parent()
                    .css('opacity', 0.5);
                $.ajax({
                    url: '/api/pic/?id=' + $this.data('id'),
                    type: 'DELETE',
                    success: function(data) {
                        if (data === 'OK') {
                            $this
                                .parent()
                                .remove();
                        } else {
                            alert('服务器出错，请刷新后重试');
                            this.lock = false;
                        }
                    },
                    error: function() {
                        alert('删除图片出错，请刷新后重试');
                        this.lock = false;
                    }
                });
            }
        });

        // TODO
        // --- pictrue view ---
        /*
        var overlayApi = {
                $overlay: $('#overlay'),
                hideClass: 'overlay-hide',
                show: function(html) {
                    this.$overlay
                        .html(html)
                        .removeClass(this.hideClass);
                },
                hide: function() {
                    this.$overlay.addClass(this.hideClass);
                }
            };
        $pics.delegate('li', 'click', function() {
            var html = $(this).html();
            overlayApi.show(html);
        });
        */

        return {
            startEditing: startEditing,
            prependPicture: picsApi.prependPicture
        };
    }
);
