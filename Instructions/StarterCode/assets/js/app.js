// @TODO: YOUR CODE HERE!
// Sources:  Bootcamp exercises
// d3js documentation
// Stack overflow 
//==============================
// Part I: svg object 
//=================================================
var svgWidth = 960;
var svgHeight = 620;

// set up borders in svg
var margin = {
  top: 20, 
  right: 40, 
  bottom: 200,
  left: 100
};

// calculate chart height and width
var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;


var chart = d3.select("#scatter")
  .append("div")
  .classed("chart", true);
// 2. Create an SVG wrapper, append an SVG group that will hold our chart
var svg = chart.append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);


var chartGroup = svg.append('g')
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
//=======================================================================================================================
// Part II: Initial Parameters:
//========================================================================================================================
//1- Ininital X & Y Axis:
//--------------------------
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

//a function for updating the x-scale variable upon click of label
function xScale(stateData, chosenXAxis) {
    //scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
        d3.max(stateData, d => d[chosenXAxis]) * 1.2])
      .range([0, width]);

    return xLinearScale;
}
//a function for updating y-scale variable upon click of label
function yScale(stateData, chosenYAxis) {
  //scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8,
      d3.max(stateData, d => d[chosenYAxis]) * 1.2])
    .range([height, 0]);

  return yLinearScale;
}
//function used for updating xAxis var upon click on axis label
//-------------------------------------------------------------
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
//--------------------------------------------------------------
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to new circles
//------------------------------------------------------------------------------- 
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr('cx', data => newXScale(data[chosenXAxis]))
      .attr('cy', data => newYScale(data[chosenYAxis]))

    return circlesGroup;
}

// function used for updating circles group with new tooltip
//=============================================================
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  //poverty
  //========
  if (chosenXAxis === "poverty") {
    var xLabel = "In Poverty: ";
  }
  //Income
  //---------
  else if (chosenXAxis === "income"){
    var xLabel = "Household Income (Median): $";
  }
  //Age
  //-----
  else {
    var xLabel = "Age:";
  }

// update ylabel 
//------------------------------------------
//healthcare
//==================
if (chosenYAxis === "healthcare") {
  var yLabel = "Lacks Healthcare:"
}
else if(chosenYAxis === "obesity") {
  var yLabel = "Obese:";
}
//smoking
//=============
else{
  var yLabel = "Smokes:";
}

//create tooltip
//==========================================
var toolTip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-8, 0])
  .html(function(d) {
      return (`${d.state}<br>${xLabel} ${styleX(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}%`);
});

circlesGroup.call(toolTip);

//add
circlesGroup.on('mouseover', toolTip.show)
  .on('mouseout', toolTip.hide);

  return circlesGroup;
}
//function for text  labels
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
      .duration(1000)
      .attr('x', d => newXScale(d[chosenXAxis]))
      .attr('y', d => newYScale(d[chosenYAxis]));

    return textGroup
}
//function to stylize x-axis values for tooltips
function styleX(value, chosenXAxis) {

    //style based on variable
    //poverty
    if (chosenXAxis === 'poverty') {
        return `${value}%`;
    }
    //household income
    else if (chosenXAxis === 'income') {
        return `${value}`;
    }
    else {
      return `${value}`;
    }
}


// Part III : Data
//================================================================================================================================

