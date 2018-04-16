  console.log("content. workings");

  var var3='',content, summary;  

  var title = $(document).find("title").text();
  
  $.LoadingOverlay("show");
 
  $("p").each(function(index){
    content = $(this).text();
    summary=test('',content);
    $(this).text(summary);
	});

  $('.post-body').each(function(index) {
  	content = $(this).text();
  	console.log(content);
    summary=test('',content);
    $(this).text(summary);
});
 setTimeout(function(){$.LoadingOverlay("hide");}, 1000);


