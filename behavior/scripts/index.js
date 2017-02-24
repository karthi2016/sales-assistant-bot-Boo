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
    const handleSaleTile = client.createStep({

        satisfied() {
            return false
        },
        prompt() {
            var sales = axios.get(`${hostName}/reports?totalRev`).then(function(res) {
                client.addTextResponse(`Your total sales are ${sales}`)
                client.done()
            })
        }
    })
    const handleMarginTile = client.createStep({

        satisfied() {
            return false
        }
        prompt() {
            var margin = axios.get(`${hostName}/reports?grossProfitMargin`).then(function(res) {
                client.addTextResponse(`Your profit margin is ${margin}`)
                client.done()
            })
        }
    })

    const handleProfitTile = client.createStep({

        satisfied() {
            return false
        }
        prompt() {
            var profit = axios.get(`${hostName}/reports?profits`).then(function(res) {
                client.addTextResponse(`Your total profits are ${profit}`)
                client.done()
            })
        }
    })
    const handleADSTile = client.createStep({

        satisfied() {
            return false
        }
        prompt() {
            var ads = axios.get(`${hostName}/reports?totalRev`).then(function(res) {
                client.addTextResponse(`Your ADS is ${ads}`)
                client.done()
            })
        }
    })
    const handleExpenseTile = client.createStep({

        satisfied() {
            return false
        }
        prompt() {
            var expenses = axios.get(`${hostName}/reports?totalexpenses`).then(function(res) {
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
        thanks: 'welcome'
        request_sale_tile: 'requestSales'
        request_margin_tile:'requestMargin'
        request_profit_tile:'requestProfit'
        request_ads_tile:'requestAds'
        request_expense_tile:'requestExpense'

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
        requestSale: handleSaleTile,
        requestMargin: handleExpenseTile,
        requestProfit: handleProfitTile,
        requestAds: handleADSTile,
        requestExpense: handleExpenseTile,
    }
})
}
