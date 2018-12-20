import React, { Component } from 'react';
import { Navbar, Grid, Panel } from 'react-bootstrap'
import { Switch, Route } from 'react-router-dom'
import Reports from './components/reports';
import DetailedReport from './components/detailed-reports'

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Navbar fluid inverse style={{ borderRadius: 0 }}>
          <Navbar.Header>
            <Navbar.Brand>
              <a href='/'>Live Ads Risk Analysis Tool</a>
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
        <Grid style={{ marginTop: 100 }}>
          <Switch>
            <Route exact path='/' 
              render={() => <Reports/>}
            />
            <Route exact path='/reports/:id'
              render={(props) => <DetailedReport id={props.match.params.id}/>}/>
          </Switch>
        </Grid>
      </div>
    );
  }
}

export default App;
