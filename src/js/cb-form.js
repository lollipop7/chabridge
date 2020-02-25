$(document).ready(function() {
  try{
    /**
     * https://codeseven.github.io/toastr/demo.html
     */
    toastr.options = { // toastr配置
      "closeButton": true, //是否显示关闭按钮
      "debug": false, //是否使用debug模式
      "progressBar": true, //是否显示进度条，当为false时候不显示；当为true时候，显示进度条，当进度条缩短到0时候，消息通知弹窗消失
      "positionClass": "toast-top-right",//显示的动画位置
      "showDuration": "300", //显示的动画时间
      "hideDuration": "1000", //消失的动画时间
      "timeOut": "5000", //展现时间
      "extendedTimeOut": "1000", //加长展示时间
      "showEasing": "swing", //显示时的动画缓冲方式
      "hideEasing": "linear", //消失时的动画缓冲方式
      "showMethod": "fadeIn", //显示时的动画方式
      "hideMethod": "fadeOut" //消失时的动画方式
    }

    let regs = {
      userNameReg: /^\w+$/,
      nickNameReg: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
      pwdReg: /^.{6,20}$/,
      numReg: /\d/,
      strReg: /[a-zA-Z]/,
      mobileReg: /^[1][1,2,3,4,5,6,7,8,9,0][0-9]{9}$/,
      captchaReg: /^\d{6}$/,
      tsReg: /[^\u4e00-\u9fa5a-zA-Z0-9]/,
      spaceReg: /(^\s+)|(\s+$)/g, //匹配任何空白字符，包括空格、制表符、换页符，不管前后还是中间，都能匹配到
    }
    
    $("form").submit(function(e){e.preventDefault();});
    $("form :input").blur(function() {
      let $parent = $(this).parent();
      if($(this).is("#username")) {
        $parent.removeClass('has-error');
        $parent.find('.help-block').text('')
        if(this.value.length < 6 || this.value.length > 20) {
          $parent.addClass('has-error');
          $parent.find('.help-block').text('用户名必须由6-20位英文字母、数字、下划线组成')
        }
      }
    })

  }catch(err) {

  }
})