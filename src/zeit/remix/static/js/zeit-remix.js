    var sizes = {
      12 : {'font-size':'1.3em'},
      18 : {"font-size":"1.3em","font-weight":"bold"},
      50 : {"font-size":"1.8em"},
      100 : {"font-size":"1.8em","font-weight":"bold"},
    }
    var api = "";
    
    function set_size(tag,percent){
       $.each(sizes,function(i,val){
         if ( percent <= i ){
           tag.css(val);
           return false
         }
       });
     }
    
    function create_cloud ( from, to ){
    
      $("#tags").remove();
      $("#cloud_throbber").fadeIn('slow');
      $('#matches').remove();
      $("#result_throbber").fadeIn('slow');
    
      var q = ""
      var mark_kw = new Array();
      if (arguments.length > 2){
        mark_kw = arguments[2];
        for (i=0;i < mark_kw.length;i++){
          q =q + 'keyword:"'+mark_kw[i]+'" '; 
        }
      }
    
      var conf = {
        _base_url: proxy_url,
        query:"release_date:["+from.toISOString()+" TO "+to.toISOString()+"] "+q,
      };
    
      api = $("body").zon_api($.extend(true,conf,{
            endpoint:"content",
            params:{facet_field:"keyword"},
            proxy_mode: true,
            limit: 10}));
    
      var ul = $("<ul>").attr({id:"tags"});
      ul.css("display","none");
    
      $("#cloud").append(ul);
    
      api.retrieve(0, function (data){
        var max = 0;
        tags = []
        $.each(data.get_result().facets.keyword,function (i,val){
          var li = $("<li>");
          var value = val.label;
          if (value == undefined){
            value = val.id;
          }
          var div = $("<div>").text(value.replace(/ /g,"\xA0")+"\xA0("+val.count+")");
          li.append(div);
          li.attr({score:val.count});
          $(li).data("k_id",val.id);
          $(li).data("orig_data",val);
          tags.push(li);
          if ($.inArray(val.id, mark_kw)>=0){
              $(li).addClass('tag_active');
          }
          max = Math.max(max,val.count);
        });
    
        del_list = [];
        $.each(data.get_result().facets.keyword,function (i,val){
            var entry = (val.count*100)/max;
            if ( entry > 8 ){  
              set_size($(tags[i]),entry); 
              if ($(tags[i]).attr("style")!=undefined){
                   $(tags[i]).click(function(){
                    $(this).toggleClass("tag_active");
                    if ($(this).hasClass("tag_active")){
                      append_to_query($(this).data("orig_data"));
                    }else{
                      remove_from_query($(this).data("orig_data"));
                    }
                    var kw = new Array();
                     $.each($("li.tag_active"), function(i,val){
                        kw.push($(val).data("k_id").trim());
                    });
                    var from = $("#datepicker-from").datepicker("getDate");
                    var to = $("#datepicker-to").datepicker("getDate");
                    create_cloud(from,to,kw);
                  });
                  $(tags[i]).css("cursor","pointer");
                  $(tags[i]).attr("id","cloud_"+val.id);
                  $("#tags").append($(tags[i]));
              }
          }
        });
    
        var matches = $('<ul id="matches">');
        matches.css("display","none");
        append_matches(data.get_result(), matches);
        $('.result_space').append(matches);

        $("#cloud_throbber").fadeOut('slow',function(){
          $("#tags").fadeIn('slow');
        });
    
        $("#result_throbber").fadeOut('slow',function(){
          $("#matches").fadeIn('slow');
        });
      });
    }

    function append_matches(result, matches){
        $.each(result.matches,function (i,val){
          var li = $('<li>');
          var a = $('<a href='+val.href+'>');
          var h4 = $('<h4>').text(val.supertitle);
          var h3 = $('<h3>').text(val.title);
          var teaser = $('<div class="teaser_text">').text(val.subtitle);
          
          var snippet = $('<div class="snippet">').html('... '+val.snippet+' ...');
          
          
          var date = new Date(val.release_date);
          var release_date = $('<div class="release_date">').text(date.getDate()+'.'+(date.getMonth()+1)+'.'+date.getFullYear());
          a.append(h4).append(h3).append(teaser);
          if (val.snippet != undefined){
              a.append(snippet);
          }
          a.append(release_date);


          li.append(a);
          matches.append(li);
        });

        var max_r = (result.limit+result.offset);
        
        if (max_r >= result.found){
            max_r = result.found
        }

        $('.result_msg').text("1 -"+max_r+" "+"von "+result.found);
    }
    
    function append_to_query( data ){
      li = $("<li>").attr("id",data.id);
      li.data("orig_data",data);
      li.text(data.label);
      li.css("display","none");
      $('#keywords').append(li);
      li.fadeIn('slow');
      li.click(function(){
          remove_from_query(data);
          $('#cloud_'+data.id).toggleClass('tag_active');
          var kw = new Array();
          $.each($("li.tag_active"), function(i,val){
              kw.push($(val).data("k_id").trim());
          });
          var from = $("#datepicker-from").datepicker("getDate");
          var to = $("#datepicker-to").datepicker("getDate");
          create_cloud(from,to,kw);
      });
    }

    function append_next_page(){
        api.retrieve(api.get_options().limit, function(data){
            append_matches (data.get_result(), $("#matches"));
        });
    }
    
    function remove_from_query( data ){
      $('#'+data.id).fadeOut('slow');
      $('#'+data.id).remove();
    }

    function clear_keywords(){
      $('#keywords li').remove();  
    }
    
    
    function open_close(){
      if ($('#info_text').is(':hidden')){
        $('#info_text').slideDown('slow');
        } else {
        $('#info_text').slideUp('slow');
      }
    }
    
    function show_hide_facets (){
      $("#cloud").toggle('slow',function(){
          var f = $("#show_facets")
          if (f.text()=='Facetten ausblenden'){
            f.text('Facetten einblenden');
          }else{
            f.text('Facetten ausblenden'); 
          }
      });
    }
    
    function show_hide_article (){
      $("#result").toggle('slow',function(){
        var f = $("#exec_query")
          if (f.text()=='Artikel ausblenden'){
            f.text('Artikel einblenden');
          }else{
          f.text('Artikel ausblenden'); 
          }
      });
    }
    
    
