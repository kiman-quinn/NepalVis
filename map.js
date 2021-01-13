am4core.ready(function() {
    
    // Themes begin
    am4core.useTheme(am4themes_dataviz);
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    /* Create map instance */
    var chart = am4core.create("chartdiv", am4maps.MapChart);
    
    /* Set map definition */
    chart.geodata = am4geodata_worldLow;
    
    /* Set projection */
    chart.projection = new am4maps.projections.Miller();
    
    /* Create map polygon series */
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    
    /* Make map load polygon (like country names) data from GeoJSON */
    polygonSeries.useGeodata = true;
    
    /* Configure series */
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.applyOnClones = true;
    polygonTemplate.togglable = true;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeOpacity = 0.5;
    polygonTemplate.fill = chart.colors.getIndex(0);
    var lastSelected;

    polygonTemplate.events.on("hit", function(ev) {
      if (lastSelected) {
        // This line serves multiple purposes:
        // 1. Clicking a country twice actually de-activates, the line below
        //    de-activates it in advance, so the toggle then re-activates, making it
        //    appear as if it was never de-activated to begin with.
        // 2. Previously activated countries should be de-activated.
        lastSelected.isActive = false;
      }
      ev.target.series.chart.zoomToMapObject(ev.target);
      if (lastSelected !== ev.target) {
        lastSelected = ev.target;
      }
    })

    
    /* Create selected and hover states and set alternative fill color */
    var ss = polygonTemplate.states.create("active");
    ss.properties.fill = chart.colors.getIndex(2);
    
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(4);
    
    // Hide Antarctica
    polygonSeries.exclude = ["AQ"];
    
    // Small map
    chart.smallMap = new am4maps.SmallMap();
    // Re-position to top right (it defaults to bottom left)
    chart.smallMap.align = "right";
    chart.smallMap.valign = "top";
    chart.smallMap.series.push(polygonSeries);
    
    // Zoom control
    chart.zoomControl = new am4maps.ZoomControl();
    
    var homeButton = new am4core.Button();
    homeButton.events.on("hit", function(){
      chart.goHome();
    });
    
    homeButton.icon = new am4core.Sprite();
    homeButton.padding(7, 5, 7, 5);
    homeButton.width = 30;
    homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
    homeButton.marginBottom = 10;
    homeButton.parent = chart.zoomControl;
    homeButton.insertBefore(chart.zoomControl.plusButton);

    }); // end am4core.ready()