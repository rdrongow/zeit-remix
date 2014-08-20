<!DOCTYPE html SYSTEM "about:legacy-compat">
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link href="css/smoothness/jquery-ui-1.9.2.custom.css" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <script type="text/javascript" src="js/jquery-1.8.3.min.js"></script>
    <script type="text/javascript" src="js/jquery-ui-1.9.2.custom.min.js"></script>
    <script type="text/javascript" src="js/zon_api.js"></script>
    <script type="text/javascript" src="js/zeit-remix.js"></script>
    <script type="text/javascript">
      var proxy_url = '{{ proxy_url }}';
      $(document).ready(function(){
        var dp = { 
          dateFormat: "dd.mm.yy",
          monthNames: [ "Januar", "Februar", "März", "April", "Mai",
          "Juni", "Juli", "August", "September", "Oktober", "November",
          "Dezember" ],
          monthNamesShort: [ "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
          "Jul", "Aug", "Sep", "Okt", "Nov", "Dez" ],
          firstDay: 1,
          dayNames: [ "Sonntag", "Montag", "Dienstag", "Mittwoch",
          "Donnerstag", "Freitag", "Samstag" ],
          dayNamesMin: [ "So", "Mo", "Di", "Mi", "Do", "Fr", "Sa" ],
          dayNamesShort: [ "So", "Mo", "Di", "Mi", "Do", "Fr", "Sa" ],
          onClose: function(date){
            clear_keywords();
            create_cloud ($("#datepicker-from").datepicker("getDate"), 
                          $("#datepicker-to").datepicker("getDate")
                          );
            }  
        }
    
        var d = new Date();
        d.setDate(d.getDate()-30)
    
        $( "#datepicker-from" ).datepicker( dp).datepicker('setDate', d);
        $( "#datepicker-to" ).datepicker( dp ).datepicker('setDate', new Date());
        $('#info').click(function(){
          open_close()
        });
    
        $('#close').click(function(){
          open_close()
        });
    
        $("#show_facets").click(function(){
          show_hide_facets();
        });
    
        $("#exec_query").click(function(){
          show_hide_article();
        });

        $("#more_results").click(function(){
          append_next_page();
        });
    
    
        create_cloud ($("#datepicker-from").datepicker("getDate"),
        $("#datepicker-to").datepicker("getDate"));
      });
    </script>
  </head>   
  <body>
    <div id="head">
    </div>  
    <div id="content">
      <h1>zeitRemix</h1>
      <h2>Facetten-Explorer von ZEIT ONLINE und DIE ZEIT</h2>
      <div id="info">i</div>
      <div id="info_text">
        <div id='close'>schließen</div>
        <p>Suchanfragen (z.B. via Google) haben in der Regel sehr große
        und unüberschaubare Ergebnislisten.
        Diese Ergebnisse lassen sich auf Grund ihrer Metadaten oft
        sinnvoll weiter einschränken.

        </p><p> 
        Links, die zu einer solchen eingeschränkten Ergebnisliste führen, 
        werden oft Facetten genannt, weil sie einen anderen Blick auf das ursprüngliche
        Suchergebnis bieten. Diese Facetten sind ein
        komfortables Werkzeug, mit dem man eine große Menge von Texten gemäß
        den eigenen Interessen und mit wenigen Klicks ordnen kann.
        </p><p>
        Mit diesem Tool können Sie dies für die Texte von ZEIT ONLINE
        und DIE ZEIT tun. Wählen Sie hierzu zunächst einen Zeitraum. Der
        Zeitraum für die letzten 30 Tage ist bereits vorausgewählt.
        Ihnen werden nun Schlagwörter angezeigt, mit denen die Texte aus
        diesem Zeitraum versehen wurden. Die Zahl zeigt die Häufigkeit
        an. Für den gewählten Zeitraum relevante Schlagwörter werden
        typografisch hervorgehoben. Diese Darstellungsform wird auch
        Tag-Cloud genannt. Zu jeder Tag-Cloud gehört immer eine
        Artikelliste. Tag-Cloud und Ergebnisse können Sie mit den jeweiligen
        Button ein- und ausblenden.
        </p><p>
        Wenn Sie nun ein Schlagwort anklicken, schränken Sie damit die 
        Ergebnisliste ein und eine neue Tag-Cloud wird erzeugt. Und auch
        diese können Sie durch einen Klick auf ein neues Schlagwort erneut einschränken.
        Ein Klick auf ein bereits gewähltes Schlagwort, wählt dieses
        wieder ab und die vorherige Tag-Cloud wird erneut erzeugt.
        </p><p>
        Dieses Anwendung basiert auf den Daten der <a
          href="http://developer.zeit.de">ZEIT ONLINE API</a>, <a
          href="https://developers.google.com/appengine/">Googles
          App-Engine</a> und dem <a
          href="http://jquery.org">jQuery Projekt</a>.
        </p>
      </div>
      <div id="tool">
        <label>Beginn:</label>
        <input style="margin-left:3em" type="text"
        id="datepicker-from"></input>
        <label class='spacer'>Ende:</label>
        <input type="text" id="datepicker-to"></input>
        <div id="query">
          <div id="kw_label">Schlagwörter: </div>
          <ul id="keywords"></ul>
        </div>
        <a href="#" class="button" id="show_facets">Facetten ausblenden</a>
        <a href="#" class="button" id="exec_query">Artikel anzeigen</a>
      </div>
      <div id="result">
        <div class="result_msg"></div>
        <div id="result_throbber"  class="throbber"></div>
        <div class="result_space"></div>
        <button class="button" id="more_results">mehr laden</button>
        <div class="result_msg bottom"></div>
      </div>
      <div id="cloud">
        <div id="cloud_throbber" class="throbber"></div>
      </div>
      
    <div class="space"></div>
    </div>
    <div id="foot">&copy; <a href='https://twitter.com/rondrongowski/'>Ron Drongowski</a></div>
  </body>
</html>
