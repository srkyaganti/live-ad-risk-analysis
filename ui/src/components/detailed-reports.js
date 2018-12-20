import React from 'react'
import { getReports } from '../utils/api'

export default class DetailedReport extends React.PureComponent {

    constructor(props) {
        super(props)

        this.loadData = this.loadData.bind(this)
        this.state = {
            
        }
    }

    loadData() {
        getReports(this.state.reportsQueryParameters)
        .then(response => this.setState((state, props) => {
            console.log(response.data)
            return { reports: response.data }
        }))
        .catch(error => console.log)
    }

    componentDidMount() {
        
    }

    render() {
        return(
            <div>
                detailed report
                {JSON.stringify(this.props)}
            </div>
        )
    }
}