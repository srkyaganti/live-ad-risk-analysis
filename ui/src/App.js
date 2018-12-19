import React, { Component } from 'react';
import { Navbar, Grid, Panel } from 'react-bootstrap'

class App extends Component {
  render() {
    return (
      <div>
        <Navbar fluid inverse style={{ borderRadius: 0 }}>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="">Live Ads Risk Analysis Tool</a>
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
        <Grid style={{ marginTop: 100 }}>
          <Panel>
            <Panel.Heading>
              <Panel.Title componentClass="h3">Panel heading with a title</Panel.Title>
            </Panel.Heading>
            <Panel.Body>Panel content</Panel.Body>
          </Panel>
        </Grid>
      </div>
    );
  }
}

export default App;
