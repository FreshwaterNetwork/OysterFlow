require({
    packages: [
	{
	    name: "jquery",
	    location: "//ajax.googleapis.com/ajax/libs/jquery/1.9.0",
	    main: "jquery.min"
	}
    ]
});

define([
    "jquery"

], function ($) {
   

    return {
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
        }
    }
})