// 1. import and parse data
//========================================================================================================================
d3.csv("assets/data/data.csv").then(function(stateData) {

    console.log(stateData);
    
    //Parse data
    //----------------------
    stateData.forEach(function(data){
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;        
    });

    // 2. Create X & Y Scale 
    //----------------------
    var xLinearScale = xScale(stateData, chosenXAxis);
    var yLinearScale = yScale(stateData, chosenYAxis);

    //3. Bottom & Left Axes ==> Append X& y to SVG
    //----------------------------------------------
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //---------------------------------------
    var xAxis = chartGroup.append('g')
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    var yAxis = chartGroup.append('g')
      .classed("y-axis", true)
      .call(leftAxis);
    
    //4. Append Circles
    //------------------------------------------------------------------
    var circlesGroup = chartGroup.selectAll("circle")
      .data(stateData)
      .enter()
      .append("circle")
      .classed("stateCircle", true)
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 14)
      .attr("fill", "blue")
      .attr("opacity", ".75");

    //5. Append Initial Text
    //---------------------------------------------------------------
    var textGroup = chartGroup.selectAll('.stateText')
      .data(stateData)
      .enter()
      .append('text')
      .classed('stateText', true)
      .attr('x', d => xLinearScale(d[chosenXAxis]))
      .attr('y', d => yLinearScale(d[chosenYAxis]))
      .attr('dy', 3)
      .attr('font-size', '10px')
      .text(function(d){return d.abbr});

    //========================================================================================================================
    // Part IV: LabelGroup and update label & Text:
    //=====================================================

    //1. xLabels group :
    //--------------------------------------
    var xLabelsGroup = chartGroup.append('g')
      .attr('transform', `translate(${width / 2}, ${height + 10 + margin.top})`);

    var povertyLabel = xLabelsGroup.append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 20)
      .attr('value', 'poverty')
      .text('In Poverty (%)');
      
    var ageLabel = xLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 40)
      .attr('value', 'age')
      .text('Age (Median)');  

    var incomeLabel = xLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 60)
      .attr('value', 'income')
      .text('Household Income (Median)')

    //2.  yLabels groups
    //========================================
    var yLabelsGroup = chartGroup.append('g')
      .attr('transform', `translate(${0 - margin.left/4}, ${height/2})`);

    var healthcareLabel = yLabelsGroup.append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 0 - 20)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr("value", "healthcare")
      .text("Lacks Healthcare (%)");
    
    var smokesLabel = yLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 0 - 40)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'smokes')
      .text('Smokes (%)');
    
    var obesityLabel = yLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 0 - 60)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'obesity')
      .text('Obese (%)');
    
    //update the toolTip
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    //x axis event listener
    //==============================================================
    xLabelsGroup.selectAll('text')
      .on('click', function() {
        var value = d3.select(this).attr('value');

        if (value != chosenXAxis) {

          //replace chosen x with a value
          chosenXAxis = value; 

          //update x for new data
          xLinearScale = xScale(stateData, chosenXAxis);

          //update x 
          xAxis = renderXAxis(xLinearScale, xAxis);

          //upate circles with a new x value
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

          //update text 
          textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

          //update tooltip
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          //change of classes changes text
          if (chosenXAxis === 'poverty') {
            povertyLabel
            .classed('active', true)
            .classed('inactive', false);
            ageLabel
            .classed('active', false)
            .classed('inactive', true);
            incomeLabel
            .classed('active', false)
            .classed('inactive', true);
          }
          else if (chosenXAxis === 'age') {
            povertyLabel
            .classed('active', false)
            .classed('inactive', true);
            ageLabel
            .classed('active', true)
            .classed('inactive', false);
            incomeLabel
            .classed('active', false)
            .classed('inactive', true);
          }
          else {
            povertyLabel
            .classed('active', false)
            .classed('inactive', true);
            ageLabel
            .classed('active', false)
            .classed('inactive', true);
            incomeLabel
            .classed('active', true)
            .classed('inactive', false);
          }
        }
      });
    //y axis lables event listener
    //===============================================
    yLabelsGroup.selectAll('text')
      .on('click', function() {
        var value = d3.select(this).attr('value');

        if(value !=chosenYAxis) {
            //replace chosenY with value  
            chosenYAxis = value;

            //update Y scale
            yLinearScale = yScale(stateData, chosenYAxis);

            //update Y axis 
            yAxis = renderYAxis(yLinearScale, yAxis);

            //update circles with new y
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            //update TEXT with new Y values
            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            //update tooltips
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            //Change of the classes changes text
            //============================================
            if (chosenYAxis === 'obesity') {
              obesityLabel
              .classed('active', true)
              .classed('inactive', false);
              smokesLabel
              .classed('active', false)
              .classed('inactive', true);
              healthcareLabel
              .classed('active', false)
              .classed('inactive', true);
            }
            else if (chosenYAxis === "smokes") {
              obesityLabel
              .classed("active", false)
              .classed("inactive", true);
              smokesLabel
              .classed("active", true)
              .classed("inactive", false);
              healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            }
            else {
              obesityLabel
              .classed("active", false)
              .classed("inactive", true);
              smokesLabel
              .classed("active", false)
              .classed("inactive", true);
              healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
            }
          }
        });
});