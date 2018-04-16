  console.log("content. workings");

  var var3='',content, summary;  

  var title = $(document).find("title").text();
  
  $.LoadingOverlay("show");
 
  $("p").each(function(index){
    content = $(this).text();
    summary=test(content,1);
    $(this).text(summary);
	});

  $('.post-body').children().each(function(index) {
  	var reg=/\w+/g;
  	var temp1 = $(this).text();
  	if(temp1.match(reg)){
  	content = $(this).text();
  	content = content.split(/\n+/g);
  	console.log(content[0]);
  	for (var i = 0; i < content.length; i++) {
  		content[i]=test(content[i],1);
  	}

  	console.log(content[0]);
    summary=content.join('\n\n');
    $(this).text(summary);
}
});

 
 setTimeout(function(){$.LoadingOverlay("hide");}, 1000);


