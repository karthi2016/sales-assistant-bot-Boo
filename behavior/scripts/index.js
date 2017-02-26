'use strict'
var axios = require('axios')
var hostName = 'https://decode-bot-project-sql-ajdez.c9users.io'

exports.handle = (client) => {
    // Create steps
    const sayHello = client.createStep({
        satisfied() {
            return Boolean(client.getConversationState().helloSent)
        },

        prompt() {
            client.addResponse('welcome')
            client.addResponse('provide/documentation', {documentation_link: 'http://docs.init.ai'})
            client.addResponse('provide/instructions')

            client.updateConversationState({helloSent: true})

            client.done()
        }
    })

    const untrained = client.createStep({
        satisfied() {
            return false
        },

        prompt() {
            client.addResponse('apology/untrained')
            client.done()
        }
    })

    const handleGreeting = client.createStep({
        satisfied() {
            return false
        },

        prompt() {
            client.addResponse('greeting')
            client.done()
        }
    })

    const handleGoodbye = client.createStep({
        satisfied() {
            return false
        },

        prompt() {
            client.addResponse('goodbye')
            client.done()
        }
    })

    const checkCompany = client.createStep({
        extractInfo() {
            let company = client.getFirstEntityWithRole(client.getMessagePart(), 'company_name')

            if (company) {
                client.updateConversationState({companyName: company.value})

                console.log('User wants to insert company:', company.value)
            }
        },
        satisfied() {
            return Boolean(client.getConversationState().companyName)
        },

        prompt() {
            client.addResponse('add_client/ask_company')
            client.expect(client.getStreamName(), ['company_response'])
            client.done()
        }
    })
    const handleAddConfirmation = client.createStep({
        satisfied() {
            return false
        },

        prompt(next) {
            const company = client.getConversationState().companyName
            console.log('+++++++++', company)
            axios.post(`${hostName}/company`, {name: company}).then(result => {
                client.addResponse('client_add/confirm', {company_name: company})
                client.updateConversationState({companyName: null})
                client.done()
            }).catch(err => {
                client.addTextResponse('This comapny name already exists');
                client.done()
            })

        }
    })
    const checkSalesCompany = client.createStep({
        extractInfo() {
            let company = client.getFirstEntityWithRole(client.getMessagePart(), 'company_name')

            if (company) {
                client.updateConversationState({companyName: company.value})

                console.log('User wants to insert company:', company.value)
            }
        },
        satisfied() {
            return Boolean(client.getConversationState().companyName)
        },

        prompt() {
            client.addResponse('client_sale/ask_company')
            client.expect(client.getStreamName(), ['company_response'])
            client.done()
        }
    })
    const checkSalesAmount = client.createStep({
        extractInfo() {
            let amount = client.getFirstEntityWithRole(client.getMessagePart(), 'amount_of_money')

            if (amount) {
                client.updateConversationState({Amount: amount.value})

                console.log('User wants to insert company:', amount.value)
            }
        },
        satisfied() {
            return Boolean(client.getConversationState().Amount)
        },

        prompt() {
            client.addResponse('client_sale/ask_amount')
            client.expect(client.getStreamName(), ['amount_response'])
            client.done()
        }
    })
    const handleSalesConfirmation = client.createStep({
        satisfied() {
            return false
        },

        prompt(next) {
            const company = client.getConversationState().companyName;
            const amount = client.getConversationState().Amount;
            console.log('-----------', company)
            console.log('+++++++++++', amount)
            axios.get(`${hostName}/company?name=${company}`).then(function(res) {
                console.log(res)
                //assuming some data structure on res
                var companies = res.data
                if (companies.length < 1) {
                    client.addTextResponse('You dumbnutz this company does not exist go get a hint about life');
                    client.done();
                } else if (companies.length === 1) {
                    var companyID = companies[0].id

                    axios.post(`${hostName}/sales?companyId=${companyID}`, {
                        customer_id: companyID,
                        amount: amount
                    }).then(response => {
                        client.addResponse('client_sale/confirmation', {
                            company_name: company,
                            amount_of_money: amount
                        })
                        client.updateConversationState({companyName: null, Amount: null})
                        client.done()
                    })
                    // else if (companies.length <= 3) {
                    //   // do buttons WE WILL DO THIS LATER
                    // }
                } else {
                    // reply saying there are too many results
                }
            }).catch(err => {
                console.log(err)
                client.addTextResponse('Something went wrong you Dummy');
                client.done()
            })
        }
    })
    const checkExpenseCompany = client.createStep({
        extractInfo() {
            let company = client.getFirstEntityWithRole(client.getMessagePart(), 'company_name')

            if (company) {
                client.updateConversationState({companyName: company.value})

                console.log('User wants to insert company:', company.value)
            }
        },
        satisfied() {
            return Boolean(client.getConversationState().companyName)
        },

        prompt() {
            client.addResponse('client_expense/ask_company')
            client.expect(client.getStreamName(), ['company_response'])
            client.done()
        }
    })
    const checkExpenseAmount = client.createStep({
        extractInfo() {
            let amount = client.getFirstEntityWithRole(client.getMessagePart(), 'amount_of_money')

            if (amount) {
                client.updateConversationState({Amount: amount.value})

                console.log('User wants to insert company:', amount.value)
            }
        },
        satisfied() {
            return Boolean(client.getConversationState().Amount)
        },

        prompt() {
            client.addResponse('client_expense/ask_amount')
            client.expect(client.getStreamName(), ['amount_response'])
            client.done()
        }

    })
    const handleExpenseConfirmation = client.createStep({
        satisfied() {
            return false
        },
        prompt() {
            const company = client.getConversationState().companyName;
            const amount = client.getConversationState().Amount;
            //COMPARING THE NAME WE RETRIEVE FROM BOT WITH DATABASE TO GET CUTSOMER_ID
            axios.get(`${hostName}/company?name=${company}`).then(function(res) {
                //assuming some data structure on res
                var companies = res.data
                console.log(companies)
                if (companies.length < 1) {
                    client.addResponse('You dumbnutz');
                    client.done();
                }
                if (companies.length === 1) {
                    var companyID = companies[0].id
                    //SENDING EXTRACTED DATA TO THE DATABASE
                    axios.post(`${hostName}/expenses?companyId=${companyID}`, {
                        customer_id: companyID,
                        amount: amount
                    })
                    client.addResponse('client_expense/confirmation', {
                        company_name: company,
                        amount_of_money: amount
                    })
                    client.updateConversationState({companyName: null, Amount: null})
                    client.done()
                }
            })
            // if (companies.length > 1)
            // {
            //   //make button selection
            // }
                .catch(err => {
                client.addTextResponse('Something went wrong you Dummy');
                client.done()
            })
        }
    })

    /*
      1. Find the company ID based on the name (GET /companies?name={comapny1})
        2a: if there is no company, addResponse to tell the user hes stupid
        2b: if there is only one, then get its ID and move to step 3
        2c: if tehre are more than one, then give the user some opshunz with addResponseWithButtons
      3. Inser the expense by POST /companies/:id/expenses or POST /expenses {companyId: 1, amount: 100}
      4. Respond with a confirmation
      */
    const checkGoalAmount = client.createStep({
        extractInfo() {
            let amount = client.getFirstEntityWithRole(client.getMessagePart(), 'amount_of_money')

            if (amount) {
                client.updateConversationState({Amount: amount.value})

                console.log('User wants to insert company:', amount.value)
            }
        },
        satisfied() {
            return Boolean(client.getConversationState().Amount)
        },

        prompt() {
            client.addResponse('client_goal/ask_amount')
            client.expect(client.getStreamName(), ['amount_response'])
            client.done()
        }

    })
    const checkGoalStartDate = client.createStep({
        extractInfo() {
            let startDate = client.getFirstEntityWithRole(client.getMessagePart(), 'date_start')

            if (startDate) {
                client.updateConversationState({startDate: startDate.value})

                console.log('User wants to insert new start date:', startDate.value)
            }
        },
        satisfied() {
            return Boolean(client.getConversationState().startDate)
        },

        prompt() {
            client.addResponse('client_goal/start_date')
            client.expect(client.getStreamName(), ['start_date_response'])
            client.done()
        }
    })
    const checkGoalEndDate = client.createStep({
        extractInfo() {
            let endDate = client.getFirstEntityWithRole(client.getMessagePart(), 'date_end')

            if (endDate) {
                client.updateConversationState({endDate: endDate.value})

                console.log('User wants to insert new end date:', endDate.value)
            }
        },
        satisfied() {
            return Boolean(client.getConversationState().endDate)
        },

        prompt() {
            client.addResponse('client_goal/end_date')
            client.expect(client.getStreamName(), ['end_date_response'])
            client.done()
        }

    })
    const handleGoalConfirmation = client.createStep({
        satisfied() {
            return false
        },
        prompt() {
            const amount = client.getConversationState().Amount;
            const startDate = client.getConversationState().startDate
            const endDate = client.getConversationState().endDate;

            axios.post(`${hostName}/reports?goalGauge`, {
                amount: amount,
                startDate: startDate,
                endDate: endDate
            })
            client.addResponse('client_goal/confirmation', {
                amount_of_money: amount,
                date_start: startDate,
                date_end: endDate
            })
            client.updateConversationState({Amount: null, date_start: null, date_end: null})
            client.done()
        }
    })
    // if (companies.length > 1)
    // {
    //   //make button selection
    // }
        .catch(err => {
        client.addTextResponse('Something went wrong you Dummy');
        client.done()
    })
}
})

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
        client.addTextResponse(`Your profit margin is ${margin}`)
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
        client.addTextResponse(`Your total profits are ${profit}`)
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
        client.addTextResponse(`Your ADS is ${ads}`)
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
        client.addTextResponse(`Your total expenses are ${expenses}`)
        client.done()
    })
}
})

