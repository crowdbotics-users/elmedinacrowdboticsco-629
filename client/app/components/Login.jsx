import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router';
import queryString from 'query-string';
import Store from '../reducers/store.js';
import { Card, CardTitle, CardText, RaisedButton, TextField } from 'material-ui';

class Login extends React.Component {
  constructor(props) {
    super(props);

    const values = queryString.parse(this.props.location.search);

    this.state = {
      isSubmitting: false,
      error: values.err ? [values.err] : [],
      message: values.msg ? values.msg : ""
    };

    this.submit = this.submit.bind(this);
  }

  submit(e) {
    e.preventDefault();
    
    this.setState({
      isSubmitting: true
    });

    $.post("api/user/login", $("#login-form").serialize())
      .done((data) => {
        console.log(data);
        Store.dispatch({
          type: "USER_SESSION",
          user: data,
          snack: "Welcome back! We missed you :)"
        });
      })
      .fail((error) => {
        this.setState({
          isSubmitting: false,
          error: error.responseJSON
        });
      });
  }

  render() {
    let errors = !this.state.error ? [] : this.state.error;

    if (!Array.isArray(errors))
      errors = [errors];

    return (
      <div className="row">
        <Card className="col-xs-12 col-sm-offset-2 col-sm-8 col-md-offset-3 col-md-6">
          <form id="login-form" className="text-center" onSubmit={this.submit}>
            <CardTitle title="Login with Email" />

            <CardText className={!this.state.message ? "hidden" : "info"}>{this.state.message}</CardText>

            <div className="field-line">
              <TextField ref="email" floatingLabelText="Email" name="email" />
            </div>

            <div className="field-line">
              <TextField ref="password" floatingLabelText="Password" type="password" name="password" />
            </div>

            <div className="field-line">
              <ul className="errors">
                {errors.map((e, i) => <li key={i}>{e.message}</li>)}
              </ul>
            </div>

            <div className="button-line">
              <RaisedButton type="submit" label="Log in" primary={true} />
            </div>

            <CardText>Don't have an account? <Link to={`/signup`}>Create one</Link></CardText>
          </form>
        </Card>
      </div>
    );
  }
}

module.exports = Login;
