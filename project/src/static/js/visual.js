/*

Javascript code that handles all the chart stuff for the front end

*/

queue()
	.defer( d3.json, "/pricenium/posts"  )
	//.defer( d3.json, "../../json/data.json" )
	.await(makeGraphs);

//The main graph making function
function makeGraphs(error, projectJSON){

	var dbData = projectJSON;

	console.log(dbData);

	var timeChart = dc.barChart("#time-chart");

	timeChart
	    .width(600)
	    .height(160)
	    .margins({top: 10, right: 50, bottom: 30, left: 50})
	    .dimension(dateDim)
	    .group(numProjectsByDate)
	    .transitionDuration(500)
	    .x(d3.time.scale().domain([minDate, maxDate]))
	    .elasticY(true)
	    .xAxisLabel("Days")
	    .yAxis().ticks(4);


	dc.renderAll();
}
