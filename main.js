require({
    packages: [
	{
	    name: "jquery",
	    location: "//ajax.googleapis.com/ajax/libs/jquery/1.9.0",
	    main: "jquery.min"
	}/*,
    {
	    name: "orderBars",
	    location: "./",
	    main: "jquery.flot.orderBars.js"
    }*/
    ]
});

define([
    "dojo/_base/declare",
    "framework/PluginBase",
   "jquery",
   "./jquery-ui.min",
    "dojo/text!./Templates.html",
    "dojo/text!./config.json",   
    "./SabineMap",
    "./SabineDialog",
    "./CalcasieuDialog",
     "./CalculateSalinity",
     "./InitialMap",
    "esri/geometry/Extent",
    "esri/SpatialReference",
     "esri/layers/FeatureLayer",
     "esri/layers/GraphicsLayer",
     "esri/symbols/PictureMarkerSymbol",
     "esri/geometry/Point",
      "esri/dijit/Legend"
],
    function (declare, PluginBase, $, ui, templates, config,SabineMap,SabineDialog,CalcasieuDialog,Salinity,InitialMap,Extent, SpatialReference, FeatureLayer, GraphicsLayer, PictureMarkerSymbol,
        Point,Legend) {

        var configVals = dojo.eval(config)[0];
	    var isActive = true;       

        
        return declare(PluginBase, {
            toolbarName: configVals.toolbarName,
            //fullName: "",
            toolbarType: "sidebar",
            allowIdentifyWhenActive: false,
            infoGraphic: configVals.infoGraphic,
            width: configVals.dialogWidth,
            height: configVals.dialogHeight,
            showServiceLayersInLegend: true,

            initialize: function (args) {
                container = args.container;
                legendContainer = args.legendContainer;
                map = args.map;
                app = args.app;
                state = null;
            },

            activate: function () {

                var hasState = false;

                if (isActive) {
                    if (state) {
                        if (state.isSabine) {
                            SabineDialog.setSabineDialog(container, map, app,state);
                            InitialMap.setInitialMap(map, state);
                            hasState = true;                           
                        }
                        else if (state.isCalcasieu){
                             CalcasieuDialog.setCalcasieuDialog(container, map,app,state);
                             InitialMap.setInitialCalcasieuMap(map);
                             hasState = true;
                        }
                    }

                    if (!hasState) {
                         $(container).html($.trim($(templates).find("#template-OysterIntro").html()));
                        $("#aSabine").click(function (e) {
                            e.preventDefault();
                            SabineDialog.setSabineDialog(container, map, app,state);
                            InitialMap.setInitialMap(map,state);
                        });
                        $("#aCalcasieu").click(function (e) {
                            e.preventDefault();
                            CalcasieuDialog.setCalcasieuDialog(container, map,state);
                            InitialMap.setInitialCalcasieuMap(map);
                        });
                    }

                    
                    
                   
                }                             
            },

            deactivate: function () {
                //this.removeLayers();
                isActive = false;
            },

            hibernate: function () {
                isActive = true;
                this.removeLayers();
            },

            getState: function () {
               return this.getState();           
            },

            setState: function (inputState) {
                state = inputState;
            },

            

            

           

            removeLayers: function () {
                var layerList = map.graphicsLayerIds;
                for (var i = layerList.length - 1; i >= 0; i--) {

                    if (layerList[i].indexOf("SabineApp") >= 0) //all layers for the tool have SabineApp in the ID
                        map.removeLayer(map.getLayer(layerList[i]));

                }

                //clean up the legend
                if (dijit.byId("divSabineLegend"))
                    dijit.byId("divSabineLegend").destroy();

                $(legendContainer).html(null);

                
            },

         

            getState: function () {
                var salinityState = null;
                salinityState = new Object;

                salinityState.isSabine = false;
                salinityState.isCalcasieu = false;

                if ($("#divSabineLabel").length > 0) {
                    salinityState.isSabine = true;
                }
                else if ($("#divCalcasieuLabel").length > 0) {
                    salinityState.isCalcasieu = true;
                }

                
                    //get the input values
                if (salinityState.isSabine){
                    salinityState.month = $("#selMonth").val();
                    salinityState.damFlow = $("#spanDamFlow").text();
                    salinityState.waterLevel = $("#spanWaterLevel").text();
                    salinityState.riverFlow = $("#spanRiverFlow").text();

                    //see if we are looking at results
                    if ($("#divResults").css("display") == "none")
                        salinityState.results = false;
                    else
                        salinityState.results = true;
                }
                else if (salinityState.isCalcasieu) {
                    salinityState.calcasieuWithdrawal = $("#txtInput").val();

                    if ($("#divCalcasieuResults").css("display") == "none")
                        salinityState.results = false;
                    else
                        salinityState.results = true;

                }
                

                salinityState.mapExtent = map.extent;
                return salinityState;
            }

            
        });
    }
);