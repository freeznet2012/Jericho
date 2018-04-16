
  $(document).ready(function(){
  $("#click").click(function(){
    var str2 = "";
    var str1 = $("#textarea1").val();
    var size = parseInt($("#size").val());
    str2 = test(str1,size);
    
    $("#textarea2").val(str2);





    event.preventDefault();
    });
});