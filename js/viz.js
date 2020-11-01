const color={
    paper:["#1b9e77", "#d95f02", "#7570b3"]
}

//Paper Select
const select_ids=["paper_select1","paper_select2","paper_select3"];
d3.json('/Citation_Analysis_Code/data/info.txt').then(function (data){

    const papers = Object.keys(data);
    const csvs = Object.values(data);
    for (let i=0;i<select_ids.length;i++) {
        const paperSelect = document.getElementById(select_ids[i]);
        paperSelect.style.color=color.paper[i];
        for (let j = 0; j < papers.length; j++) {
            let opt = document.createElement("option");
            opt.value = csvs[j];
            opt.innerHTML = papers[j];
            opt.style.color = color.paper[i];
            paperSelect.appendChild(opt);
        }
    }
});

//paperSelect.onchange = function() {myFunc()}


//Top Axis
const ta_svg =d3.select('#top_axis');

//Top Axis dimensions
const ta_width=+ta_svg.attr('width');
const ta_height=+ta_svg.attr('height');

//Top Axis margins
const ta_margin = {top :10, bottom:10, left:50, right:10};
const ta_inner_height=ta_height-ta_margin.top-ta_margin.bottom;
const ta_inner_width=ta_width-ta_margin.right-ta_margin.left;

//Defining the categories
const categories_str='CATEGORIES'
const cat= ['Background', 'Idea', 'Basis', 'Comparison']

//    Calculating the maximum length of the name of the categories
const n_cat=cat.length;
const n_cat_ttl=Math.pow(2,n_cat);
let max_length=0;

for(let i=0;i<n_cat;i++){
    if(cat[i].length>max_length)
        max_length=cat[i].length;
}

//Top axis Scale

const ta_xscale=d3.scaleLinear()
    .domain([0, n_cat])
    .range([0, ta_inner_width]);

const ta_yscale=d3.scaleLinear()
    .domain([0, max_length-1])
    .range([0, ta_inner_height]);

//Top axis Data
const ta =ta_svg.append('g')
    .attr('transform',`translate(${ta_margin.left},${ta_margin.top})`);

//    Writing the name of categories vertically
for(let i=0;i<n_cat;i++){
    for(let j=0;j<cat[i].length;j++)
        ta.append('text')
            .attr('x', ta_xscale(i))
            .attr('y', ta_yscale(j+max_length-cat[i].length))
            .text(cat[i].charAt(j))
            .style('font-size',15)
            .style('fill','#3e3c5c');
}

const render = data => {

    //Getting min and max year
    let minYear=2021;
    let maxYear=0;
    for(let i=0;i<data.length;i++){
        if(data[i]!="") {
            data[i].forEach(d => {
                d.Year = +d.Year;
                d.Cat = +d.Cat;
            });
            const currMin = d3.min(data[i], d => d.Year);
            const currMax = d3.max(data[i], d => d.Year);
            if(currMin<minYear)
                minYear=currMin
            if(currMax>maxYear)
                maxYear=currMax
        }
    }

    //Right Axis
    const ra_svg = d3.select('#right_axis');

    //Right Axis dimensions
    const ra_width = +ra_svg.attr('width');
    const ra_height = +ra_svg.attr('height');

    //Right Axis margin
    const ra_margin = {top: 0, bottom: 25, left: 20, right: 20};
    const ra_inner_height = ra_height - ra_margin.top - ra_margin.bottom;
    const ra_inner_width = ra_width - ra_margin.right - ra_margin.left;

    //Right Axis Scales
    const ra_xScale = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([0, ra_inner_width]);

    const ra_yScale = d3.scaleLinear()
        .domain([0, 15])
        .range([0, ra_inner_height]);

    //Right Axis Data
    const ra =ra_svg.append('g')
        .attr('transform',`translate(${ra_margin.left},${ra_margin.top})`);

    //Horizontal Grid
    for (let i=0;i<n_cat_ttl;i++) {

        ra.append('line')
            .attr('x1', 0)
            .attr('y1', ra_yScale(i))
            .attr('x2', ra_inner_width)
            .attr('y2', ra_yScale(i))
            .style('stroke', 'black');

    }

    //Vertical Grid
    for (let i=minYear;i<=maxYear;i++) {

        ra.append('line')
            .attr('x1', ra_xScale(i))
            .attr('y1', 0)
            .attr('x2', ra_xScale(i))
            .attr('y2', ra_inner_height)
            .style('stroke', 'black');

    }

    //X axis
    ra.append('g').call(d3.axisBottom(ra_xScale)
        .tickFormat(d3.format("d"))
        .ticks(21))
        .attr('transform',`translate(0,${ra_inner_height})`)
        .style('stroke', 'black')
        .style('stroke-width', '0.5px');
}

document.getElementById("paperSelectBtn").addEventListener("click", function(){

    let papers=[]
    for (let i=0;i<select_ids.length;i++) {
        const paperSelect = document.getElementById(select_ids[i]);
        papers.push(paperSelect.value);
    }

    let promises = [];
    for (let i=0;i<papers.length;i++) {
        if(papers[i]=="")
            promises.push("")
        else
            promises.push(d3.csv("/Citation_Analysis_Code/data/" + papers[i]))
    }

    Promise.all(promises).then(function(data) {
        render(data);
            });
    /*d3.csv(paperSelect.value).then(function (data) {
        data.forEach(d => {
            d.Year_X = +d.Year_X;
            d.Cat_Y = +d.Cat_Y;
            d.Offset_X = +d.Offset_X;
            d.Offset_Y = +d.Offset_Y;
        });
        render(data);
    });*/
});

