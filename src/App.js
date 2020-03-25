import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import ChartWrapper from './ChartWrapper';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GenderDropdown from './GenderDropdown';

class App extends Component {
  state = {
    gender: 'men'
  };

  genderSelected = gender => this.setState({ gender });

  render() {
    return (
      <div className='App'>
        <Navbar bg='light'>
          <Navbar.Brand>World's Tallest Humans</Navbar.Brand>
        </Navbar>
        <Container>
          <Row>
            {/* xs means both col will take up 100% because there are 12 col per row */}
            <Col xs={12}>
              <GenderDropdown genderSelected={this.genderSelected} />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              {' '}
              <ChartWrapper gender={this.state.gender} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
