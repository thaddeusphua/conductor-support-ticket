import React, { Component } from "react";
import NavBar from './NavBar.js';

export default class ClientDashboard extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div>
            <NavBar props={this.props} />
            </div>
        );
    } 

}