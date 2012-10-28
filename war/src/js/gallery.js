/**
 * setup layout
 * @author mzhou
 *
 */

/*jshint undef:true, browser:true, noarg:true, curly:true, regexp:true, newcap:true, trailing:false, noempty:true, regexp:false, strict:true, evil:true, funcscope:true, iterator:true, loopfunc:true, multistr:true, boss:true, eqnull:true, eqeqeq:false, undef:true */
/*global G:false, $:false, GLOBAL:false, alert:false */

//@import "G.js";
//@import "lib/jQuery.js";
//@import "lib/GUtils.js";
//@import "lib/MultipleUploader.js";
//@import "./gallery/setupLayout.js";
//@import "./gallery/setupPicture.js";

G.req(
    ['MultipleUploader','./gallery/setupLayout', './gallery/setupPicture'],
    function(MultipleUploader, setupLayout, setupPicture) {
        'use strict';
        // --- setup html class ---
        var $html = $('html');
        $html
            .removeClass('no-js')
            .addClass('js');

        // --- setup uploader ---
        if (MultipleUploader.isSupported()) {
            var uploader = new MultipleUploader('#uploaderForm', GLOBAL.uploadUrl, {
                maxCount: 100,
                uploadOnChange: true,
                timeout: 100000,
                fileViewTmpl: '<li data-id="{id}" class="ellipsis" title="{filename}">{filename}</li>'
            });
            uploader
                .on('success', function(id, data) {
                    uploader.uploadUrl = data.newUploadUrl;
                    setupPicture.prependPicture(data);
                })
                .on('error', function(id, data) {
                    alert(data.msg);
                })
                .on('addTooManyFiles', function() {
                   alert('你已经上传了近100张图片了，请刷新下页面');
                });
        } else {
            $html.addClass('no-inputfile');
        }

        if (MultipleUploader.supportDrag()) {
            $html.addClass('jsdraggable');
        }
    }
);
