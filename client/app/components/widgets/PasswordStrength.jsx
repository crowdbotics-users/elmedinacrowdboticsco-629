import React from 'react';
import { TextField } from 'material-ui';

//rules list component
class RulesList extends React.Component {
  render() {
    return (
      <ul>
        <li className={this.props.hasNumber}>
          At least one number (0-9)
        </li>
        <li className={this.props.hasLowercaseLetter}>
          At least one letter (a-z)
        </li>
        <li className={this.props.hasUppercaseLetter}>
          At least one letter (A-Z)
        </li>
        <li className={this.props.isValidLength}>
          At least 8 characters
        </li>
        <li className={this.props.hasSpecialCharacter}>
          At least one special character
        </li>
      </ul>
    )
  }
}
//rules meter component
class RulesMeter extends React.Component {
  render() {
    return (
      <div>
        {/*<span>{this.props.title}</span>*/}
        <div className="meter-wrapper">
          <div className={this.props.className} style={{width: this.props.meterWidth + '%'}}></div>
        </div>
      </div>
    )
  }
}
//the main password widget
class PasswordStrength extends React.Component {
  constructor() {
    super();
    this.state = {
      type: 'password',
      checked: false,
      meterTitle: 'Invalid',
      meterClass: 'danger',
      meterWidth: 0,
      value: '',
      rules: {
        isValidLength: false,
        hasNumber: false,
        hasLowercaseLetter: false,
        hasUppercaseLetter: false,
        hasSpecialCharacter: false
      }
    };
  }

  onPasswordChange(e) {
    this.setState({
      value: e.target.value,
      rules: {
        hasNumber: e.target.value.match(/\d/) ? true : false,
        hasLowercaseLetter: e.target.value.match(/[a-z]/) ? true : false,
        hasUppercaseLetter: e.target.value.match(/[A-Z]/) ? true : false,
        isValidLength: e.target.value.match(/^.{8,}$/) ? true : false,
        hasSpecialCharacter: e.target.value.match(/[!@#\$%\^&\?]/) ? true : false
      }
    }, function() {
      this.setMeterAttributes(this.state.rules);

      this.props.onChange(this.state.value, this.getMeterWidth(this.state.rules) === 100);
    });
  }

  setMeterAttributes(rules) {
    var meterWidth = this.getMeterWidth(rules);
    this.setState({
      meterWidth: this.state.value ? meterWidth : 0,
      meterTitle: (100 === meterWidth ? "Valid Password" : "Invalid Password"),
      meterClass: (100 > meterWidth && this.state.value ? "danger" : "hidden")
    });
  }


  getMeterWidth (rules) {
    var property_count = 0, valid_property_count = 0, property;
    for (property in rules) {
      if (rules.hasOwnProperty(property)) {
        property_count = property_count + 1;
        if (rules[property]) {
          valid_property_count = valid_property_count + 1;
        }
      }
    }
    return (valid_property_count / property_count) * 100;
  }

  getSingleRuleStatus(status) {
    if (status) {
      return "valid";
    }

    return "invalid";
  }

  render() {
    return (
      <div className="password-strength-widget">
        <TextField ref="password" floatingLabelText="Password" type={this.state.type} name="password" onChange={this.onPasswordChange.bind(this)} required={true}/>
        <RulesMeter title={this.state.meterTitle} className={this.state.meterClass} meterWidth={this.state.meterWidth}/>
        {
          this.props.showError ? (
            <RulesList
              isValidLength={this.getSingleRuleStatus(this.state.rules.isValidLength)}
              hasNumber={this.getSingleRuleStatus(this.state.rules.hasNumber)}
              hasLowercaseLetter={this.getSingleRuleStatus(this.state.rules.hasLowercaseLetter)}
              hasUppercaseLetter={this.getSingleRuleStatus(this.state.rules.hasUppercaseLetter)}
              hasSpecialCharacter={this.getSingleRuleStatus(this.state.rules.hasSpecialCharacter)}
            />
          ) : (
            <span></span>
          )
        }
      </div>
    )
  }
}

module.exports = PasswordStrength;
