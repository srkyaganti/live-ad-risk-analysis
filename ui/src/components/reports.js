import React from 'react'
import { Table, Panel, Button, ButtonGroup } from 'react-bootstrap'
import { getReports } from '../utils/api'

export default class Reports extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            reportsQueryParameters: {
              size: 10,
              offset: 0
            },
            reports: []
        }

        this.getNextPage = this.getNextPage.bind(this)
        this.loadData = this.loadData.bind(this)
        this.getPrevPage = this.getPrevPage.bind(this)
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
        this.loadData()
    }

    getNextPage() {
        this.setState({ reportsQueryParameters: { size: this.state.reportsQueryParameters.size, offset: this.state.reportsQueryParameters.offset + 10 } }, this.loadData)
    }

    getPrevPage() {
        this.setState({ reportsQueryParameters: { size: this.state.reportsQueryParameters.size, offset: this.state.reportsQueryParameters.offset - 10 } }, this.loadData)
    }

    render() {
        const reports = this.state.reports

        return(
            <Panel>
                <Panel.Heading>
                    <Panel.Title componentClass="h3">Twitter trending topics</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                    <Table striped bordered condensed hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Trend topic</th>
                                <th>Search query</th>
                                <th>Approved Ad count</th>
                                <th>Rejected Ad count</th>
                                <th>Approval percentage</th>
                                <th>Sentiment score</th>
                                <th>Timestamp</th>
                                <th>Location</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                reports.map((report, index) => {
                                    let approvalPercentage = report.approved_ad_couint/(report.approved_ad_couint + report.rejected_ad_count)*100
                                    let approvedCount = report.approved_ad_couint;
                                    if(!approvedCount || approvedCount == '') {
                                        approvedCount = 0
                                    }

                                    if(isNaN(approvalPercentage)) {
                                        approvalPercentage = 'N/A'
                                    }
                                    
                                    return (
                                        <tr key={ report.hash_tag_id }>
                                            <td>{ index + 1 }</td>
                                            <td>{ report.hash_tag_name }</td>
                                            <td>{ report.search_query }</td>
                                            <td>{ report.approved_ad_couint }</td>
                                            <td>{ report.rejected_ad_count }</td>
                                            <td>
                                                {
                                                 approvalPercentage   
                                                }
                                            </td>
                                            <td>{ report.total_sentiment_score }</td>
                                            <td>{ report.as_of }</td>
                                            <td>{ report.location }</td>
                                            <td>
                                                <ButtonGroup>
                                                    <Button bsStyle='primary' bsSize='small' href={`reports/${report.hash_tag_id}`}>View tweets</Button>
                                                    <Button bsStyle='danger' bsSize='small'>Andon</Button>
                                                </ButtonGroup>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                    <ButtonGroup justified>
                        <Button bsStyle='primary' onClick={this.getPrevPage} disabled = {this.state.reportsQueryParameters.offset === 0 ? true: false }>{'  <  '}</Button>
                        <Button bsStyle='primary'>{'  ' + (1 + this.state.reportsQueryParameters.offset/10) + '  '}</Button>
                        <Button bsStyle='primary' onClick={this.getNextPage}>{'  >  '}</Button>
                    </ButtonGroup>
                </Panel.Body>
            </Panel>
        )
    }
}