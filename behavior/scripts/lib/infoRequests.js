var axios = require('axios')
var hostName = 'https://decode-bot-project-sql-ajdez.c9users.io'

//REQUEST TOTAL SALES
exports.handleSaleTile = (client) => client.createStep({
    satisfied() {
        return false
    },
    prompt(next) {
        axios.get(`${hostName}/reports?totalRev`).then(function(res) {
            var sales = res.data.Total_Sales;
            client.addTextResponse(`Your total sales are ${sales}`)
            client.done()
        }).catch(err => console.log(err))
    }
})
//REQUEST MARGIN
exports.handleMarginTile = (client) => client.createStep({
    satisfied() {
        return false
    },
    prompt(next) {
        axios.get(`${hostName}/reports?grossProfitMargin`).then(function(res) {
            var margin = res.data.Gross_Profit_Margin_Percent
            client.addTextResponse(`Your profit margin is % ${margin}`)
            client.done()
        })
    }
})
//REQUEST PROFITS
exports.handleProfitTile = (client) => client.createStep({
    satisfied() {
        return false
    },
    prompt(next) {
        axios.get(`${hostName}/reports?profits`).then(function(res) {
            var profit = res.data.Profit
            client.addTextResponse(`Your total profits are $ ${profit}`)
            client.done()
        })
    }
})
//REQUEST AVERAGE DEAL SIZE
exports.handleADSTile = (client) => client.createStep({
    satisfied() {
        return false
    },
    prompt(next) {
        axios.get(`${hostName}/reports?avgDealSize`).then(function(res) {
            var ads = res.data.Avg_Sale_Amount
            client.addTextResponse(`Your ADS is $ ${ads}`)
            client.done()
        })
    }
})
//REQUEST EXPENSES
exports.handleExpenseTile = (client) => client.createStep({
    satisfied() {
        return false
    },
    prompt(next) {
        axios.get(`${hostName}/reports?totalExpenses`).then(function(res) {
            var expenses = res.data.Total_Expenses
            client.addTextResponse(`Your total expenses are $ ${expenses}`)
            client.done()
        })
    }
})
