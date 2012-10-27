/**
 * setup layout
 * @author mzhou
 *
 */

/*jshint undef:true, browser:true, noarg:true, curly:true, regexp:true, newcap:true, trailing:false, noempty:true, regexp:false, strict:true, evil:true, funcscope:true, iterator:true, loopfunc:true, multistr:true, boss:true, eqnull:true, eqeqeq:false, undef:true */
/*global G:false, $:false */

G.def('./gallery/setupLayout', function() {
    'use strict';
    var $container = $('#container'),
        $main = $('#main'),
        $showSide = $('#showSide'),
        sideShowing = false;
    $showSide.click(function() {
        if ($container.hasClass('show-side')) {
            $container.removeClass('show-side');
            sideShowing = false;
        } else {
            $container.addClass('show-side');
            sideShowing = true;
        }
    });
    $main.click(function(e) {
        if (sideShowing && e.target !== $showSide[0]) {
            $container.removeClass('show-side');
            sideShowing = false;
        }
    });

    return {
        $container: $container,
        sideShowing: sideShowing
    };
});
