/* xiongyongxin@gmail.com
 *  2015年01月12日18:08:41
 * */
//
$(window).load(function() {

    $.when( $('#page-loader').addClass('out')).done(function () {
        $('#content-wrapper').addClass('in');
    });
});

$(document).ready(function ($) {

    /*
    *  loading 成功后显示页面
    * */

    // init controller
    var controller = new ScrollMagic({container: "#example-wrapper"});
    /* 出场,撤离提示文字迅速 */
    var tween0 = TweenMax.to("#description", 1, {top: -400,ease: Circ.easeInOut});
    var scene0 = new ScrollScene({triggerElement: "#titlechart", duration:200,offset:300})
        .setTween(tween0)
        .addTo(controller);
//        .addIndicators();

    var tween1 = TweenMax.from('#start .chart',1,{opacity:0,ease: Circ.easeInOut});
    var scene = new ScrollScene({triggerElement: "#trigger",offset:200})
        .setTween(tween1)
        .setPin("#body")
        .addTo(controller);
//        .addIndicators();

   var scene2 = new ScrollScene({triggerElement: "#trigger", offset: 300});
    TweenLite.defaultOverwrite = false;

    /**
     * 给道具中的数据，放到对话框中
     * 让用户点击道具，产生对话框
     * */
     $('.prop').on('click',function(){
          //获取data-dialog数据
         var dialogContent = $(this).data('dialog');
         //把数据绑定到对话框中
         var dialogBox = $('<div>').append(dialogContent).attr('id','dialog');
         //放到指定位置；
         var position = $('section#start');
         if(position.children('#dialog')){
             $('#dialog').remove();
         }
        position.append(dialogBox);
        window.setTimeout(function(){
            $('#dialog').remove();
         },3500);
     });
    /* 导演 */
    var director = {
        elementTemp:{},
        clothElementCache:[],
        propElementCache:[],
        timeLine: {},
        scene: {},
        /* {triggerElement: object, offset: int}) */
        triggerObject: {},
        createTimeLine: function () {
            this.timeLine = new TimelineLite();
            return this;
        },
        createScene: function (triggerObject) {
            this.scene = new ScrollScene(triggerObject)
                .setTween(this.timeLine)
                .addTo(controller);
            return this;
        },
        /* leftPosition,topPosition 来的位置*/
        wear: function (clothElement,leftPosition,topPosition) {
            var lPosition = leftPosition ? leftPosition : 400,
                tPosition =  topPosition ? topPosition : -100;

            this.elementTemp = document.querySelector(clothElement);
            this.elementTemp.leftStatus = {opacity: 0, left: lPosition,  ease: Circ.easeOut};
            this.timeLine.add( TweenMax.from(this.elementTemp, 1, this.elementTemp.leftStatus));
            var length = this.clothElementCache.push(this.elementTemp);
//            console.log(length);
            return this;
        },
        takeoff: function () {
            for(var i=0;i<this.clothElementCache.length;i++){
                this.elementTemp = this.clothElementCache[i];
                this.elementTemp.leftStatus = {opacity: 0, left: this.elementTemp.leftStatus.left,  ease: Circ.easeIn};
                this.timeLine.add( TweenMax.to(this.elementTemp, 0.5, this.elementTemp.leftStatus));
            }

            this.clothElementCache =[];
            return this;
        },
        wearAll: function(clothElement){
            this.timeLine.add(
                TweenMax.to(clothElement, 0.5, {opacity:1,left:0, ease: Circ.easeOut}) ); return this;
        },
        showAside: function(textElement,leftPosition,topPosition){
            TweenLite.set(textElement, {perspective:400});
            var aside = textElement+" li";
            this.timeLine.add(
                    TweenMax.from(textElement,1,{ opacity:0, y:-50,height:'2em'}))
                .add(
                    TweenMax.staggerFrom(aside,1,{opacity:0, scale:0, y:30,  ease:Back.easeOut}, 0.5, "+=0")
            );
            return this;
        },
        bringProp:function(propElement){
            var props = this.propElementCache = document.querySelectorAll(propElement);
//            console.log(props);
            this.timeLine.add(
                    TweenMax.staggerFromTo(props,4,{opacity:0, y:100, scale:0,rotation:180}, {opacity:1, scale:1,y:220, rotation:0, ease:Back.easeOut},0.5, "+=30") )
                .add(
                    TweenMax.to(props, 4, {opacity:0,y:-100, ease:Linear.easeIn,delay:10})

            );
            return this;
        },
        takeProps: function(){
            this.timeLine.add(
                TweenMax.to(this.propElementCache, 1, {opacity:0,y:-300,ease:Expo.easeIn})
            );
            this.propElementCache = [];
            return this;
        },
        bringContact:function(titleElement){
            var title = document.querySelectorAll(titleElement);
            var lis = document.querySelectorAll(titleElement+' li');
            this.timeLine.add(
                TweenMax.from(title,1,{ opacity:0, x:300})
                ).add(
                TweenMax.staggerFrom(lis,1,{opacity:0, scale:0, y:30,delay:1,  ease:Back.easeOut}, 0.5, "+=0")
            );
            return this;
        }
    };

    /* 穿dribbble 的服饰*/
    director.createTimeLine()
        .wear('.basket-uniform')
        .wear('.basket-short',-400,60)
        .showAside('#designer .title-chart')
        .createScene({triggerElement: "#designer > .wear",duration: 400});
    /*道具*/
    director.createTimeLine()
           .bringProp('#designer .prop')
           .createScene({triggerElement: "#designer > .bring-props",duration: 300});

    /* 穿github 的服饰*/
    director.createTimeLine()
        .wear('.git-shirt')
        .wear('.git-short',-400,60)
        .showAside('#coder .title-chart')
        .createScene({triggerElement: "#coder > .wear",duration: 400});
    /*道具*/
    director.createTimeLine()
        .bringProp('#coder .prop')
        .createScene({triggerElement: "#coder > .bring-props",duration: 300});

    /* 穿PM的服饰*/
    director.createTimeLine()
        .wear('.pm-shirt')
        .wear('.pm-short',-400,60)
        .showAside('#pm .title-chart')
        .createScene({triggerElement: "#pm > .wear",duration: 200});
    director.createTimeLine()
        .bringProp('#pm .prop')
        .createScene({triggerElement: "#pm > .bring-props",duration: 300});
    // make sure we only do this on mobile:
    director.createTimeLine()
           .bringContact('#contact .title')
           .createScene({triggerElement: "#contact",duration: 300,offset:100});
    if (Modernizr.touch) {
        // configure iScroll
        var myScroll = new IScroll('#example-wrapper',
            {
                // don't scroll horizontal
                scrollX: false,
                // but do scroll vertical
                scrollY: true,
                // show scrollbars
                scrollbars: false,
                // deactivating -webkit-transform because pin wouldn't work because of a webkit bug: https://code.google.com/p/chromium/issues/detail?id=20574
                // if you dont use pinning, keep "useTransform" set to true, as it is far better in terms of performance.
                useTransform: false,
                // deativate css-transition to force requestAnimationFrame (implicit with probeType 3)
                useTransition: false,
                // set to highest probing level to get scroll events even during momentum and bounce
                // requires inclusion of iscroll-probe.js
                probeType: 3,
                // pass through clicks inside scroll container
                click: true
            }
        );

        // overwrite scroll position calculation to use child's offset instead of container's scrollTop();
        controller.scrollPos(function () {
            return -myScroll.y;
        });

        // thanks to iScroll 5 we now have a real onScroll event (with some performance drawbacks)
        myScroll.on("scroll", function () {
            controller.update();
        });

        // add indicators to scrollcontent so they will be moved with it.
    } else {
        // show indicators (requires debug extension)
//        scene.addIndicators();
    }

});
var handlePageContentView = function() {
    "use strict";
    $(window).load(function() {
        $.when($('#page-loader').addClass('hide')).done(function() {
            $('#page-container').addClass('in');
        });
    });
};