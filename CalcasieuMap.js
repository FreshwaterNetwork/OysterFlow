define([
    "jquery",
    "dojo/text!./config.json",
    "dojo/text!./validators.json",
     "./SabineSelect",
    "esri/SpatialReference",
     "esri/layers/GraphicsLayer",
     "esri/symbols/PictureMarkerSymbol",
     "esri/symbols/SimpleMarkerSymbol",
     "esri/symbols/SimpleLineSymbol",
     "esri/geometry/Point",
     "esri/tasks/FeatureSet",
     "esri/layers/FeatureLayer",
     "esri/renderers/UniqueValueRenderer",
      "esri/dijit/Legend",
      "esri/geometry/Extent",
       "dijit/TooltipDialog",
       "dojo/_base/Color"
     

], function ($, config,validators,SabineSelect,SpatialReference, GraphicsLayer, PictureMarkerSymbol,SimpleMarkerSymbol,SimpleLineSymbol, Point, FeatureSet,
    FeatureLayer, UniqueValueRenderer, Legend,Extent,TooltipDialog,Color) {

    var configVals = dojo.eval(config)[0];
    var validate = dojo.eval(validators)[0];

    return {
               
        loadStations: function (map) {
            //Loads the unclassified stations

            //remove the existing stations layer
            var stationsLayer = map.getLayer("SabineApp_CalcasieuStations");
            if (stationsLayer)
                map.removeLayer(stationsLayer);

            //var stationSymbol = new PictureMarkerSymbol({ "angle": 0, "xoffset": 0, "yoffset": 0, "type": "esriPMS", "url": "plugins/OysterFlow/images/BlueSphere.png", "contentType": "image/png", "width": 32, "height": 32 });
            var stationSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE,10,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 1), new Color([0,255,0,0.25]));


            var jsonFS = {
                "displayFieldName": "Station",
                "fieldAliases": {
                    "Station": "Station",
                    "Name":"Name"
                },
                "geometryType": "esriGeometryPoint",
                "spatialReference": {
                    "wkid":3857
                },
                "fields": [
                     {
                         "name": "ObjectID",
                         "alias": "ObjectID",
                         "type": "esriFieldTypeOID"
                     },
                    {
                        "name": "Station",
                        "type": "esriFieldTypeString",
                        "alias": "Station",
                        "length":255
                    },
                     {
                         "name": "Name",
                         "type": "esriFieldTypeString",
                         "alias": "Name",
                         "length": 255
                     }
                ],
                "features":configVals.calcasieuStations
            }

            var fsStations = new FeatureSet(jsonFS);

            var featureCollection = {
                layerDefinition: {
                    "geometryType": "esriGeometryPoint",
                    "objectIdField": "ObjectID",
                    "drawingInfo": {
                        "renderer": {
                            "type": "uniqueValue",
                            "field1":"DisplayName",                           
                            "uniqueValueInfos": [{
                                "value": "Stations",
                                "symbol":stationSymbol
                            }]
                        }
                    },
                    "fields": [
                        {
                            "name": "ObjectID",
                            "alias": "ObjectID",
                            "type": "esriFieldTypeOID"
                        },
                        {
                            "name": "Station",
                            "type": "esriFieldTypeString",
                            "alias":"Station"
                        },
                        {
                            "name": "Name",
                            "type": "esriFieldTypeString",
                            "alias":"Name"
                        }
                    ]
                },
                featureSet:fsStations
            };

            var featureLayer = new FeatureLayer(featureCollection, { mode: FeatureLayer.MODE_SNAPSHOT, id: "SabineApp_CalcasieuStations", outfields:["Station"] });
            var renderer = new UniqueValueRenderer(null, "Station");
            /*var symbol1743 = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([153, 51, 255]), 1), new Color([153, 51, 255, 1.0]));
            var symbol0644 = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([102, 51, 0]), 1), new Color([102, 51, 0, 1.0]));
            var symbol0685 = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([153, 153, 153]), 1), new Color([153, 153, 153]));
            var symbol0687 = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([51, 153, 153]), 1), new Color([51, 153, 153, 1.0]));*/

            var symbol1743 = new PictureMarkerSymbol({ "angle": 0, "xoffset": 0, "yoffset": 0, "type": "esriPMS", "url": "plugins/OysterFlow/images/ShinyPin.png", "contentType": "image/png", "width": 32, "height": 32 });
            var symbol0644 = new PictureMarkerSymbol({ "angle": 0, "xoffset": 0, "yoffset": 0, "type": "esriPMS", "url": "plugins/OysterFlow/images/PurpleShinyPin.png", "contentType": "image/png", "width": 32, "height": 32 });
            var symbol0685 = new PictureMarkerSymbol({ "angle": 0, "xoffset": 0, "yoffset": 0, "type": "esriPMS", "url": "plugins/OysterFlow/images/LightBlueShinyPin.png", "contentType": "image/png", "width": 32, "height": 32 });
            var symbol0687 = new PictureMarkerSymbol({ "angle": 0, "xoffset": 0, "yoffset": 0, "type": "esriPMS", "url": "plugins/OysterFlow/images/BlueShinyPin.png", "contentType": "image/png", "width": 32, "height": 32 });

            renderer.addValue({ value: "CRMS1743", label: "CRMS1743", symbol: symbol1743 });
            renderer.addValue({ value: "CRMS0644", label: "CRMS0644", symbol: symbol0644 });
            renderer.addValue({ value: "CRMS0685", label: "CRMS0685", symbol: symbol0685 });
            renderer.addValue({ value: "CRMS0687", label: "CRMS0687", symbol: symbol0687 });
            featureLayer.setRenderer(renderer);

            map.addLayer(featureLayer);

            map.centerAndZoom([configVals.mapCenter.x, configVals.mapCenter.y], configVals.mapCenter.zoom);
            $("#radLake").prop("checked", false);
            $("#radFull").prop("checked", true);


            //initialize the mouse over tooltip
            var stationTooltip = new TooltipDialog({
                style: "position: absolute;font: normal normal normal 8pt Helvetica; z-index:100",
                position: "right"
            });

            //add the tool tip
            featureLayer.on("mouse-over", function (evt) {
                map.graphics.clear();

                var t = "<div align ='center'>${Station}</div>";
                var content = esri.substitute(evt.graphic.attributes, t);
               
                stationTooltip.startup();
                stationTooltip.setContent(content);
                dijit.popup.open({ popup: stationTooltip, x: evt.pageX, y: evt.pageY });
            });

            featureLayer.on("mouse-out", function (evt) {
                map.graphics.clear();
                dijit.popup.close(stationTooltip);
            });

            return featureLayer;

         
        },

        loadDefaultLegend: function (map) {
            if (dijit.byId("divSabineLegend"))
                dijit.byId("divSabineLegend").destroy();

            $(legendContainer).html(null);
            $(legendContainer).css("display", "");

            var legendReference = $('<div>');
            $(legendReference).attr("id", "divSabineLegendReference")
            $(legendContainer).append(legendReference);

            //make a div for the legend
            var placeholder = $('<div>');
            $(placeholder).attr("id", "divSabineLegend");
            $(legendReference).append(placeholder);

            var layerInfos = [
                
                { layer: map.getLayer("SabineApp_CalcasieuLake"), title: "Lake" },
                { layer: map.getLayer("SabineApp_CalcasieuRiver"), title: "River" },
                { layer: map.getLayer("SabineApp_CalcasieuStations"), title: "Stations" }
            ];

            var appLegend = new Legend({
                map: map,
                layerInfos: layerInfos
            }, divSabineLegend);

            appLegend.startup();
        },

        clearMap: function () {
            //called when switching between the Calcasieu and the Sabine
                var layerList = map.graphicsLayerIds;
                for (var i = layerList.length - 1; i >= 0; i--) {

                    if (layerList[i].indexOf("SabineApp") >= 0) //all layers for the tool have SabineApp in the ID
                        map.removeLayer(map.getLayer(layerList[i]));

                }

                //clean up the legend
                if (dijit.byId("divSabineLegend"))
                    dijit.byId("divSabineLegend").destroy();

                $(legendContainer).html(null);

                
            }


        

       
    }
}
);
