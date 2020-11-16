import React from 'react';

class chart extends React.Component {
  constructor(props) {
    super(props);
    this.$svg = React.createRef();
  }

  // eslint-disable-next-line
  render() {
    return (
      <svg
        ref={this.$svg}
      ></svg>
    );
  }
}

export default chart;
