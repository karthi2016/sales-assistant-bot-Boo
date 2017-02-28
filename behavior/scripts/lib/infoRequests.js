class InfoRequests {

  //REQUEST TOTAL SALES
  const handleSaleTile = client.createStep({
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
  const handleMarginTile = client.createStep({
      satisfied() {
          return false
      },
      prompt(next) {
          var margin = axios.get(`${hostName}/reports?grossProfitMargin`).then(function(res) {
              var margin = res.data.Gross_Profit_Margin_Percent
              client.addTextResponse(`Your profit margin is % ${margin}`)
              client.done()
          })
      }
  })
  //REQUEST PROFITS
  const handleProfitTile = client.createStep({
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
  const handleADSTile = client.createStep({
      satisfied() {
          return false
      },
      prompt(next) {
          var ads = axios.get(`${hostName}/reports?avgDealSize`).then(function(res) {
              var ads = res.data.Avg_Sale_Amount
              client.addTextResponse(`Your ADS is $ ${ads}`)
              client.done()
          })
      }
  })
  //REQUEST EXPENSES
  const handleExpenseTile = client.createStep({
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


}

export defalt new InfoRequests();
