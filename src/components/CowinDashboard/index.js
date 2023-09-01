import {Component} from 'react'
import {
  ResponsiveContainer,
  Bar,
  BarChart,
  Legend,
  XAxis,
  YAxis,
  PieChart,
  Cell,
  Pie,
} from 'recharts'

import Loader from 'react-loader-spinner'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class CoWinDashboard extends Component {
  state = {
    last7DaysVaccination: [],
    vaccinationByAge: [],
    vaccinationByGender: [],
    graphDataApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getGraphData()
  }

  getGraphData = async () => {
    this.setState({graphDataApiStatus: apiStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'

    const options = {
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      this.onSuccessfulFetched(response)
    } else {
      this.onFailureFetched()
    }
  }

  onSuccessfulFetched = async response => {
    const data = await response.json()
    const last7DaysVaccination = data.last_7_days_vaccination.map(eachItem => ({
      dose1: eachItem.dose_1,
      dose2: eachItem.dose_2,
      vaccineDate: eachItem.vaccine_date,
    }))

    const vaccinationByAge = data.vaccination_by_age
    const vaccinationByGender = data.vaccination_by_gender

    this.setState({
      last7DaysVaccination,
      vaccinationByAge,
      vaccinationByGender,
      graphDataApiStatus: apiStatusConstants.success,
    })
  }

  onFailureFetched = () => {
    this.setState({graphDataApiStatus: apiStatusConstants.failure})
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderGraphsFailureView = () => (
    <div className="graphsFailureViewContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="graphFailureViewImg"
      />
      <h1 className="something-went-wrong-heading">Something went wrong</h1>
    </div>
  )

  renderVaccinationCoverage = () => {
    const {last7DaysVaccination} = this.state

    return (
      <div className="graph-bg-container">
        <h1 className="each-graph-main-heading">Vaccination Coverage </h1>
        <ResponsiveContainer width="100%" aspect={3}>
          <BarChart data={last7DaysVaccination}>
            <YAxis />
            <XAxis dataKey="vaccineDate" interval="preserveStartEnd" />
            <Legend iconType="diamond" />
            <Bar dataKey="dose1" fill="#5a8dee" radius={[7, 7, 0, 0]} />
            <Bar dataKey="dose2" fill=" #f54394" radius={[7, 7, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  renderVaccinationByGender = () => {
    const {vaccinationByGender} = this.state

    return (
      <div className="graph-bg-container">
        <h1 className="each-graph-main-heading">Vaccination by gender</h1>
        <ResponsiveContainer width="100%" aspect={3} className="pi-container">
          <PieChart width="100%" height="50%">
            <Pie
              data={vaccinationByGender}
              cx="50%"
              cy="70%"
              innerRadius="40%"
              outerRadius="70%"
              startAngle={0}
              endAngle={180}
              dataKey="count"
            >
              <Cell name="Male" fill=" #f54394" />
              <Cell name="Female" fill=" #5a8dee" />
              <Cell name="Others" fill="#2cc6c6" />
            </Pie>
            <Legend iconType="circle" fontWeight="bold" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  renderVaccinationByAge = () => {
    const {vaccinationByAge} = this.state
    const colorList = ['#2d87bb', '#a3df9f', '#64c2a6']

    return (
      <div className="graph-bg-container">
        <h1 className="each-graph-main-heading">Vaccination by gender</h1>
        <ResponsiveContainer width="100%" aspect={3} className="pi-container">
          <PieChart width="100%" height="50%">
            <Pie
              data={vaccinationByAge}
              cx="50%"
              cy="40%"
              startAngle={0}
              endAngle={360}
              dataKey="count"
            >
              <Cell name={vaccinationByAge[0].age} fill={colorList[0]} />
              <Cell name={vaccinationByAge[1].age} fill={colorList[1]} />
              <Cell name={vaccinationByAge[2].age} fill={colorList[2]} />
            </Pie>
            <Legend iconType="circle" fontWeight="bold" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  renderAllGraphs = () => (
    <>
      {this.renderVaccinationCoverage()}
      {this.renderVaccinationByGender()}
      {this.renderVaccinationByAge()}
    </>
  )

  renderGraphs = () => {
    const {graphDataApiStatus} = this.state

    switch (graphDataApiStatus) {
      case apiStatusConstants.success:
        return this.renderAllGraphs()
      case apiStatusConstants.failure:
        return this.renderGraphsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="header">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="website-logo"
          />
          <h1 className="header-heading">Co-WIN</h1>
        </div>

        <div className="app-body-container">
          <h1 className="cowin-vaccination-in-india-heading">
            CoWIN Vaccination in India
          </h1>
          {this.renderGraphs()}
        </div>
      </div>
    )
  }
}

export default CoWinDashboard
