import React, { Component } from "react";
import withSplashScreen from "./withSplashScreen";

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null // to get username from Auth0
    };
  }

  render() {
    return (
      <div>
        {this.props.auth.isAuthenticated() && (
          <div>
            <p>Hey, {this.props.name}, how can we assist you today?</p>
            <a href="/restricted" class="btn btn-primary">
              Go to Tickets
            </a>
          </div>
        )}

        {/* only display login option if user is not already logged in */}
        {!this.props.auth.isAuthenticated() && (
          <button className="btn btn-primary" onClick={this.props.auth.login}>
            Login
          </button>
        )}
      </div>
    );
  }
}

export default withSplashScreen(Main);