const handleThanks = client.createStep({
satisfied() {
    return false
},

prompt() {
    client.addResponse('welcome')
    client.done()
}
})

client.runFlow({
classifications: {
    goodbye: 'goodbye',
    greeting: 'greeting',
    "add/client": 'clientAdd',
    "client/sale": 'clientSale',
    "client/expense": 'clientExpense',
    thanks: 'welcome',
    request_sales_tile: 'requestSales',
    request_margin_tile: 'requestMargin',
    request_profit_tile: 'requestProfit',
    request_ads_tile: 'requestAds',
    request_expense_tile: 'requestExpense'
},
//Streams
streams: {
    goodbye: handleGoodbye,
    greeting: handleGreeting,
    clientAdd: [
        checkCompany, handleAddConfirmation
    ],
    clientSale: [
        checkSalesCompany, checkSalesAmount, handleSalesConfirmation
    ],
    clientExpense: [
        checkExpenseCompany, checkExpenseAmount, handleExpenseConfirmation
    ],
    welcome: handleThanks,
    main: 'onboarding',
    onboarding: [sayHello],
    end: [untrained],
    requestSales: handleSaleTile,
    requestMargin: handleMarginTile,
    requestProfit: handleProfitTile,
    requestAds: handleADSTile,
    requestExpense: handleExpenseTile
}
})
}
