/*

Javascript code that handles all the chart stuff for the front end

*/

window.onload = function(){

    //alert("Page loaded.")


    InitChart();

    function InitChart() {

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

        //Get the keys into an array of strings
        var keys = [];
        for (var key in itemKeys[0]) {
          if (itemKeys[0].hasOwnProperty(key)) {
            keys.push(key);
          }
        }

        //console.log(keys);
        var values = [];

        for (q = 0; q < keys.length; q++){
            values.push(itemDict[0][keys[q]]);
        }

        console.log(values[0]['price']);

        var number = values[0]['price'];
        var price = Number(number.replace(/[^0-9\.]+/g,""));

        var lineData = [{
            'x': 0,
            'y': price
            }, {
            'x': 1,
            'y': price
            }, {
            'x': 2,
            'y': price
            }, {
            'x': 3,
            'y': price
            }, {
            'x': 4,
            'y': price
            }, {
            'x': 5,
            'y': price
            }, {
            'x': 6,
            'y': price
            }
        ];

        var lineData2 = [{
            'x': 0,
            'y': price*2
            }, {
            'x': 1,
            'y': price/3
            }, {
            'x': 2,
            'y': price-10
            }, {
            'x': 3,
            'y': price
            }, {
            'x': 4,
            'y': price*1.3
            }, {
            'x': 5,
            'y': price/4
            }, {
            'x': 6,
            'y': price/5
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
}
