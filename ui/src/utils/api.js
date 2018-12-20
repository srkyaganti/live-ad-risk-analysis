import axios from 'axios'

function getReports(data) {
    return new Promise((resolve, reject) => {
        axios.post('http://localhost:3000/api/reports', data)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
}

function getReport(data) {
    return new Promise((resolve, reject) => {
        axios.post('http://localhost:3000/api/report', data)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
}

export {
    getReports,
    getReport
}