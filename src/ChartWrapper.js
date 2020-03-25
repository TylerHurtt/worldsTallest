import React, { Component } from 'react';
import D3Chart from './D3Chart';

export default class ChartWrapper extends Component {
  componentDidMount() {
    this.setState({
      chart: new D3Chart(this.refs.chart)
    })
  }

  // Re-render when a component changes
  // Ignores default react updates
  shouldComponentUpdate() {
    return false;
  }

  // Runs as soon as new props become available before any updates take place
  componentWillReceiveProps(nextProps) {
    this.state.chart.update(nextProps.gender)
  }
  
  // Renders D3 chart
  render() {
    return <div ref='chart'></div>;
  }
}
