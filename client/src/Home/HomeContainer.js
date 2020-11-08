import React, { Component } from "react"
import api from "../api"
import HomePresenter from "./HomePresenter"

class Home extends Component {
  state = {
    loading: true,
    homeData: null,
    user: null,
  }

  getLoggedUser = async () => {
    const userData = await api.getLoggedUser()
    console.log(userData)
    const user = userData.data
    this.setState({ user })
  }

  async componentDidMount() {
    try {
      this.getLoggedUser()
    } catch (error) {
      console.log(error)
    } finally {
      this.setState({ loading: false })
    }
  }

  render() {
    const { user, loading } = this.state
    console.log(this)
    return <HomePresenter user={user} loading={loading} />
  }
}

export default Home
