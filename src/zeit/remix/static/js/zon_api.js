/*!
 * ZON_API Client for jQuery JavaScript Library v1.8.3
 * http://developer.zeit.de/
 *
 * Copyright 2012 ZEIT ONLINE GmbH (technical department)
 * Released under the MIT license
 * http://jquery.org/license
 *
 * author: Ron Drongowski <ron.drongowski@zeit.de>
 */

(function( $ ){
   $.fn.zon_api = function(_options) {
       var options = {
           api_key: "",
           query: "*:*",
           endpoint: "content",
           _base_url: "http://api.zeit.de",
           _parent: null,
           limit: 10,
           offset: 0,
           _actual_result: {},
           _found: null,
           proxy_mode: false,
           params:{}
       }
       
       if (!_options.proxy_mode && _options.api_key == undefined){
            $.error("You need to provide an api_key or run in proxy_mode");
            return this;
       }

       $.extend(options,_options)
       
       function _inspect_request( index ){
           if ( index == undefined ){
               index = 0
           }
           if ( options.offset+index < 0 ){
               $.error("Cannot start at index <0.");
               return false;
           }
           if ( options.offset+index > _max_results() ){
               $.error("Cannot exceed max_results.");
               return false;     
           }
           if ( options.query == "" ){
               $.error("A query must be defined.");
               return false;
           }
           if ( options.endpoint == undefined ){
               $.error("An endpoint must be given.");
               return false;
           }

           return true;
       }

       function _max_results(){
           if (options._found == null){
               return 1000;
           }
           return options._found;
       }

       function _reorganize(data){
           for( var item in data ) {
               if( typeof data[item] === 'object' ) {
                   _reorganize(data[item]);       
               }else{
                   if (item === "uri"){
                       var my_options = jQuery.extend(true, {}, options);
                       my_options.endpoint="";
                       my_options._base_url = data[item];
                       var api = $().zon_api(my_options);
                       data[item] = api;
                   }
               }
           }
       }
       
       return {
           get_options : function(){
               return options;
           },

           retrieve : function(index, callbackFnk){
               if (!_inspect_request( index )){
                   return this;
               }
               
               options.offset = options.offset + index;

               var my_data = $.extend({
                       q:options.query,
                       limit:options.limit,
                       offset:options.offset,
               },options.params);
               
               if (!options.proxy_mode){
                    my_data = $.extend({
                        api_key:options.api_key
                    },my_data);
               }

               var url = options._base_url;

               if (options.endpoint != ""){ 
                   url = url + "/" + options.endpoint 
               } 

               var request = {
                   url: url,
                   data: my_data,
               }
               
               if (!options.proxy_mode){
                    request = $.extend({
                        crossDomain: true,
                        dataType:"jsonp"},request);
               }

               var me = this
               $.ajax(request).done(function(data){          
                   _reorganize(data);
                   options._actual_result = data;
                   options._found = data.found;
                   
                   $().trigger("retrieve",data);

                   if(typeof callbackFnk == 'function'){
                       callbackFnk.call(this, me);
                   } 
               });
               return this;
           },
           parent : function(){
               return this.options._parent;
           },
           get_result : function(){ 
               return options._actual_result; 
           }   
       } 
   };
})( jQuery );
