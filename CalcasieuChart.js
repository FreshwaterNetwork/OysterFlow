define(
    [
        "jquery",
        "./jquery-ui.min",
        "./jquery.flot",
        //"./jquery.flot.orderBars",      
        "dojo/text!./config.json"
       
    ],
    function ($, ui,plot,config) {                    

        var configVals = dojo.eval(config)[0];
        var container = null;

        return{
            addChart: function (inputContainer) {

                //get rid of any existing values
                $("#tdMonth1,#tdMonth2,#td1743Value, #td0644Value, #td0685Value, #td0687Value,#td1743Mean,#td0644Mean,#td0685Mean,#td0687Mean").each(function () {
                    $(this).html("");
                })

                  var userInput = $("#txtInput").val();

                 //make sure this is a number between 0 and 5000
                  if (isNaN(parseInt(userInput))||parseInt(userInput) > 5000 || parseInt(userInput) < 0) {
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

                //$("#ddTimeSeriesMetrics").change(FlowAppChart.getTimeSeriesData);

                var placeholder = $('<div>');
                $(placeholder).attr("id", "placeholder");
                $(placeholder).css({ "font-size": "10px", "line-height": "1.2em" });
                $(placeholder).width(450);
                $(placeholder).height(225);
                chartDiv.append(placeholder);

                /*var legendPlaceholder = $('<div>');
                $(legendPlaceholder).attr("id", "legendPlaceholder");
                $(legendPlaceholder).css({ "font-size": "8px", "line-height": "0.8em","padding-top":"15px","display":"" });
                $(legendPlaceholder).width(500);
                $(legendPlaceholder).height(30);
                chartDiv.append(legendPlaceholder);*/

                this.getTimeSeriesData(userInput);           

                
                
            },

             getTimeSeriesData: function (userInput) {

                $("#placeholder").html(null); //clear the existing chart
                $("#legendPlaceholder").html(null); //clear the existing chart

                var promise = $.ajax({
                    type: "GET",
                    url: configVals.WaterFALLService + "salinityCalcasieu/.jsonp?flow_reduce=" + userInput,
                    dataType: 'jsonp'

                });

                promise.done(this.makeTimeSeriesChart);

                //failure
                promise.fail(function (xhr, status, error) {
                    alert("XHR: " + xhr.responseText + " Status: " + status + " Error: " + error);

                });
             },

             makeTimeSeriesChart: function (response) {

                 


                //$("#placeholder").html(null); //clear the existing chart
                //$("#legendPlaceholder").html(null); //clear the existing chart

                if (response.length > 0) {
                    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    var fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                    //these are for the background
                    //var seriesGreen = [[0, 0.5], [1, 0.5], [2, 0.5], [3, 0.5], [4, 0.5], [5, 0.5], [6, 0.5], [7, 0.5], [8, 0.5], [9, 0.5], [10, 0.5], [11, 0.5], [12, 0.5], [13, 0.5]];
                    //var seriesYellow = [[0, 0.75], [1, 0.75], [2, 0.75], [3, 0.75], [4, 0.75], [5, 0.75], [6, 0.75], [7, 0.75], [8, 0.75], [9, 0.75], [10, 0.75], [11, 0.75], [12, 0.75], [13, 0.75]];
                    //var seriesRed = [[0, 1.0], [1, 1.0], [2, 1.0], [3, 1.0], [4, 1.0], [5, 1.0], [6, 1.0], [7, 1.0], [8, 1.0], [9, 1.0], [10, 1.0], [11, 1.0], [12, 1.0], [13, 1.0]];

                    var seriesGreen = [[0, 50], [1, 50], [2, 50], [3, 50], [4, 50], [5, 50], [6, 50], [7, 50], [8, 50], [9, 50], [10, 50], [11, 50], [12, 50], [13, 50]];
                    var seriesYellow = [[0, 75], [1, 75], [2, 75], [3, 75], [4, 75], [5, 75], [6, 75], [7, 75], [8, 75], [9, 75], [10, 75], [11, 75], [12, 75], [13, 75]];
                    var seriesRed = [[0, 100], [1, 100], [2, 100], [3, 100], [4, 100], [5, 100], [6, 100], [7, 100], [8, 100], [9, 100], [10, 100], [11, 100], [12, 100], [13, 100]];


                    //results from the service
                    var sta1743 = []; 
                    var sta0644 = []; 
                    var sta0685 = []; 
                    var sta0687 = [];

                    var mean1743 = [];
                    var mean0644 = [];
                    var mean0685 = [];
                    var mean0687 = [];


                    //manage the counts for stations below 0.5
                    /*var stationCounts = {
                        "1743": 0,
                        "0644": 0,
                        "0685": 0,
                        "0687": 0
                    }*/


                    $.each(response, function () {                        
                        var strMonth = this.month;
                        sta1743.push([parseFloat(strMonth) - 0.3, Math.round((100 * this.prob_1743) * 100) / 100]);
                        mean1743.push(this.mean_sd_1743);
                        //if (this.prob_1743 < 0.5)
                           // stationCounts["1743"]++;

                        sta0644.push([parseFloat(strMonth) - 0.1, Math.round((100 * this.prob_0644) * 100) / 100]);
                        mean0644.push(this.mean_sd_0644);
                        //if (this.prob_0644 < 0.5)
                        //    stationCounts["0644"]++;

                        sta0685.push([parseFloat(strMonth) + 0.1, Math.round((100 * this.prob_0685) * 100) / 100]);
                        mean0685.push(this.mean_sd_0685);
                        //if (this.prob_0685 < 0.5)
                        //    stationCounts["0685"]++;

                        sta0687.push([parseFloat(strMonth) + 0.3, Math.round((100 * this.prob_0687) * 100) / 100]);
                        mean0687.push(this.mean_sd_0687);
                        //if (this.prob_0687 < 0.5)
                        //    stationCounts["0687"]++;
                        
                    });

                    var chart = $.plot(placeholder, [                      
                        //"#edc240", "#cb4b4b", "#afd8f8", "#339933"

                      { data: seriesRed, bars: { show: false }, lines: { show: true, fill: true, fillColor:"#ffcccc" }, stack: true, color: "#ffcccc", opacity: 0.1,label:"> 75%" },
                      { data: seriesYellow, bars: { show: false }, lines: { show: true, fill: true, fillColor:"#ffffcc" }, stack: true, color: "#ffffcc", opacity: 0.5,label:"50 - 75%" },
                      { data: seriesGreen, bars: { show: false }, lines: { show: true, fill: true, fillColor:"#ccffcc" }, stack: true, color: "#ccffcc", opacity: 0.5,label:"< 50%" },
                     /* { data: sta1743, color: "#9933ff", bars: {order:0}},
                      { data: sta0644, color:"#663300", bars: {order:1}},
                      { data: sta0685, color:"#999999", bars: {order:2}},
                      { data: sta0687, color:"#339999", bars: {order:3}}*/

                      { data: sta1743, color: "#cccccc", bars: {order:0}},
                      { data: sta0644, color:"#663366", bars: {order:1}},
                      { data: sta0685, color:"#66ffff", bars: {order:2}},
                      { data: sta0687, color:"#003366", bars: {order:3}}

                    ], {
                        series: {
                            bars: {
                                show: true,
                                barWidth:0.2,
                                lineWidth: 0,
                                //order: 1,
                                fillColor: {
                                    colors: [{
                                        opacity: 1
                                    }, {
                                        opacity: 0.7
                                    }]
                                }
                            }
                        },
                        //colors: ["#edc240", "#cb4b4b", "#afd8f8", "#339933", ],
                        grid: {
                            hoverable: true,
                            clickable: false
                        },
                        /*legend: {
                            show:false

                        },*/
                        legend: {
                            container: $("#divChartLegend"),
                            noColumns: 3,
                            labelBoxBorderColor:"#FFFFFF"

                        },
                        yaxis: {
                            min: 0,
                            max: 100,
                            ticks:[10,20,30,40,50,60,70,80,90,100]
                            
                        },
                        xaxis: {
                            ticks:[1,2,3,4,5,6,7,8,9,10,11,12],
                            tickFormatter: function (val, axis) {
                                if (val > 0)
                                    return (months[val - 1]);
                                else
                                    return "";
                            }
                        }
                    });

                   $("#placeholder").on("plothover", function (event, pos, item) {
                      

                        if (item) {
                        
                            //get the index from the series, and then use this to show all of the values

                            var index = Math.round(item.dataIndex);
                            if (index < 12)
                            {
                                //var month = fullMonths[item.series.data[index][0] - 1]
                                $(".flot-x-axis .tickLabel").css("font-weight", "400");
                                $(".flot-x-axis .tickLabel").css("font-size", "14px");
                                $(".flot-x-axis .tickLabel")[index].style.fontWeight = "bold";
                                $(".flot-x-axis .tickLabel")[index].style.fontSize = "18px";
                                var month = months[Math.round(item.series.data[index][0]) - 1];
                                $("#tdMonth1").html(month);
                                $("#tdMonth2").html(month);
                                $("#td1743Value").html(sta1743[index][1]);
                                $("#td0644Value").html(sta0644[index][1]);
                                $("#td0685Value").html(sta0685[index][1]);
                                $("#td0687Value").html(sta0687[index][1]);
                                $("#td1743Mean").html(mean1743[index]);
                                $("#td0644Mean").html(mean0644[index]);
                                $("#td0685Mean").html(mean0685[index]);
                                $("#td0687Mean").html(mean0687[index]);
                            }
                            
                           

                    } 
                    }); //end of plot hover code


                    //lets fill out the legend table 
                    if ($("#td1743Label").html() == "") {
                    
                        $("#td1743Label").html("CRMS1743");
                        var image1743 = $('<img>');
                        $(image1743).attr("height", "26");
                        $(image1743).attr("width", "26");
                        $(image1743).attr("src", "plugins/sabine_app/images/ShinyPin.png");
                        $("#td1743Image").append(image1743);

                        $("#td0644Label").html("CRMS0644");
                        var image0644 = $('<img>');
                        $(image0644).attr("height", "26");
                        $(image0644).attr("width", "26");
                        $(image0644).attr("src", "plugins/sabine_app/images/PurpleShinyPin.png");
                        $("#td0644Image").append(image0644);

                         $("#td0685Label").html("CRMS0685");
                         var image0685 = $('<img>');
                         $(image0685).attr("height", "26");
                        $(image0685).attr("width", "26");
                        $(image0685).attr("src", "plugins/sabine_app/images/LightBlueShinyPin.png");
                        $("#td0685Image").append(image0685);

                         $("#td0687Label").html("CRMS0687");
                         var image0687 = $('<img>');
                         $(image0687).attr("height", "26");
                        $(image0687).attr("width", "26");
                        $(image0687).attr("src", "plugins/sabine_app/images/BlueShinyPin.png");
                        $("#td0687Image").append(image0687);
                    }
                    
                }
                else {
                    $("#placeholder").html("There was an issue calling the oyster salinity service.  Please try again.");
                }

                $("#legendPlaceholder td").css({ "font-size": "10px" });
                $("#legendPlaceholder tr").css({ "height": "10px" });
                
            }
        }
    })