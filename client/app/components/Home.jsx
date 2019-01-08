import React from 'react';
import { Card, CardText } from 'material-ui';
import { Link } from 'react-router';

var Home = React.createClass({
  render: function() {
    return (
      <div>
        <div className="row">
          <Card id="home" className="col-xs-12 col-sm-offset-2 col-sm-8 col-md-offset-2 col-md-8">
            <h1 className="text-center">Welcome to poljo-test-1-151!</h1>
            <CardText>Already have an account? <Link to={'/login'}>Log in</Link></CardText>
            <CardText>Don't have an account? <Link to={`/signup`}>Create one</Link></CardText>
          </Card>
        </div>
      </div>
    );
  }
});

module.exports = Home;
