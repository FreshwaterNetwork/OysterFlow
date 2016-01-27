define(
    [
        "jquery",
        "./jquery-ui.min",
        "./jquery.flot",   
        "dojo/text!./config.json"
       
    ],
    function ($, ui, plot, config) {

        var configVals = dojo.eval(config)[0];
        var container = null;

        return {
            addChart: function (inputContainer,stationID) {



                var userInput = $("#txtInput").val();

                //make sure this is a number between 0 and 5000
                if (isNaN(parseInt(userInput)) || parseInt(userInput) > 5000 || parseInt(userInput) < 0) {
                    alert("Please enter a whole number between 0 and 5000.");
                    return;
                }

                $("#divCalcasieuLanding").css("display", "none");
                $("#divCalcasieuResults").css("display", "");
                $("#spanWithdrawal").html(userInput)



                container = inputContainer;

                //make a div for the chart 
                var chartDiv = $("#divChart");
                $(chartDiv).html(null);

                var placeholder = $('<div>');
                $(placeholder).attr("id", "placeholder");
                $(placeholder).css({ "font-size": "10px", "line-height": "1.2em" });
                $(placeholder).width(450);
                $(placeholder).height(325);
                chartDiv.append(placeholder);


                this.getTimeSeriesData(userInput,stationID);



            },

            getTimeSeriesData: function (userInput,stationID) {

                $("#placeholder").html(null); //clear the existing chart
              

                var promise = $.ajax({
                    type: "GET",
                    url: configVals.WaterFALLService + "salinityCalcasieu/.jsonp?station="+stationID+"&flow_reduce=" + userInput,
                    dataType: 'jsonp'

                });

                promise.done(this.makeTimeSeriesChart);

                //failure
                promise.fail(function (xhr, status, error) {
                    alert("XHR: " + xhr.responseText + " Status: " + status + " Error: " + error);

                });
            },

            makeTimeSeriesChart: function (response) {

               if (response.length > 0) {
                    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    var fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                    var dataCollection = [];

                    var threshold = [[16, 1], [14, 2], [12, 3], [7.8, 4], [7, 5], [12, 6], [13, 7], [16, 8], [17, 9], [16.8, 10], [16, 11], [15, 12]];
                    dataCollection.push({ data: threshold, points: { show: true, color: "blue", fillColor: "blue" }, color: "blue" });
                    dataCollection.push({ data: [[15, 1], [19, 1]], lines: { show: true, color: "blue" }, points: { show: false }, color: "blue" });
                    dataCollection.push({ data: [[11, 2], [17, 2]], lines: { show: true, color: "blue" }, points: { show: false }, color: "blue" });
                    dataCollection.push({ data: [[7, 3], [15, 3]], lines: { show: true, color: "blue" }, points: { show: false }, color: "blue" });
                    dataCollection.push({ data: [[2, 4], [13, 4]], lines: { show: true, color: "blue" }, points: { show: false }, color: "blue" });
                    dataCollection.push({ data: [[4, 5], [12, 5]], lines: { show: true, color: "blue" }, points: { show: false }, color: "blue" });
                    dataCollection.push({ data: [[9, 6], [16, 6]], lines: { show: true, color: "blue" }, points: { show: false }, color: "blue" });
                    dataCollection.push({ data: [[11, 7], [15, 7]], lines: { show: true, color: "blue" }, points: { show: false }, color: "blue" });
                    dataCollection.push({ data: [[13, 8], [17, 8]], lines: { show: true, color: "blue" }, points: { show: false }, color: "blue" });
                    dataCollection.push({ data: [[14, 9], [23, 9]], lines: { show: true, color: "blue" }, points: { show: false }, color: "blue" });
                    dataCollection.push({ data: [[13, 10], [18, 10]], lines: { show: true, color: "blue" }, points: { show: false }, color: "blue" });
                    dataCollection.push({ data: [[11, 11], [18, 11]], lines: { show: true, color: "blue" }, points: { show: false }, color: "blue" });
                    dataCollection.push({ data: [[13, 12], [17, 12]], lines: { show: true, color: "blue" }, points: { show: false }, color: "blue" });



                    var observed = [];


                    var predicted = [];



                    $.each(response, function () {
                        var strMonth = this.month;

                        var observedMean = parseFloat(this.observed_mean);
                      
                        observed.push([observedMean, parseFloat(strMonth) - 0.2]);
                        dataCollection.push({ data: [[this.observed_25, parseFloat(strMonth) - 0.2], [this.observed_75, parseFloat(strMonth) - 0.2]], lines: { show: true, color: "black" }, points: { show: false }, color: "black" });

                        var predictedMean = parseFloat(this.predicted_mean);
                       
                        predicted.push([predictedMean, parseFloat(strMonth) + 0.2]);
                        dataCollection.push({ data: [[this.predicted_25, parseFloat(strMonth) + 0.2], [this.predicted_75, parseFloat(strMonth) + 0.2]], lines: { show: true, color: "red" }, points: { show: false }, color: "red" });
                    });

                    dataCollection.push({ data: observed, points: { show: true, color: "black", fillColor: "black" }, color: "black" });
                    dataCollection.push({ data: predicted, points: { show: true, color: "red", fillColor: "red" }, color: "red" });

                    var chart = $.plot(placeholder, dataCollection, {
                      
                        xaxis: {
                            min: 0,
                            max: 35,
                            ticks: [0, 5, 10, 15, 20, 25,30,35]

                        },
                        yaxis: {
                            ticks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                            tickFormatter: function (val, axis) {
                                if (val > 0)
                                    return (months[val - 1]);
                                else
                                    return "";
                            },
                            transform: function (v) { return -v; },  
                            inverseTransform: function (v) { return -v; } 
                        }
                      
                    });

                };
            }
        }
    })