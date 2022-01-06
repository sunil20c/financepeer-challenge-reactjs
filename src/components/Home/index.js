import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import ReactFileReader from 'react-file-reader'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    usersList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getData()
  }

  onClickLogout = () => {
    const {history} = this.props

    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  onChangeInFile = files => {
    const reader = new ReactFileReader()
    reader.onload = e => {
      console.log(e.reader.result)
    }
    reader.readAsText(files[0])
  }

  getData = async () => {
    const url = 'https://financepeer-challenge.herokuapp.com/users'

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const fetchedData = data.map(each => ({
        userId: each.user_id,
        id: each.id,
        title: each.title,
        body: each.body,
      }))
      this.setState({
        usersList: fetchedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {usersList} = this.state
    return (
      <ul>
        {usersList.map(each => (
          <li className="user-item-container" key={each.id}>
            <h1 className="user-heading">each.title</h1>
            <p className="user-body"> each.body</p>
          </li>
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div>
      <h1>This is failure section</h1>
      <p>
        You are into failure page. Please reload or no users found on search
      </p>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader">
      <Loader type="oval" color="green" height="20" width="20" />
    </div>
  )

  renderDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-main-bg-container">
        <button type="button" onClick={this.onClickLogout}>
          Logout
        </button>
        <h1 className="home-heading">Welcome to FINANCEPEER page </h1>
        <p className="home-details">
          As per instructions you need to provide file below here.
        </p>
        <p className="home-reply">Upload here:</p>
        <input type="file" name="myFile" onChange={this.onChangeInFile} />
        {this.renderDetails()}
      </div>
    )
  }
}

export default Home
