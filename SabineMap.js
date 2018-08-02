define([
    "jquery",
    "dojo/text!./config.json",
    "dojo/text!./validators.json",
     "./SabineSelect",
    "esri/SpatialReference",
     "esri/layers/GraphicsLayer",
     "esri/symbols/PictureMarkerSymbol",
     "esri/geometry/Point",
     "esri/tasks/FeatureSet",
     "esri/layers/FeatureLayer",
     "esri/renderers/UniqueValueRenderer",
      "esri/dijit/Legend",
      "esri/geometry/Extent",
       "dijit/TooltipDialog"
     

], function ($, config,validators,SabineSelect,SpatialReference, GraphicsLayer, PictureMarkerSymbol, Point, FeatureSet,
    FeatureLayer, UniqueValueRenderer, Legend,Extent,TooltipDialog) {

    var configVals = dojo.eval(config)[0];
    var validate = dojo.eval(validators)[0];

    return {
               
        loadStations: function (map) {
            //Loads the unclassified stations

            //remove the existing stations layer
            var stationsLayer = map.getLayer("SabineApp_Stations");
            if (stationsLayer)
                map.removeLayer(stationsLayer);

            var stationSymbol = new PictureMarkerSymbol({ "angle": 0, "xoffset": 0, "yoffset": 0, "type": "esriPMS", "url": "plugins/OysterFlow/images/BlueSphere.png", "contentType": "image/png", "width": 32, "height": 32 });

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
                "features":configVals.stations
            }

            var fsStations = new FeatureSet(jsonFS);

            var featureCollection = {
                layerDefinition: {
                    "geometryType": "esriGeometryPoint",
                    "objectIdField": "ObjectID",
                    "drawingInfo": {
                        "renderer": {
                            "type": "simple",
                            "symbol": stationSymbol,
                            "label": "Stations"
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

            var featureLayer = new FeatureLayer(featureCollection, { mode: FeatureLayer.MODE_SNAPSHOT, id: "SabineApp_Stations", outfields:["Station"] });
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
                { layer: map.getLayer("SabineApp_Reservoir"), title: " " },
                { layer: map.getLayer("SabineApp_NechesRiver"), title: " " },
                { layer: map.getLayer("SabineApp_SabineRiver"), title: " " },
                { layer: map.getLayer("SabineApp_ToledoDam"), title: " " },
                { layer: map.getLayer("SabineApp_Lake"), title: " " },
                { layer: map.getLayer("SabineApp_Stations"), title: " " }
            ];

            var appLegend = new Legend({
                map: map,
                layerInfos: layerInfos
            }, divSabineLegend);

            appLegend.startup();
        },

       

        setValidators: function (map) {
            var selectedMonth = $("#selMonth").find(":selected").text()
            lstValidate = validate[selectedMonth];

            $("#waterLevel").slider({
                min: lstValidate.waterLevel.min,
                max: lstValidate.waterLevel.max,
                value: lstValidate.waterLevel.med,
                step: .001,
                slide: function (event, ui) {
                    $("#spanWaterLevel").text(ui.value);
                },
                start: function (event, ui) {
                    SabineSelect.selectFeature(map, configVals.layers.Lake);
                },
                stop: function (event, ui) {
                    SabineSelect.removeSelectedFeature(map);
                }
            })

            $("#spanWaterLevel").text(lstValidate.waterLevel.med);
            $("#spanWaterLevelMin").text(lstValidate.waterLevel.min);
            $("#spanWaterLevelMax").text(lstValidate.waterLevel.max);

            $("#damFlow").slider({
                min: lstValidate.damFlow.min,
                max: lstValidate.damFlow.max,
                value: lstValidate.damFlow.med,
                step:1,
                slide: function (event, ui) {
                    $("#spanDamFlow").text(ui.value);
                },
                start: function (event, ui) {
                    SabineSelect.selectFeature(map, configVals.layers.Reservoir);
                },
                stop: function (event, ui) {
                    SabineSelect.removeSelectedFeature(map);
                }
                
            })

            //$damSlider.slider.on("slidestart", function (event, ui) { alert("start"); });
            //$damSlider.slider.on("slidestop", function (event, ui) { SabineMap.removeSelectedFeature(); });

            $("#spanDamFlow").text(lstValidate.damFlow.med);
            $("#spanDamFlowMin").text(lstValidate.damFlow.min);
            $("#spanDamFlowMax").text(lstValidate.damFlow.max);

            $("#riverFlow").slider({
                min: lstValidate.riverFlow.min,
                max: lstValidate.riverFlow.max,
                value: lstValidate.riverFlow.med,
                slide: function (event, ui) {
                    $("#spanRiverFlow").text(ui.value);
                },
                start: function (event, ui) {
                    SabineSelect.selectFeature(map, configVals.layers.NechesRiver);
                },
                stop: function (event, ui) {
                    SabineSelect.removeSelectedFeature(map);
                }
            })

            $("#spanRiverFlow").text(lstValidate.riverFlow.med);
            $("#spanRiverFlowMin").text(lstValidate.riverFlow.min);
            $("#spanRiverFlowMax").text(lstValidate.riverFlow.max);

        }

        

       
    }
}
);
