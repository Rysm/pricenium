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

        //console.log(keyz);

        //Get the dates we've recorded on
        var times =[];
        for (b=0; b<itemKeys.length;b++){
            for (var date in timeStamps[b]){
                if (timeStamps[b].hasOwnProperty(date)){
                    times.push(date);
                }
            }
        }

        //remove the bad key
        times.remove('_id')

        //console.log(keys.length);

        //console.log(times);

        //Retrieve the price based on date
        //mfw this might have been overkill

        var values = [];

        var currWeek = []

        var ultimate = [];

        var ready = false;

        for (c=0; c<times.length; c++){

            var priceData = [];

            //returns the index od the day we have
            var weekday = days[ getDayOfWeek(times[c])];

            var myDate = times[c];
            var innerArray = itemDict[c][myDate];

            //Iterate through all the available keys we have and then
            for (p = 0 ; p<keyz.length; p++){
                for(var i in innerArray[p]){
                    //console.log(i); // alerts key
                    priceData.push( (c+1)*(parseFloat( innerArray[p][i]['price'].substring(1,6) )) ); //alerts key's value
                }
            }

            currWeek.push( {
                "day" : days[c],
                "prices": priceData
            });

            if (c==times.length-1){
                ready = true;
            }

        }

        if (ready){

            //console.log(priceData);
            console.log(currWeek);

            var data = [
                {name: 'John', values: [0,1,3,9, 8, 7]},
                {name: 'Harry', values: [0, 10, 7, 1, 1, 11]},
                {name: 'Steve', values: [3, 1, 4, 4, 4, 17]},
                {name: 'Adam', values: [4, 77, 2, 13, 11, 13]}
            ];


            var margin = {top: 20, right: 80, bottom: 30, left: 50},
                width = 640 - margin.left - margin.right,
                height = 380 - margin.top - margin.bottom;


            var x = d3.scaleLinear()
                .domain([0, d3.max(currWeek, function(d) { return 6; })])
                .range([0, width]);

            var y = d3.scaleLinear()
                .domain([d3.min(currWeek, function(d) { return d3.min(d.prices); }),
                         d3.max(currWeek, function(d) { return d3.max(d.prices); })])
                .range([height, 0]);

            var color = d3.scaleOrdinal(d3.schemeCategory10)
                .domain(d3.keys(currWeek).filter(function(key) { return key === "day"; }));

            var xAxis = d3.axisBottom()
                .scale(x)
                .tickFormat(d3.format('d'))

            var yAxis = d3.axisLeft()
                .scale(y)

            var line = d3.line()
                .curve(d3.curveBasis)
                .x(function(d, i) { return x(i); })
                .y(function(d, i) { return y(d); });

            //stuff for the damn tolltips
            var div = d3.select("#price-chart").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

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

              var items = svg.selectAll(".items")
                  .data(currWeek)
                  .enter().append("g")
                  .attr("class", "items");

             //Draw the lines
              items.append("path")
                  .attr("class", "line")
                  .attr("d", function(d) {
                    //console.log("d.prices bois" +  d.prices  );
                    return line(d.prices);
                  })
                  .style("stroke", function(d) { return color(d.day); })
                  .style("fill", "none");

            //Add the tooltips
            // add the dots with tooltips
            items.selectAll("dot")
            .data(currWeek)
            .enter().append("circle")
            .attr("r", 3)
            .attr("cx", function(d) {
                //console.log( typeof(syad[d.day]) );
                return x(syad[d.day]);
            })
            .attr("cy", function(d) {
                return y(d.prices[0]);
            })
            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html((d.day) + "<br/>" + d.prices)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                .duration(500)
                .style("opacity", 0);
            });
        }

}


    // Script from StackOverflow that gets the days returned
    function getDayOfWeek(date) {
        var dayOfWeek = new Date(date).getDay();
        return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
    }
}
