define([
    "jquery",
    "dojo/text!./Templates.html",
    "./SabineDialog",
    "./InitialMap",
    "./CalcasieuDialog",
    "exports"

], function ($,templates,SabineDialog,InitialMap,CalcasieuDialog,exports) {
   

   

            exports.setIntroDialog = function (container,map,app) {
                  $(container).html($.trim($(templates).find("#template-OysterIntro").html()));

                $("#aSabine").click(function (e) {
                    e.preventDefault();
                    SabineDialog.setSabineDialog(container, map, app);
                    InitialMap.setInitialMap(map);
                });

                $("#aCalcasieu").click(function (e) {
                    e.preventDefault();
                    CalcasieuDialog.setCalcasieuDialog(container, map,app);
                    InitialMap.setInitialCalcasieuMap(map);
                });
            }
       
        
    })