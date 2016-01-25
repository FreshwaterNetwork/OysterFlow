
define([
    "jquery",
    "dojo/text!./config.json",
    "dojo/text!./validators.json",
    "dojo/text!./Templates.html",
     "./SabineMap",
     "./CalcasieuMap",
      "./CalculateSalinity",
      "./IntroDialog",
       "esri/geometry/Extent",
       "exports"
       
], function ($, config,validators,templates,SabineMap,CalcasieuMap,Salinity,IntroDialog,Extent,exports) {
    var configVals = dojo.eval(config)[0];

   
       
        exports.setSabineDialog = function (container, map, app,state) {
            //loads the content and wires up the events

            $(container).html($.trim($(templates).find("#template-SabineApp").html()));
            
            $("#dialog-message").dialog({
                modal: true,
                autoOpen: false,
                width: 600,
                buttons: {
                    CLOSE: function () {
                        $(this).dialog("close");
                    }
                }
            }
          )
            $("#imgDamFlow","#imgRiverFlow","#imgWaterFlow").tooltip();

            $("#aThresholds").attr("onclick", "$('#dialog-message').dialog('open');");

            $("#aSabineBack").click(function (e) {
                e.preventDefault();
                CalcasieuMap.clearMap();
                IntroDialog.setIntroDialog(container, map, app);
            });
           
            $("#radFull").change(function () { map.centerAndZoom([configVals.mapCenter.x, configVals.mapCenter.y], configVals.mapCenter.zoom); });
            $("#radLake").change(function () { map.setExtent(new Extent(configVals.sabineExtent)) });
            $("#selMonth").change(function(){SabineMap.setValidators(map)});
            $("#btnCalculate").click(function () {
                Salinity.calculateSalinity(map,app);
            });
            SabineMap.setValidators(map);

            $("#btnStartOver").click(function () {
                $("#divLanding").css("display", "");
                $("#divResults").css("display", "none");
                SabineMap.loadStations(map);
                SabineMap.loadDefaultLegend(map);
            });

        }




})