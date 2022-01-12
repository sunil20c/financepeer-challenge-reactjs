import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitDetails = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const userDetails = {username, password}

    const loginUrl = 'https://financepeer-challenge.herokuapp.com/login'

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(loginUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
      console.log(data.jwtToken)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <h1>FinancePeer</h1>
        <form onSubmit={this.onSubmitDetails} className="form-container">
          <h1>Login Here</h1>

          <label htmlFor="username" className="username-input">
            USERNAME
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={this.onChangeUsername}
          />

          <label htmlFor="password" className="password-input">
            PASSWORD
          </label>
          <input
            type="text"
            id="password"
            value={password}
            onChange={this.onChangePassword}
          />
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
