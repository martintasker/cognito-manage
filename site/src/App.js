import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <h1>Cognito Test</h1>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12">
            <h2>Registration lifecycle</h2>
          </div>

          <div className="col-xs-2">
            Register
          </div>
          <div className="col-xs-10">
            <form>
              <fieldset>
                <div className="form-group">
                  <input type="text" name="username" placeholder="User name" required />
                  <input type="text" name="email" placeholder="Email Address" required />
                  <input type="password" name="password" placeholder="Password" required />
                  <button className="btn btn-primary" type="submit">Register</button>
                </div>
              </fieldset>
            </form>
          </div>

          <div className="col-xs-2">
            Confirm
          </div>
          <div className="col-xs-10">
            <form>
              <fieldset>
                <div className="form-group">
                  <input type="text" name="username" placeholder="User name" required />
                  <input type="text" name="code" placeholder="Code" required />
                  <button className="btn btn-primary" type="submit">Confirm</button>
                </div>
              </fieldset>
            </form>
          </div>

          <div className="col-xs-2">
            Lost code
          </div>
          <div className="col-xs-10">
            <form>
              <fieldset>
                <div className="form-group">
                  <input type="text" name="username" placeholder="User name" required />
                  <button className="btn btn-primary" type="submit">Request New Code</button>
                </div>
              </fieldset>
            </form>
          </div>

          <div className="col-xs-2">
            Forgotten password
          </div>
          <div className="col-xs-10">
            <form>
              <fieldset>
                <div className="form-group">
                  <input type="text" name="username" placeholder="User name" required />
                  <button className="btn btn-primary" type="submit">Request Reset Code</button>
                </div>
              </fieldset>
            </form>
          </div>

          <div className="col-xs-2">
            Reset password
          </div>
          <div className="col-xs-10">
            <form>
              <fieldset>
                <div className="form-group">
                  <input type="text" name="username" placeholder="User name" required />
                  <input type="text" name="code" placeholder="Confirmation code" required />
                  <input type="password" name="password" placeholder="New Password" required />
                  <button className="btn btn-primary" type="submit">Set New Password</button>
                </div>
              </fieldset>
            </form>
          </div>

          <div className="col-xs-2">
            Deregister
          </div>
          <div className="col-xs-10">
            <form>
              <div className="form-group">
                <div className="btn btn-danger">Deregister</div>
              </div>
            </form>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12">
            <h2>Login lifecycle</h2>
          </div>

          <div className="col-xs-2">
            Login
          </div>
          <div className="col-xs-10">
            <form>
              <fieldset>
                <div className="form-group">
                  <input type="text" name="username" placeholder="User name" required />
                  <input type="password" name="password" placeholder="Password" required />
                  <button className="btn btn-primary" type="submit">Login</button>
                </div>
              </fieldset>
            </form>
          </div>

          <div className="col-xs-2">
            Forced password
          </div>
          <div className="col-xs-10">
            <form>
              <fieldset>
                <div className="form-group">
                  <input type="password" name="password" placeholder="Password" required />
                  <button className="btn btn-primary" type="submit">Complete Login</button>
                </div>
              </fieldset>
            </form>
          </div>

          <div className="col-xs-2">
            Logout
          </div>
          <div className="col-xs-10">
            <form>
              <div className="form-group">
                <button className="btn btn-primary" type="submit">Logout</button>
              </div>
            </form>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12">
            <h2>Profile management</h2>
          </div>

          <div className="col-xs-2">
            Change password
          </div>
          <div className="col-xs-10">
            <form>
              <fieldset>
                <div className="form-group">
                  <input type="password" name="oldPassword" placeholder="Old Password" required />
                  <input type="password" name="password" placeholder="New Password" required />
                  <button className="btn btn-primary" type="submit">Change Password</button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
        
      </div>
    );
  }
}

export default App;
