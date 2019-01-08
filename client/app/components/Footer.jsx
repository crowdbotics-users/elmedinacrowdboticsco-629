import React from 'react';

var Footer = React.createClass({
  render: function() {
    return (
      <div id="footer" className="container">
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-8 col-lg-8">
            <h2>About</h2>
            <p>poljo-test-1-151 is a Full-Stack Javascript for an easy starting point with SequelizeJS, ExpressJS, PassportJS, ReactJS and NodeJS based applications.</p>
            <p>It is designed to give you a quick and organized way to start developing SERN based web apps.</p>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <h2>Info</h2>
            <p>Made with <i className="fa fa-heart" aria-hidden="true"></i> at <a href="https://crowdbotics.com" target="_blank">Crowdbotics</a></p>
          </div>
        </div>
      </div>
    );
  }
});

export default Footer;
