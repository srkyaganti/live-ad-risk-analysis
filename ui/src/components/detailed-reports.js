import React from 'react'
import { Panel, Table, Button, ButtonGroup } from 'react-bootstrap'
import { getReport } from '../utils/api'

export default class DetailedReport extends React.PureComponent {

    constructor(props) {
        super(props)

        this.getNextPage = this.getNextPage.bind(this)
        this.loadData = this.loadData.bind(this)
        this.getPrevPage = this.getPrevPage.bind(this)

        this.state = {
            queryParameters: {
                size: 10,
                offset: 0
            },
            report_id: this.props.id,
            tweets: []
        }
    }

    getNextPage() {
        this.setState({ reportsQueryParameters: { size: this.state.reportsQueryParameters.size, offset: this.state.reportsQueryParameters.offset + 10 } }, this.loadData)
    }

    getPrevPage() {
        this.setState({ reportsQueryParameters: { size: this.state.reportsQueryParameters.size, offset: this.state.reportsQueryParameters.offset - 10 } }, this.loadData)
    }

    loadData() {
        getReport({ id: this.state.report_id })
        .then(response => this.setState({ tweets: response.data }))
        .catch(error => console.log)
    }

    componentDidMount() {
        this.loadData()
    }

    render() {
        const tweets = this.state.tweets
        
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
                                <th>Tweet #</th>
                                <th>Text</th>
                                <th>Sentiment score</th>
                                <th>Negative Keywords</th>
                                <th>Positive Keywords</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tweets.map((tweet, index) => (
                                    <tr key={ tweet.id }>
                                        <td>{ index + 1 }</td>
                                        <td>{ tweet.tweet_id }</td>
                                        <td>{ tweet.text.length > 50? tweet.text.substring(0, 50) + '...' : tweet.text }</td>
                                        <td>{ tweet.sentiment_score }</td>
                                        <td>{ tweet.negative_keywords }</td>
                                        <td>{ tweet.positive_keywords }</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                    <ButtonGroup justified>
                        <Button bsStyle='primary' onClick={this.getPrevPage} disabled = {this.state.queryParameters.offset === 0 ? true: false }>{'  <  '}</Button>
                        <Button bsStyle='primary'>{'  ' + (1 + this.state.queryParameters.offset/10) + '  '}</Button>
                        <Button bsStyle='primary' onClick={this.getNextPage}>{'  >  '}</Button>
                    </ButtonGroup>
                </Panel.Body>
            </Panel>
        )
    }
}