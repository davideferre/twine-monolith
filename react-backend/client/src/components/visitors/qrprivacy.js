import React, { Component } from 'react';

export class QRPrivacy extends Component {
  render() {
    return (
      <aside className={`Privacy ${this.props.className}`}>
        <img className="Privacy__image" src="/images/question.png" alt="question" />
        <h3 className="Privacy__title">What information are we storing?</h3>
        <p className="Privacy__text">
          Your name, sex, age, and reason for visiting today, as well as the time and date of your
          visit.
          <br />
          <br />
        </p>
        <h3 className="Privacy__title">Why are we collecting this information?</h3>
        <p className="Privacy__text">
          We are always trying to improve what we offer you. By signing in, you are helping us make
          our services better.
        </p>
      </aside>
    );
  }
}