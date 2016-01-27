
define([
    "jquery",
    "dojo/text!./config.json",
    "dojo/text!./validators.json",
    "dojo/text!./Templates.html",
     "./CalcasieuMap",
      "./CalcasieuChart",
      "./IntroDialog",
       "esri/geometry/Extent",
         "esri/SpatialReference",
       "exports"
       
], function ($, config,validators,templates,CalcasieuMap,CalcasieuChart,IntroDialog,Extent,SpatialReference,exports) {
    var configVals = dojo.eval(config)[0];

    

       
        exports.setCalcasieuDialog = function (container, map, app,state) {
            //loads the content and wires up the events

            $(container).html($.trim($(templates).find("#template-CalcasieuApp").html()));
            
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
            

            $("#aThresholds").attr("onclick", "$('#dialog-message').dialog('open');");
            $("#aCalcThresholds").attr("onclick", "$('#dialog-message').dialog('open');");

            $("#aCalcasieuBack").click(function (e) {
                e.preventDefault();
                CalcasieuMap.clearMap();
                IntroDialog.setIntroDialog(container, map, app,state);
            });

             
           
            $("#radFull").change(function () { map.centerAndZoom([configVals.mapCenterCalcasieu.x, configVals.mapCenterCalcasieu.y], configVals.mapCenterCalcasieu.zoom); });
            $("#radLake").change(function () { map.setExtent(new Extent(configVals.calcasieuExtent)) });
            $("#btnCalculate").click(function () {

                  var userInput = $("#txtInput").val();

                 //make sure this is a number between 0 and 5000
                  if (isNaN(parseInt(userInput)) || parseInt(userInput) > 5000 || parseInt(userInput) < 0) {
                  
                      $("#divWarning").css("color", "red");
                     

                  }
                  else {
                     
                       $("#divWarning").css("color", "black");
                       CalcasieuChart.addChart(container, "station_1743");
                       $("#td1743").css("font-weight","bold");
                        //change the map extent
                        map.setExtent(new Extent(configVals.calcasieuExtent));
                        $("#radLake").prop("checked", true);
                        $("#radFull").prop("checked", false);
                  }

            });

            $("#rad1743,#rad0644,#rad0685,#rad0687").each(function () {
                $(this).click(function () {
                    $("#td1743").css("font-weight", "normal");
                    $("#td0644").css("font-weight", "normal");
                    $("#td0685").css("font-weight", "normal");
                    $("#td0687").css("font-weight", "normal");

                    var stationString = "station_" + this.id.replace("rad", "");
                    $("#td" + this.id.replace("rad", "")).css("font-weight", "bold");
                    CalcasieuChart.addChart(container, stationString);

                });
            });

           
            $("#btnStartOver").click(function () {
                $("#divCalcasieuLanding").css("display", "");
                $("#divCalcasieuResults").css("display", "none");
                map.centerAndZoom([configVals.mapCenterCalcasieu.x, configVals.mapCenterCalcasieu.y], configVals.mapCenterCalcasieu.zoom);
                $("#radLake").prop("checked", false);
                $("#radFull").prop("checked", true);
                $("#rad1743").prop("checked", true);
                $("#rad0644").prop("checked", false);
                $("#rad0685").prop("checked", false);
                $("#rad0687").prop("checked", false);

                $("#td1743").css("font-weight", "bold");
                $("#td0644").css("font-weight", "normal");
                $("#td0685").css("font-weight", "normal");
                $("#td0687").css("font-weight", "normal");
            });

            if (state) {
                $("#txtInput").val(state.calcasieuWithdrawal);
                if (state.results) {
                    $("#rad1743").prop("checked", false);
                    $("#rad0644").prop("checked", false);
                    $("#rad0685").prop("checked", false);
                    $("#rad0687").prop("checked", false);

                    $("#rad1743").css("font-weight", "normal");
                    $("#rad0644").css("font-weight", "normal");
                    $("#rad0685").css("font-weight", "normal");
                    $("#rad0687").css("font-weight", "normal");

                    $("#" + state.selectedStationID).prop("checked", true);
                    $("#" + state.selectedStationID).css("font-weight","bold");

                     CalcasieuChart.addChart(container,"station_" + state.selectedStationID.replace("rad",""));
                    //change the map extent
                    map.setExtent(new Extent(state.mapExtent.xmin, state.mapExtent.ymin, state.mapExtent.xmax, state.mapExtent.ymax, new SpatialReference(state.mapExtent.spatialReference.wkid)));
                    $("#radLake").prop("checked", true);
                    $("#radFull").prop("checked", false);
                }
                state = null;
            }

         

        }
})