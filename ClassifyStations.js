define([
    "jquery",
    "dojo/text!./config.json",
    "dojo/text!./validators.json",
    "dojo/text!./Templates.html",
     "./SabineMap",
      "./SabineDialog",
     "esri/tasks/FeatureSet",
     "esri/layers/FeatureLayer",
     "esri/renderers/UniqueValueRenderer",
      "esri/geometry/Extent",
      "esri/symbols/PictureMarkerSymbol",
       "esri/dijit/Legend",
       "dijit/TooltipDialog"

], function ($, config,validators,templates,SabineMap,SabineDialog,FeatureSet,FeatureLayer,UniqueValueRenderer,Extent,PictureMarkerSymbol,Legend,TooltipDialog) {

    var configVals = dojo.eval(config)[0];
    var validate = dojo.eval(validators)[0];

    return {

        classifyStations: function (container, map, inputs, response) {
            //***Classifies the stations based on the salinity model output

            $("#divLanding").css("display", "none");
            $("#divResults").css("display", "");

            //populate inputs
            $("#spanSampleMonthDisplay").text(inputs.selectedMonth);
            $("#spanWaterLevelDisplay").text(inputs.waterLevel);
            $("#spanDamFlowDisplay").text(inputs.damFlow);
            $("#spanRiverFlowDisplay").text(inputs.riverFlow);

            map.setExtent(new Extent(configVals.sabineExtent));
            $("#radLake").prop("checked", true);
            $("#radFull").prop("checked", false);

            var table = $("#tbodyResults");
            $(table).html(null); //remove existing rows

            var greenIcon = "plugins/sabine_app/images/GreenSphere.png";
            var redIcon = "plugins/sabine_app/images/RedSphere.png";
            var yellowIcon = "plugins/sabine_app/images/YellowSphere.png"

            //remove the existing stations layer
            var stationsLayer = map.getLayer("SabineApp_Stations");
            if (stationsLayer)
                map.removeLayer(stationsLayer);


           var lstStations = configVals.stations;

            //make the results table
            $.each(response, function () {
                var key = this.station
                var valAbove = this.upper_exceedance;
                var valBelow = this.lower_exceedance;
                var valDisplay = valAbove;
                if (valAbove < valBelow)
                    valDisplay = valBelow;

                //update the station list with the value for the map
                $.each(lstStations, function (k, station) {
                    if (station.attributes.Station == key) {
                      station.attributes["Percentage"] = valDisplay;
                      return false
                    }
                })

                var icon = greenIcon;
                if (valDisplay >= 0.50 && valDisplay <= 0.75) {
                    icon = yellowIcon;
                }
                else if (valDisplay > 0.75) {
                    icon = redIcon;
                }

                //add the table row
                var row = $("<tr>");
                row.append($("<td>").text(key));
                row.append($("<td>").text((Math.round((parseFloat(valBelow)*100) *100)/100).toString() + "%").css("text-align","center"));
                row.append($("<td>").text((Math.round((parseFloat(valAbove) * 100) * 100) / 100).toString() + "%").css("text-align", "center"));
                var imageCell = $("<td>");
                var iconImage = $("<img>");
                iconImage.attr("src", icon);
                iconImage.attr("height", "32");
                iconImage.attr("width", "32");
                imageCell.append(iconImage);
                row.append(imageCell);

                table.append(row);
            });



            //update the map
            var jsonFS = {
                "displayFieldName": "Station",
                "fieldAliases": {
                    "Station": "Station",
                    "Name": "Name",
                    "Percentage": "Percentage"
                },
                "geometryType": "esriGeometryPoint",
                "spatialReference": {
                    "wkid": 3857
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
                        "length": 255
                    },
                     {
                         "name": "Name",
                         "type": "esriFieldTypeString",
                         "alias": "Name",
                         "length": 255
                     },
                      {
                          "name": "Percentage",
                          "type": "esriFieldTypeDouble",
                          "alias": "Percentage"

                      }
                ],
                "features": lstStations
            }

            var fsStations = new FeatureSet(jsonFS);

            var featureCollection = {
                layerDefinition: {
                    "geometryType": "esriGeometryPoint",
                    "objectIdField": "ObjectID",
                    "fields": [
                        {
                            "name": "ObjectID",
                            "alias": "ObjectID",
                            "type": "esriFieldTypeOID"
                        },
                        {
                            "name": "Station",
                            "type": "esriFieldTypeString",
                            "alias": "Station"
                        },
                        {
                            "name": "Name",
                            "type": "esriFieldTypeString",
                            "alias": "Name"
                        }
                    ]
                },
                featureSet: fsStations
            };

            var featureLayer = new FeatureLayer(featureCollection, { mode: FeatureLayer.MODE_SNAPSHOT, id: "SabineApp_Stations",outfields:["Station"] });
            var renderer = new UniqueValueRenderer(null, function (graphic) {
                if (graphic.attributes['Percentage'] > 0.75)
                    return "> 75%"
                else if (graphic.attributes['Percentage'] >= 0.50 && graphic.attributes['Percentage'] <= 0.75)
                    return "50% - 75%"
                else
                    return "< 50%"
            });

            var greenSymbol = new PictureMarkerSymbol({ "angle": 0, "xoffset": 0, "yoffset": 0, "type": "esriPMS", "url": greenIcon, "contentType": "image/png", "width": 32, "height": 32 });
            var yellowSymbol = new PictureMarkerSymbol({ "angle": 0, "xoffset": 0, "yoffset": 0, "type": "esriPMS", "url": yellowIcon, "contentType": "image/png", "width": 32, "height": 32 });
            var redSymbol = new PictureMarkerSymbol({ "angle": 0, "xoffset": 0, "yoffset": 0, "type": "esriPMS", "url": redIcon, "contentType": "image/png", "width": 32, "height": 32 });

            renderer.addValue({ value: "< 50%", label: "< 50% outside range", symbol: greenSymbol });
            renderer.addValue({ value: "50% - 75%", label: "50% - 75% outside range", symbol: yellowSymbol });
            renderer.addValue({ value: "> 75%", label: "> 75% outside range", symbol: redSymbol });
            featureLayer.setRenderer(renderer);

            map.addLayer(featureLayer);

            //reset the legend
            var divLegendReference = document.getElementById("divSabineLegendReference");                
            if (!divLegendReference) {
                $(legendContainer).html(null);
                $(legendContainer).css("display", "");

                divLegendReference = $('<div>');
                $(divLegendReference).attr("id", "divSabineLegendReference")
                $(legendContainer).append(divLegendReference);
            }
                

            if (dijit.byId("divSabineLegend"))
                dijit.byId("divSabineLegend").destroy();

            //make a div for the legend
            var placeholder = $('<div>');
            $(placeholder).attr("id", "divSabineLegend");
            $(divLegendReference).append(placeholder);

            var layerInfos = new Array();

            var lstLayers = map.graphicsLayerIds;
            $.each(lstLayers, function (i, layerID) {
                if (layerID.indexOf("SabineApp") >= 0)
                    layerInfos.push({ "layer": map.getLayer(layerID), "title": "test" })
            });

            var appLegend = new Legend({
                map: map,
                layerInfos: layerInfos
            }, divSabineLegend);

            appLegend.startup();

            //add the tool tip
            var stationTooltip = new TooltipDialog({
                style: "position: absolute;font: normal normal normal 8pt Helvetica; z-index:100",
                position: "right"
            });
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

        }
    }
    })