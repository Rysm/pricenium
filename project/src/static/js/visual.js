/*

Javascript code that handles all the line chart stuff front end

*/

window.onload = function(){


    //alert("Page loaded.")

    var weekday = new Date().getDay();

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
        var itemDict, itemKeys;

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

        //console.log(itemDict);
        //console.log(itemKeys);
        //console.log(timeStamps);

        //Get the keys into an array of strings
        var keyz = [];

        for (var key in itemKeys[0]) {
          if (itemKeys[0].hasOwnProperty(key)) {
            keyz.push(key);
          }
        }

        //remove the bad key
        keyz.remove('_id')

        //Get the dates we've recorded on
        var times =[];

        for (var date in timeStamps[0]){
            if (timeStamps[0].hasOwnProperty(date)){
                times.push(date);
            }
        }

//        console.log(keys.length);


//        console.log(times);
//        console.log(getDayOfWeek(times[1]));

        //Retrieve the price based on date
        var values = [];

        var priceData = [];

        var myDate = times[1];

        var innerArray = itemDict[0][myDate];

        //console.log(innerArray);

        //Iterate through all the available keys we have and then
        for (p = 0 ; p<keyz.length; p++){
            for(var i in innerArray[p]){
                //console.log(i); // alerts key
                priceData.push(innerArray[p][i]['price'].substring(0,6) ); //alerts key's value
            }
        }


        //console.log(values[0]['price']);

        //var number = values[0]['price'];
        //var price = Number(number.replace(/[^0-9\.]+/g,""));

        console.log(priceData);

        var lineData = [{
            'x': 0,
            'y': 10
            }, {
            'x': 1,
            'y': 20
            }, {
            'x': 2,
            'y': 40
            }, {
            'x': 3,
            'y': 20
            }, {
            'x': 4,
            'y': 32
            }, {
            'x': 5,
            'y': 90
            }, {
            'x': 6,
            'y': 65
            }
        ];

        var lineData2 = [{
            'x': 0,
            'y': 23
            }, {
            'x': 1,
            'y': 76
            }, {
            'x': 2,
            'y': 43
            }, {
            'x': 3,
            'y': 10
            }, {
            'x': 4,
            'y': 5
            }, {
            'x': 5,
            'y': 29
            }, {
            'x': 6,
            'y': 30
            }
        ];

        var vis = d3.select("#price-chart"),
        WIDTH = 500,
        HEIGHT = 500,
        MARGINS = {
          top: 20,
          right: 20,
          bottom: 20,
          left: 50
        },
        xRange = d3.scaleLinear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineData, function (d) {
            return d.x;
          }),
          d3.max(lineData, function (d) {
            return d.x;
          })
        ]),

        yRange = d3.scaleLinear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function (d) {
            return d.y/2;
          }),
          d3.max(lineData, function (d) {
            return d.y*2;
          })
        ]),

        xAxis = d3.axisBottom()
            .scale(xRange)
            .ticks(7)
            .tickFormat(function(e){
                if(Math.floor(e) != e)
                {
                    return;
                }

                return e;
            });


        yAxis = d3.axisLeft()

          .scale(yRange)
          .tickSize(5)


        vis.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
        .call(xAxis);

        vis.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
        .call(yAxis);

        var lineFunc = d3.line()
            .x(function (d) {
                return xRange(d.x);
            })
            .y(function (d) {
                return yRange(d.y);
            })
            .curve(d3.curveBasis);

        vis.append("svg:path")
            .attr("d", lineFunc(lineData))
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("fill", "none");

        vis.append("svg:path")
            .attr("d", lineFunc(lineData2))
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("fill", "none");

}


    // Script from StackOverflow that gets the days returned
    function getDayOfWeek(date) {
        var dayOfWeek = new Date(date).getDay();
        return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
    }
}
