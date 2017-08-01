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

}
