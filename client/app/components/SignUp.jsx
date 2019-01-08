import React from 'react';
import $ from 'jquery';
import { Link, browserHistory } from 'react-router';
import { Card, CardTitle, CardText, RaisedButton, TextField } from 'material-ui';
import Store from '../reducers/store.js';
import PasswordStrength from './widgets/PasswordStrength.jsx';

class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        fullname: '',
        email: '',
        password: ''  
      },
      isValid: {
        password: false
      },
      showError: false,
      isSubmitting: false,
      error: []
    };

    this.changePassword = this.changePassword.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  changePassword(password, isValid) {
    let obj = this.state;

    obj.formData.password = password;
    obj.isValid.password = isValid;

    this.setState(obj);
  }

  handleChange(event) {
    const {target: { name, value }} = event;
    
    let obj = this.state.formData || {};
    obj[name] = value;

    this.setState({
      formData: obj
    });
  }

  submit(e) {
    e.preventDefault();

    if (!this.state.isValid.password) {
      this.setState({
        showError: true
      });

      return;
    }

    this.setState({
      isSubmitting: true
    });
    
    $.post("api/user/signup", this.state.formData)
      .done((data) => {
        console.log(data);
        browserHistory.push('/login');
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
          <form id="signup-form" className="text-center" action="/" onSubmit={this.submit}>
            <CardTitle title="Sign Up with Email" />
            <CardText>The password must have at least 1 lowercase, 1 uppercase, 1 number, 1 special character and be at least 8 characters.</CardText>

            <div className="field-line">
              <TextField ref="fullname" floatingLabelText="Fullname" name="fullname" value={this.state.formData.fullname} onChange={this.handleChange.bind(this)} required={true}/>
            </div>

            <div className="field-line">
              <TextField ref="email" floatingLabelText="Email" name="email" value={this.state.formData.email} onChange={this.handleChange.bind(this)} required={true}/>
            </div>

            <div className="field-line">
              <PasswordStrength onChange={this.changePassword.bind(this)} showError={this.state.showError}/>
            </div>

            <div className="field-line">
              <ul className="errors">
                {errors.map((e, i) => <li key={i}>{e.message}</li>)}
              </ul>
            </div>

            <div className="button-line">
              <RaisedButton type="submit" label="Create New Account" primary={true} disabled={this.state.isSubmitting} />
            </div>

            <CardText>Already have an account? <Link to={'/login'}>Log in</Link></CardText>
          </form>
        </Card>
      </div>
    );
  }
}

module.exports = SignUp;
