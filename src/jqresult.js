
var createCORSRequest = function(method, url) {
	var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr) {
		// Most browsers.
		xhr.open(method, url, true);
	} else if (typeof XDomainRequest != "undefined") {
		// IE8 & IE9
		xhr = new XDomainRequest();
		xhr.open(method, url);
	} else {
		// CORS not supported.
		xhr = null;
	}
	return xhr;
};

var loadXMLDoc = function(autoRefresh){
	alert('test');
	var width = 600,
    	barHeight = 50,
		padding = 60;
	
	var url = 'data.json';
	var method = 'GET';
	var xhr = createCORSRequest(method, url);

	xhr.onload = function(req) {	  
		  var data = JSON.parse(this.responseText).Items;
		  
		  data = data.sort((a,b) => b.tally - a.tally);
		  
		  var x = d3.scaleLinear()
		      .domain([0, d3.max(data, function(d) { return d.tally + padding; })])
		      .range([0, width]);
		  
		  var chart = d3.select(".chart")
		      .attr("width", width)
		      .attr("height", barHeight * data.length);
			  
		  chart.selectAll("*").remove()

		  var bar = chart.selectAll("g")
		      .data(data)
		    .enter().append("g")
		      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
		  
		  bar.append("rect")
		      .attr("width",  function(d) { return x(d.tally) + padding; })
		      .attr("height", barHeight - 1);

		  bar.append("text")
		      .attr("x", function(d) { return x(d.tally) + padding - 3; })
		      .attr("y", barHeight / 2)
		      .attr("dy", ".35em")
		      .text(function(d) { return d.singername + ': ' + d.tally; });
		  
	};

	xhr.onerror = function() {
	  // Error code goes here.
	};

  	xhr.send();
	
	//AutoRefresh
	if(autoRefresh){
		window.setTimeout(loadXMLDoc, 3000, true);
	}
}

function type(d) {
  d.votes = +d.votes; // coerce to number
  return d;
}

loadXMLDoc(true);