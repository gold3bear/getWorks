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

    /* 穿衣助手 */
    var dresser = {
        clothElementTemp:{},
        clothElementCache:[],
        leftPosition: 400,
        topPosition:-100,
        timeLine: {},
        scene: {},
        /* {triggerElement: object, offset: int}) */
        triggerObject: {},
        createTimeLine: function () {
            this.timeLine = new TimelineMax();
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
            this.leftPosition = leftPosition ? leftPosition : 400;
            this.topPosition =  topPosition ? topPosition : -100;

            this.clothElementTemp = $(clothElement);
            this.clothElementTemp.leftStatus = {opacity: 0, left: this.leftPosition,  ease: Circ.easeOut};
            this.clothElementTemp.topStatus = {top: this.topPosition,  ease: Circ.easeIn};
            this.timeLine.add([
                TweenMax.from(this.clothElementTemp, 0.5, this.clothElementTemp.leftStatus),
                TweenMax.from(this.clothElementTemp, 0.5, this.clothElementTemp.topStatus)
            ]);
            var length = this.clothElementCache.push(this.clothElementTemp);
            console.log(length);
            return this;
        },
        takeoff: function () {
            for(var i=0;i<this.clothElementCache.length;i++){
                this.clothElementTemp = this.clothElementCache[i];
                this.clothElementTemp.leftStatus = {opacity: 0, left: this.clothElementTemp.leftStatus.left,  ease: Circ.easeIn};
                this.clothElementTemp.topStatus = {top: this.clothElementTemp.topStatus.top,  ease: Circ.easeIn};
                this.timeLine.add([
                    TweenMax.to(this.clothElementTemp, 0.5, this.clothElementTemp.leftStatus),
                    TweenMax.to(this.clothElementTemp, 0.5, this.clothElementTemp.topStatus)
                ]);
            }
            this.clothElementCache =[];
            return this;
        }
    };

    /* 穿github 的服饰*/
    dresser.createTimeLine()
        .wear('.git-shirt')
        .wear('.git-short',-400,60)
        .createScene({triggerElement: ".coder > .wear",duration: 200});
    /*脱掉*/
    dresser.createTimeLine()
        .takeoff()
        .createScene({triggerElement: ".coder > .takeoff", duration: 100});

    /* 穿dribbble 的服饰*/
    dresser.createTimeLine()
        .wear('.basket-uniform')
        .wear('.basket-short',-400,60)
        .createScene({triggerElement: ".designer > .wear"});
    /*脱掉*/
    dresser.createTimeLine()
        .takeoff()
        .createScene({triggerElement: ".designer> .takeoff", duration: 100});

    /* 穿PM的服饰*/
    dresser.createTimeLine()
        .wear('.pm-shirt')
        .wear('.pm-short',-400,60)
        .createScene({triggerElement: ".pm > .wear"});

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

});
