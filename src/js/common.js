/**
 * @Author: lollipop
 * @Date: 2020/02/2020/2/21
 **/
$(document).ready(function() {
    try{
        //导航menu
        $('#btn-toggle').click(function(e){
            e.preventDefault()
            $('#chabridge-menu').addClass("drawer");
            $('.drawer-bg').fadeIn()
        })
        $('.drawer-bg').click(function() {
            $('#chabridge-menu').removeClass("drawer");
            $(this).fadeOut();
        })

        //视频
        $(".section-video .slogan-cont h3").click(function(){
            console.log('.section-video ...')
            $(this).addClass("active").siblings("h3").removeClass("active");
            $(this).next(".accordion").slideDown().siblings(".accordion").slideUp();
        })

        // 动画
        const homeFirstWaypoint = function homeFirstWaypoint() {
            $(".animate-box").waypoint(function( direction ) {
                const _this = this;
                console.log(_this.element, direction)
                if(direction === 'down' || direction === 'up' ) {
                    $(_this.element).addClass('animated fadeInUp')
                }
            } , { offset: '75%' } );
        }
        homeFirstWaypoint()

    }catch(err) {}
})
