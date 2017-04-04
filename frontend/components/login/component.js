import React from 'react'

export default React.createClass({
  handleFormSubmit: function(values) {
    console.log(values)
  },
  render: function() {
    return (
      <div className="container">
        <div className="col-md-6 col-md-offset-3">
          <h2 className="text-center"> Log In</h2>
          <form>
            <fieldset className="form-group">
              <label>Account</label>
              <input type="text" className="form-control" placeholder="Account" />
            </fieldset>
            <fieldset className="form-group">
              <label>Password</label>
              <input type="password" className="form-control" placeholder="Password" />
            </fieldset>
            <button action="submit" className="btn btn-primary">Sign In</button>
            </form>
        </div>
      </div>
    )
  }
})
