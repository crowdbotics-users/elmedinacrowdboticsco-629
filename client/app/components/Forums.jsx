import React from 'react';
import { Card } from 'material-ui';

var Forums = React.createClass({
  render: function() {
    return (
      <div className="row">
        <Card className="col-xs-12 col-sm-offset-2 col-sm-8 col-md-offset-2 col-md-8">
          <h1>Forums</h1>
        </Card>
      </div>
    );
  }
});

module.exports = Forums;
