
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

    //return {

       
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
                      //alert("Please enter a whole number between 0 and 5000.");
                      $("#divWarning").css("color", "red");
                     

                  }
                  else {
                     
                       $("#divWarning").css("color", "black");
                        CalcasieuChart.addChart(container);
                        //change the map extent
                        map.setExtent(new Extent(configVals.calcasieuExtent));
                        $("#radLake").prop("checked", true);
                        $("#radFull").prop("checked", false);
                  }

            });
           
            $("#btnStartOver").click(function () {
                $("#divCalcasieuLanding").css("display", "");
                $("#divCalcasieuResults").css("display", "none");
                map.centerAndZoom([configVals.mapCenterCalcasieu.x, configVals.mapCenterCalcasieu.y], configVals.mapCenterCalcasieu.zoom);
                $("#radLake").prop("checked", false);
                $("#radFull").prop("checked", true);
            });

            if (state) {
                $("#txtInput").val(state.calcasieuWithdrawal);
                if (state.results) {
                     CalcasieuChart.addChart(container);
                    //change the map extent
                    map.setExtent(new Extent(state.mapExtent.xmin, state.mapExtent.ymin, state.mapExtent.xmax, state.mapExtent.ymax, new SpatialReference(state.mapExtent.spatialReference.wkid)));
                    $("#radLake").prop("checked", true);
                    $("#radFull").prop("checked", false);
                }
                state = null;
            }

         

        }

      

        /*setValuesFromState: function (sabineState,map) {

            $("#selMonth option[value='" + sabineState.month + "']").prop('selected', true);
            SabineMap.setValidators(map);
            $("#spanDamFlow").text(sabineState.damFlow);

            $("#damFlow").slider({value: sabineState.damFlow});
            $("#spanWaterLevel").text(sabineState.waterLevel);
            $("#waterLevel").slider({ value: sabineState.waterLevel });
            $("#spanRiverFlow").text(sabineState.riverFlow);
            $("#riverFlow").slider({ value: sabineState.riverFlow });

          
        },

        getState: function (map) {
            var sabineState = new Object;
            //get the input values
            sabineState.month = $("#selMonth").val();
            sabineState.damFlow = $("#spanDamFlow").text();
            sabineState.waterLevel = $("#spanWaterLevel").text();
            sabineState.riverFlow = $("#spanRiverFlow").text();

            //see if we are looking at results
            if ($("#divResults").css("display") == "none")
                sabineState.results = false;
            else
                sabineState.results = true;

            sabineState.mapExtent = map.extent;
            return sabineState;
        }*/
   // }




})