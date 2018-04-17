  console.log("content. workings");
  var var3 = '',
    content, summary;

  var title = $(document).find("title").text();
  $.LoadingOverlay("show");


  //$("p").each(function(index) {
   // content = $(this).text();
   // summary = test(content, 0);
   // $(this).text(summary);
  //});

  $('p').each(function(index) {
    var reg = /\w+/g;
    var temp1 = $(this).text();
    if (temp1.match(reg)) {
      content = $(this).text();
      content = content.split(/\n+/g);
      console.log(content[0]);
      for (var i = 0; i < content.length; i++) {
        content[i] = test(content[i], 0);
      }
      console.log(content[0]);
      summary = content.join('\n\n');
      summary = summary.replace(/\n+/g, '<br><br>')

      $(this).html(summary);
    }
  });


  $('.post-body').children().each(function(index) {
    var reg = /\w+/g;
    var temp1 = $(this).text();
    if (temp1.match(reg)) {
      content = $(this).text();
      content = content.split(/\n+/g);
      console.log(content[0]);
      for (var i = 0; i < content.length; i++) {
        content[i] = test(content[i], 0);
      }
      console.log(content[0]);
      summary = content.join('\n\n');
      summary = summary.replace(/\n+/g, '<br><br>')

      $(this).html(summary);
    }
    
  });
  
  

  
  setTimeout(function() {
    $.LoadingOverlay("hide");
  }, 1000);
