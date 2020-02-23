$(document).ready(function() {
  try{
    $('#btn-toggle').click(function(e){
      e.preventDefault()
      $('#chabridge-menu').addClass("drawer");
      $('.drawer-bg').fadeIn()
    })
    $('.drawer-bg').click(function() {
      $('#chabridge-menu').removeClass("drawer");
      $(this).fadeOut();
    })


  }catch(err) {}
})
  