
/*jshint undef:true, browser:true, noarg:true, curly:true, regexp:true, newcap:true, trailing:false, noempty:true, regexp:false, strict:true, evil:true, funcscope:true, iterator:true, loopfunc:true, multistr:true, boss:true, eqnull:true, eqeqeq:false, undef:true */
/*global G:false, $:false, alert:false */

//@import "./setupLayout.js";

G.def(
    './gallery/setupPicture',
    ['./setupLayout'],
    function(setupLayout) {
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
                getPicsApi: function(c, cb) {
                    $.ajax({
                        url: '/api/pic/',
                        data: {pageSize: pageSize, cursor: c || ''},
                        success: function(data) {
                            var html = [],
                                sameCursor = cursor === data.cursor,
                                noMoreData = (data.pics.length < pageSize) || sameCursor;

                            if (!sameCursor) {
                                G.each(data.pics, function(v) {
                                    html.push(G.format(picTmpl, v));
                                });
                            }

                            cb.call(this, html.join(''), noMoreData);
                            cursor = data.cursor;
                        },
                        cache: false,
                        dataType: 'json'
                    });
                },
                loadMorePics: function () {
                    picsApi.getPicsApi(cursor, function(html, noMoreData) {
                        $pics.append(html);
                        if (noMoreData) {
                            $pullUp.hide();
                        }
                    });
                },
                updatePics: function() {
                    picsApi.getPicsApi(null, function(html, noMoreData) {
                        $pics.html(html);
                        if (noMoreData) {
                            $pullUp.hide();
                        } else {
                            $pullUp.show();
                        }
                    });
                },
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
        $container.delegate('a[data-do=deletePics]', 'click', function() {
            if (startEditing) {
                var $this = $(this);
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
                        }
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