//Left Axis
/*const la_svg =d3.select('#left_axis');

//left Axis dimensions
const la_width=+la_svg.attr('width');
const la_height=+la_svg.attr('height');

//left Axis margins
const la_margin = {top :20, bottom:20, left:50, right:10};
const la_inner_height=la_height-la_margin.top-la_margin.bottom;
const la_inner_width=la_width-la_margin.right-la_margin.left;

//Left axis Left

const la_left_margin = {top :50, bottom:20, left:10, right:10};
const la_left_height=la_height-la_left_margin.top-la_left_margin.bottom;

const la_left_yscale=d3.scaleLinear()
    .domain([0, categories_str.length])
    .range([0, la_left_height]);

//Left axis Right
const la_right_margin = {top :20, bottom:40, left:20, right:20};
const la_right_height=la_height-la_right_margin.top-la_right_margin.bottom;

const la_right_xscale=la_top_xscale;
const la_right_yscale=d3.scaleLinear()
    .domain([1, n_cat_ttl-1])
    .range([0, la_right_height]);*/

// Writing the axis contents

//Left Axis Left
/*
const la_left =lab_svg.append('g')
    .attr('transform',`translate(${la_left_margin.left},${la_left_margin.top})`);

//Writing the word "CATEGORIES" in vertical manner
for(let i=0;i<categories_str.length;i++)
    la_left.append('text')
        .attr('x', 0)
        .attr('y', la_left_yscale(i))
        .text(categories_str.charAt(i))
        .style('font-size',20)
        .style('fill', '#3e3c5c');

//Left Axis Bottom

const la_bottom =lab_svg.append('g')
    .attr('transform',`translate(${la_bottom_margin.left},${la_bottom_margin.top})`);

const white_circle_radii_x=(la_bottom_xscale(1)-la_bottom_xscale(0))/3;
const white_circle_radii_y=(la_bottom_yscale(1)-la_bottom_yscale(0))/3;
const white_circle_radii=white_circle_radii_x<white_circle_radii_y?white_circle_radii_x:white_circle_radii_y;

//Drawing the circles
for (let i=1;i<n_cat_ttl;i++) {
    const cat_bin = i.toString(2).padStart(n_cat, '0');
    for(let j=0;j<n_cat;j++) {

        la_bottom.append('circle')
            .attr('cx', la_bottom_xscale(j))
            .attr('cy', la_bottom_yscale(i))
            .attr('r', white_circle_radii)
            .style('fill','#1b9e77')
            .style('stroke','#3e3c5c')
            .style('strokeWidth',2);
        if(cat_bin.charAt(j)=='1')
            la_bottom.append('circle')
                .attr('cx', la_bottom_xscale(j))
                .attr('cy', la_bottom_yscale(i))
                .attr('r', white_circle_radii/2)
                .style('fill','#3e3c5c');
    }
}

const ra =ra_svg.append('g')
    .attr('transform',`translate(${ra_margin.left},${ra_margin.top})`);

const render = data =>{

    const ra_xScale=d3.scaleLinear()
        .domain([d3.min(data,d=>d.Year_X), d3.max(data,d=>d.Year_X)+1])
        .range([0, ra_inner_width]);
    const year_width=ra_xScale(d3.min(data,d=>d.Year_X)+1)-ra_xScale(d3.min(data,d=>d.Year_X));

    const box_width_x=year_width/5;
    const box_width_y=2*white_circle_radii/3;
    const box_width=box_width_x<box_width_y?box_width_x:box_width_y;

    //Horizontal Grid
    for (let i=1;i<n_cat_ttl;i++) {

        ra.append('line')
            .attr('x1', -10)
            .attr('y1', ra_yscale(i))
            .attr('x2', ra_inner_width)
            .attr('y2', ra_yscale(i))
            .style('stroke', '#1b9e77');

    }

    //Vertical Grid
    for (let i=d3.min(data,d=>d.Year_X);i<=d3.max(data,d=>d.Year_X);i++) {

        ra.append('line')
            .attr('x1', ra_xScale(i))
            .attr('y1', -10)
            .attr('x2', ra_xScale(i))
            .attr('y2', ra_inner_height+ra_margin.bottom/3)
            .style('stroke', '#1b9e77');

    }

    ra.append('g').call(d3.axisBottom(ra_xScale)
        .tickFormat(d3.format("d"))
        .ticks(21))
        .attr('transform',`translate(0,${ra_inner_height+ra_margin.bottom/2})`)
        .style('stroke', '#1b9e77')
        .style('stroke-width', '0.5px');

    const box=ra.selectAll('rect').data(data)
        .enter().append('g');

    box.append('rect')
        .attr('x', d=>ra_xScale(d.Year_X)+d.Offset_X*box_width)
        .attr('y', d=>la_bottom_yscale(d.Cat_Y)+(d.Offset_Y-0.5)*box_width)
        .attr('width',box_width)
        .attr('height',box_width)
        .style('stroke','white')
        .style('fill','3e3c5c');



};
*/