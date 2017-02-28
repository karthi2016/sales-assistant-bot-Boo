var axios = require('axios')
var hostName = 'https://decode-bot-project-sql-ajdez.c9users.io'

exports.checkExpenseCompany = (client) => client.createStep({
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
exports.checkExpenseAmount = (client) => client.createStep({
    extractInfo() {
        let amount = client.getFirstEntityWithRole(client.getMessagePart(), 'amount_of_money')

        if (amount) {
            client.updateConversationState({Amount: amount.value})

            console.log('User wants to insert amount:', amount.value)
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
exports.handleExpenseConfirmation = (client) => client.createStep({
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
        }).catch(err => {
            client.addTextResponse('Something went wrong you Dummy');
            client.done()
        })
    }
})
