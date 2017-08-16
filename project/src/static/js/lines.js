/*

Javascript code that handles all the line chart stuff front end

*/

window.onload = function(){


    //alert("Page loaded.")

    var weekday = new Date().getDay();

    var days = {
        0:"Sunday",
        1:"Monday",
        2:"Tuesday",
        3:"Wednesday",
        4:"Thursday",
        5:"Friday",
        6:"Saturday",
    }

    var syad = {
        "Sunday":0,
        "Monday":1,
        "Tuesday":2,
        "Wednesday":3,
        "Thursday":4,
        "Friday":5,
        "Saturday":6,
    }

    InitChart();

    function InitChart() {

        //THANKS STACK OVERFLOW
        Array.prototype.remove = function() {
            var what, a = arguments, L = a.length, ax;
            while (L && this.length) {
                what = a[--L];
                while ((ax = this.indexOf(what)) !== -1) {
                    this.splice(ax, 1);
                }
            }
            return this;
        };

        //Read in the JSON data from the MongoDB
        var itemDict, itemKeys, timeStamps;

        $.ajax({
          url: 'http://localhost:5000/pricenium/posts',
          async: false,
          dataType: 'json',
          success: function (json) {
            itemDict = json;
          }
        });

        $.ajax({
          url: 'http://localhost:5000/pricenium/names',
          async: false,
          dataType: 'json',
          success: function (json) {
            itemKeys = json;
          }
        });

        $.ajax({
          url: 'http://localhost:5000/pricenium/stamps',
          async: false,
          dataType: 'json',
          success: function (json) {
            timeStamps = json;
          }
        });

        //Get the keys into an array of strings
        var keyz = [];
        //Hello nestedloops my old friend
        for (a=0; a<itemKeys.length;a++){
            for (var key in itemKeys[a]) {
              if (itemKeys[a].hasOwnProperty(key)) {
                keyz.push(key);
              }
            }
        }
        //remove the bad key
        keyz.remove('_id')

        //Get the dates we've recorded on
        var times =[];
        for (b=0; b<itemKeys.length;b++){
            for (var date in timeStamps[b]){
                if (timeStamps[b].hasOwnProperty(date)){
                    times.push(date);
                }
            }
        }

        //remove the bad key that messes up the data from mongodb
        times.remove('_id')

        itemDict.remove('_id')

        //Retrieve the price based on date
        //mfw this might have been overkill

        var values = [];

        var currWeek = []

        var ultimate = [];

        var ready = false;

        //console.log(itemDict);

        //Gathers and sorts all the data kek
        for (c=0; c<itemDict.length; c++){

            var currDay = times[c];

            var indexLength = itemDict[c][currDay].length;

            for (f = 0 ; f<indexLength; f++){

                //console.log(itemDict[c][currDay][f]);
                var currItem = itemDict[c][currDay][f];

                //get that stuff updated
                currWeek.push( {
                    "item" : currItem.item,
                    "data":[{
                        "price": Number((currItem.data.price).substring(1,6)),
                        "day" : days[c],
                    }]
                });

            }

        }

        /*

        This section of the code finds same-keys and concats all the prices over the period of seven day into one price array

        */

        //console.log(currWeek);

        var found = []; //just
        var allDict = {};

        for (d=0; d<currWeek.length; d++){

            //Add everything we haven't seen yet into the found array
            if ( !allDict.hasOwnProperty(currWeek[d].item) ){

            //   console.log("Found a new a found item!");

                //Initialize the item's array
                allDict[currWeek[d].item] = [currWeek[d].data[0].price]
                //allDict[currWeek[d].item] = [currWeek[d].item];
            }
            //we've seen this somewhere before...
            else if ( allDict.hasOwnProperty(currWeek[d].item) ) {

            //   console.log( currWeek[d].data);

                //if ( currWeek[d].price != undefined){

                    allDict[currWeek[d].item].push(currWeek[d].data[0].price);
                //}
            }

            if (d==currWeek.length-1){
                //console.log("READY");
                ready = true;
            }

        }

        //console.log(allDict);

        swagDict = [];

        swagDict.push(allDict);

        //console.log(swagDict);

        /*

        Graphing properties

        */

        if (ready){

            console.log("ready");

            var margin = {top: 20, right: 80, bottom: 30, left: 50},
                width = 640 - margin.left - margin.right,
                height = 380 - margin.top - margin.bottom;

            var x = d3.scaleLinear()
                .domain([0, d3.max(currWeek, function(d) { return 6; })])
                .range([0, width]);

            var y = d3.scaleLinear()
                .domain([d3.min(swagDict, function(d,i) {

                    //console.log(d);

                    var tempvalues = [];

                    for (var key in d) {
                        //console.log("Key: " + key);
                        //console.log("Value: " + d[key]);

                        tempvalues.push(d3.min(d[key]));

                    }

                    //console.log(d3.min(tempvalues));

                    return d3.min(tempvalues);

                }),
                d3.max(swagDict, function(d,i) {

                        var tempvalues = [];

                        for (var key in d) {
                            //console.log("Key: " + key);

                            //console.log("Value: " + d[key]);

                            tempvalues.push(d3.max(d[key]));

                        }

                        //console.log(tempvalues);

                        //console.log( d3.max(tempvalues) );

                        return d3.max(tempvalues);
                })])
                .range([height, 0]);

            var color = d3.scaleOrdinal(d3.schemeCategory10)
                .domain(d3.keys(currWeek).filter(function(key) { return key === "day"; }));

            var xAxis = d3.axisBottom()
                .scale(x)
                .tickFormat(d3.format('d'))

            var yAxis = d3.axisLeft()
                .scale(y)

            //stuff for the damn tolltips
            var div = d3.select("#price-chart").append("div")
                .attr("class", "tooltip")

            var svg = d3.select("#price-chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

              svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis);

              svg.append("g")
                  .attr("class", "y axis")
                  .call(yAxis);

            //Predefine the function of the line component
            var line = d3.line()
                .x(function(d,i) {
                    //console.log(i);
                    return x(i);
                })
                .y(function(d) {
                    console.log(d);
                    return y(d);
                });

            //Iterate through swagDict and add the lines
            for (var key in swagDict[0]) {

                //Returns the array of prices
                //console.log(key);
                //console.log(swagDict[0][key]);

                svg.selectAll(".line")
                .append("path")
                .attr("class", "line")
                .attr("d", line(swagDict[0][key]) )
                .attr("stroke-width", 5)
                .attr("stroke", "red") ;


            }


            //Add the tooltips
            // add the dots with tooltips


            /*
            items.selectAll("dot")
                .data(allDict)
                .enter().append("circle")
                .attr("r", 3)
                .attr("cx", function(d) {
                    console.log( d);
                    return x( d );
                })
                .attr("cy", function(d,i) {
                    //console.log( typeof(d[i]) );
                    //return y( d.data[0].price );
                    return  ( d[Object.keys(d)[0]] );
                })
                .on("mouseover", function(d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html(( syad[d.data[0].day] ) + "<br/>" + (d.data[0].price) )
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY-100) + "px");
                })
                .on("mouseout", function(d) {
                    div.transition()
                    .duration(500)
                    .style("opacity", 0);
                });
            */


    }

}


    // Script from StackOverflow that gets the days returned
    function getDayOfWeek(date) {
        var dayOfWeek = new Date(date).getDay();
        return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
    }
}
