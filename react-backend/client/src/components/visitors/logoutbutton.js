import React, { Component } from 'react';

export class Logoutbutton extends Component {
  logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    this.props.updateLoggedIn();
    this.props.redirectUser('/logincb');
  };

  render() {
    return (
      <button className="Logoutbutton" type="submit" onClick={this.logout}>
        Log out
      </button>
    );
  }
}