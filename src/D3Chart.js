import * as d3 from 'd3';

const tallMenUrl = 'https://udemy-react-d3.firebaseio.com/tallest_men.json';
const tallWomenUrl = 'https://udemy-react-d3.firebaseio.com/tallest_women.json';

const MARGIN = { TOP: 10, BOTTOM: 50, LEFT: 70, RIGHT: 10 };
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

export default class D3Chart {
  constructor(element) {
    const vis = this;

    vis.svg = d3
      .select(element)
      .append('svg')
      .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
      .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
      .append('g')
      .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

    //Adding x-axis label
    vis.xLabel = vis.svg
      .append('text')
      .attr('x', WIDTH / 2)
      .attr('y', HEIGHT + 50)
      .attr('text-anchor', 'middle');

    //Adding y-axis label
    vis.svg
      .append('text')
      .attr('x', -(HEIGHT / 2))
      .attr('y', -50)
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('Height in cm');

    //Axis Groups
    vis.xAxisGroup = vis.svg
      .append('g')
      .attr('transform', `translate(0, ${HEIGHT})`);

    vis.yAxisGroup = vis.svg.append('g');

    //Data loader
    Promise.all([
      d3.json(tallMenUrl), 
      d3.json(tallWomenUrl)
    ]).then(datasets => {
      vis.menData = datasets[0];
      vis.womenData = datasets[1];
      vis.update('men');
    });
  }

  update(gender) {
    const vis = this;

    vis.data = (gender === 'men') ? vis.menData : vis.womenData;
    vis.xLabel.text(`The Worlds's tallest ${gender}`);

    //Scales
    const y = d3
      .scaleLinear()
      .domain([
        d3.min(vis.data, d => d.height) * 0.95,
        d3.max(vis.data, d => d.height)
      ])
      .range([HEIGHT, 0]);

    const x = d3
      .scaleBand()
      .domain(vis.data.map(d => d.name))
      .range([0, WIDTH])
      .padding(0.4);

    //Updates axis
    const xAxisCall = d3.axisBottom(x);
    vis.xAxisGroup
      .transition()
      .duration(500)
      .call(xAxisCall);

    const yAxisCall = d3.axisLeft(y);
    vis.yAxisGroup
      .transition()
      .duration(500)
      .call(yAxisCall);

    // Data Join
    // Join new data with old elements, if any.
    const rects = vis.svg.selectAll('rect').data(vis.data);

    // Exit
    // removes elements that still exist on the screen but don't exist in the data
    rects
      .exit()
      .transition()
      .duration(500)
      .attr('height', 0)
      .attr('y', HEIGHT)
      .remove();

    // Update
    // Updates the elements that are left in the data and teh screen
    rects
      .transition()
      .duration(500)
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.height))
      .attr('width', x.bandwidth)
      .attr('height', d => HEIGHT - y(d.height));

    // Enter
    // Create new elements for anything that exists in the data but doesnt exist on the screen
    rects
      .enter()
      .append('rect')
      .attr('x', d => x(d.name))
      .attr('width', x.bandwidth)
      .attr('fill', 'grey')
      .attr('y', HEIGHT)
      .transition()
      .duration(500)
      .attr('y', d => y(d.height))
      .attr('height', d => HEIGHT - y(d.height));

    console.log(rects);
  }
}
