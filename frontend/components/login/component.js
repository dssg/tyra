import React from 'react'

export default React.createClass({
  getInitialState: function() {
    return { account: '', password: '', success: true }
  },
  handleAccountChange: function(event) {
    this.setState({ account: event.target.value })
  },
  handlePasswordChange: function(event) {
    this.setState({ password: event.target.value })
  },
  handleFormSubmit: function(event) {
    event.preventDefault()
    if(this.state.account === 'admin' && this.state.password === 'admin') {
      this.setState({ success: true })
      this.props.logInSuccess(true)
    } else {
      this.setState({ success: false })
    }
  },
  renderAlert: function() {
    return (
      <div className="alert alert-dismissible alert-danger">
        <strong>Username or Password doesn&#39;t match!</strong>
      </div>
    )
  },
  render: function() {
    return (
      <div className="container">
        <div className="col-md-6 col-md-offset-3">
          <h2 className="text-center"> Log In</h2>
          <form onSubmit={this.handleFormSubmit}>
            <fieldset className="form-group">
              <label>Account</label>
              <input type="text" onChange={this.handleAccountChange} className="form-control" placeholder="Account" />
            </fieldset>
            <fieldset className="form-group">
              <label>Password</label>
              <input type="password" onChange={this.handlePasswordChange} className="form-control" placeholder="Password" />
            </fieldset>
            <button type="submit" className="btn btn-primary">Sign In</button>
            { !(this.state.success) ? this.renderAlert() : null }
          </form>
        </div>
      </div>
    )
  }
})
