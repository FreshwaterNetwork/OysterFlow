define([
    "jquery",
    "dojo/text!./config.json", 
     "./SabineMap",
      "./CalcasieuMap",
      "./CalculateSalinity",
       "esri/SpatialReference",
       "esri/geometry/Extent",
       "esri/layers/FeatureLayer"

], function ($, config,SabineMap,CalcasieuMap,Salinity,SpatialReference,Extent,FeatureLayer) {
    var configVals = dojo.eval(config)[0];
    return {

        setInitialMap: function (map,state) {
            //add the sabine layers
            var reservoirLayer = new FeatureLayer(configVals.layers.Reservoir, {
                mode: FeatureLayer.MODE_ONDEMAND,
                id: "SabineApp_Reservoir"
            });
            map.addLayer(reservoirLayer);

            var riverLayer = new FeatureLayer(configVals.layers.SabineRiver, {
                mode: FeatureLayer.MODE_ONDEMAND,
                id: "SabineApp_SabineRiver"
            });
            map.addLayer(riverLayer);

            var lakeLayer = new FeatureLayer(configVals.layers.Lake, {
                mode: FeatureLayer.MODE_ONDEMAND,
                id: "SabineApp_Lake"
            });
            map.addLayer(lakeLayer);

            var nechesLayer = new FeatureLayer(configVals.layers.NechesRiver, {
                mode: FeatureLayer.MODE_ONDEMAND,
                id: "SabineApp_NechesRiver"
            });
            map.addLayer(nechesLayer);

            var damLayer = new FeatureLayer(configVals.layers.ToledoDam, {
                mode: FeatureLayer.MODE_ONDEMAND,
                id: "SabineApp_ToledoDam"
            });
            map.addLayer(damLayer);

            var oysterReefs = new FeatureLayer(configVals.layers.SabineOysterReef, {
                mode: FeatureLayer.MODE_ONDEMAND,
                id: "SabineApp_OysterReefs"
            });
            map.addLayer(oysterReefs);

            if (!state) {
                var stationsLayer = SabineMap.loadStations(map);

                map.centerAndZoom([configVals.mapCenter.x, configVals.mapCenter.y], configVals.mapCenter.zoom);

                //add these layers to the legend
                SabineMap.loadDefaultLegend(map);
            }
            else {
                this.setValuesFromState(state, map);
                if (!state.results) {
                    var stationsLayer = SabineMap.loadStations(map);
                    map.setExtent(new Extent(state.mapExtent.xmin, state.mapExtent.ymin, state.mapExtent.xmax, state.mapExtent.ymax, new SpatialReference(state.mapExtent.spatialReference.wkid)));
                    SabineMap.loadDefaultLegend(map);
                }
                else { //calculate the results
                    Salinity.calculateSalinity(map);
                    map.setExtent(new Extent(state.mapExtent.xmin, state.mapExtent.ymin, state.mapExtent.xmax, state.mapExtent.ymax, new SpatialReference(state.mapExtent.spatialReference.wkid)));
                    
                }

            }

        },

        setValuesFromState: function (sabineState,map) {

            $("#selMonth option[value='" + sabineState.month + "']").prop('selected', true);
            SabineMap.setValidators(map);
            $("#spanDamFlow").text(sabineState.damFlow);

            $("#damFlow").slider({value: sabineState.damFlow});
            $("#spanWaterLevel").text(sabineState.waterLevel);
            $("#waterLevel").slider({ value: sabineState.waterLevel });
            $("#spanRiverFlow").text(sabineState.riverFlow);
            $("#riverFlow").slider({ value: sabineState.riverFlow });

        },

        setInitialCalcasieuMap: function (map) {
            //add the sabine layers

            var riverLayer = new FeatureLayer(configVals.layers.CalcasieuRiver, {
                mode: FeatureLayer.MODE_ONDEMAND,
                id: "SabineApp_CalcasieuRiver"
            });
            map.addLayer(riverLayer);

            var lakeLayer = new FeatureLayer(configVals.layers.CalcasieuLake, {
                mode: FeatureLayer.MODE_ONDEMAND,
                id: "SabineApp_CalcasieuLake"
            });
            map.addLayer(lakeLayer);
           
            var stationsLayer = CalcasieuMap.loadStations(map);

            map.centerAndZoom([configVals.mapCenterCalcasieu.x, configVals.mapCenterCalcasieu.y], configVals.mapCenterCalcasieu.zoom);

            //add these layers to the legend
            CalcasieuMap.loadDefaultLegend(map);
            
           
        }
    }
})