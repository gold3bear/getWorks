/* xiongyongxin@gmail.com
 *  2015年01月12日18:08:41
 * */
$(document).ready(function ($) {

    // init controller
    var controller = new ScrollMagic({container: "#example-wrapper"});
    var scene = new ScrollScene({triggerElement: "#trigger", offset: 300})
        .setPin("#body")
        .addTo(controller)
        .addIndicators();

   var scene2 = new ScrollScene({triggerElement: "#trigger", offset: 300});
    TweenLite.defaultOverwrite = false;

    /**
     * 给道具中的数据，放到对话框中
     * 让用户点击道具，产生对话框
     * */
     $('.prop').on('click',function(){
            //获取data-dialog数据

         var dialogContent = $(this).data('dialog');
         console.log(dialogContent);
         //把数据绑定到对话框中
         var dialogBox = $('<div>').append(dialogContent).attr('id','dialog');
         //放到指定位置；
         var position = $('section.demo');
         if(position.children('#dialog')){
             $('#dialog').remove();
         }
        position.append(dialogBox);
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
                .addTo(controller)
                .addIndicators();
            return this;
        },
        /* leftPosition,topPosition 来的位置*/
        wear: function (clothElement,leftPosition,topPosition) {
            var lPosition = leftPosition ? leftPosition : 400,
                tPosition =  topPosition ? topPosition : -100;

            this.elementTemp = document.querySelector(clothElement);
            this.elementTemp.leftStatus = {opacity: 0, left: lPosition,  ease: Circ.easeOut};
            this.elementTemp.topStatus = {top: tPosition,  ease: Circ.easeIn};
            this.timeLine.add([
                TweenMax.from(this.elementTemp, 0.5, this.elementTemp.leftStatus),
                TweenMax.from(this.elementTemp, 0.5, this.elementTemp.topStatus)
            ]);
            var length = this.clothElementCache.push(this.elementTemp);
            console.log(length);
            return this;
        },
        takeoff: function () {
            for(var i=0;i<this.clothElementCache.length;i++){
                this.elementTemp = this.clothElementCache[i];
                this.elementTemp.leftStatus = {opacity: 0, left: this.elementTemp.leftStatus.left,  ease: Circ.easeIn};
                this.elementTemp.topStatus = {top: this.elementTemp.topStatus.top,  ease: Circ.easeIn};
                this.timeLine.add([
                    TweenMax.to(this.elementTemp, 0.5, this.elementTemp.leftStatus),
                    TweenMax.to(this.elementTemp, 0.5, this.elementTemp.topStatus)
                ]);
            }

            this.clothElementCache =[];
            return this;
        },
        wearAll: function(clothElement){
            this.timeLine.add([
                TweenMax.to(clothElement, 0.5, {opacity:1,left:0, ease: Circ.easeOut}),
                TweenMax.to(clothElement, 0.5, {top:0, ease: Circ.easeIn})
            ]);
            return this;
        },
        showAside: function(textElement,leftPosition,topPosition){
            TweenLite.set(textElement, {perspective:400});
            var aside = textElement+" li";
            this.timeLine.add(
                    TweenMax.from(textElement,1,{ opacity:0, y:-50,height:'2em'}))
                .add(
                    TweenMax.staggerFrom(aside,0.6,{opacity:0, scale:0, y:80, rotationX:180, transformOrigin:"0% 50% -50",  ease:Back.easeOut}, 0.5, "+=0")
            );
            return this;
        },
        bringProp:function(propElement){
            var props = this.propElementCache = document.querySelectorAll(propElement);
            this.timeLine.add(
                    TweenMax.staggerFromTo(props,2,{opacity:0, scale:0, y:-300, rotationX:180, transformOrigin:"0% 50% -50"}, {opacity:1, scale:1, y:250,rotationX:0, rotation:0, ease:Back.easeOut},0.5, "+=30") )
                .add(
                    TweenMax.to(props, 2, {y:370, ease: Linear.easeNone})
                );
            return this;
        },
        takeProps: function(){
            this.timeLine.add(
                TweenMax.to(this.propElementCache, 1, {opacity:0,y:-300,ease:Expo.easeIn})
            );
            this.propElementCache = [];
            return this;
        }
    };

    /* 穿dribbble 的服饰*/
    director.createTimeLine()
        .wear('.basket-uniform')
        .wear('.basket-short',-400,60)
        .showAside('#designer .title-chart')
        .createScene({triggerElement: "#designer > .wear",duration: 400});
    /*脱掉*/
    director.createTimeLine()
        .takeoff()
        .createScene({triggerElement: "#designer> .takeoff", duration: 100});
    /*道具*/
    director.createTimeLine()
           .bringProp('#designer .prop')
           .createScene({triggerElement: "#designer > .bring-props",duration: 200});
    /*收走道具*/
    director.createTimeLine()
        .takeProps()
        .createScene({triggerElement: "#designer > .take-props",duration: 100,offset:-150});



    /* 穿github 的服饰*/
    director.createTimeLine()
        .wear('.git-shirt')
        .wear('.git-short',-400,60)
        .createScene({triggerElement: "#coder > .wear",duration: 200});
    /*脱掉*/
    director.createTimeLine()
        .takeoff()
        .createScene({triggerElement: "#coder > .takeoff", duration: 100});

    /* 穿PM的服饰*/
    director.createTimeLine()
        .wear('.pm-shirt')
        .wear('.pm-short',-400,60)
        .createScene({triggerElement: "#pm > .wear",duration: 200});

    /*脱掉*/
    director.createTimeLine()
        .takeoff()
        .createScene({triggerElement: "#pm> .takeoff", duration: 100});


    /* 穿上所有衣服 */
    director.createTimeLine()
        .wearAll('.basket-uniform')
        .wearAll('.basket-short')
        .wearAll('.git-shirt')
        .wearAll('.git-short')
        .wearAll('.pm-shirt')
        .wearAll('.pm-short')
        .wearAll('.pm-shirt')
        .createScene({triggerElement: "#value > .wear",duration: 200});

    // make sure we only do this on mobile:
    if (Modernizr.touch) {
        // configure iScroll
        var myScroll = new IScroll('#example-wrapper',
            {
                // don't scroll horizontal
                scrollX: false,
                // but do scroll vertical
                scrollY: true,
                // show scrollbars
                scrollbars: true,
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
        scene.addIndicators({parent: ".scrollContent"});
    } else {
        // show indicators (requires debug extension)
        scene.addIndicators();
    }

    //显示有多少对象
});