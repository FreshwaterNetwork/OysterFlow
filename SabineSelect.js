define([
    "jquery",
    "esri/layers/FeatureLayer",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleFillSymbol"
    

], function ($,FeatureLayer, SimpleRenderer, SimpleFillSymbol) {

    return {

        selectFeature: function (map,featurePath) {
            var selectedFeature = new FeatureLayer(featurePath,
                     {
                         mode: FeatureLayer.MODE_ONDEMAND,
                         outFields: ["*"],
                         id: "SabineApp_Selected"


                     });

            selectedFeature.setRenderer(new SimpleRenderer(new SimpleFillSymbol(
                      {
                          "type": "esriSFS",
                          "style": "esriSFSSolid",
                          "color": [51, 255,51, 1],
                          "outline": {
                              "type": "esriSLS",
                              "style": "esriSLSSolid",
                              "color": [51, 255, 51],
                              "width": 2
                          }
                      }
                    )));

            map.addLayer(selectedFeature);
        },

        removeSelectedFeature: function (map) {
            var selectedFeature = map.getLayer("SabineApp_Selected");
            if (selectedFeature)
                map.removeLayer(selectedFeature);
        }
    }
})