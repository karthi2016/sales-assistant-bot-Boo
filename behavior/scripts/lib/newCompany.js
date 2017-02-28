var axios = require('axios')
var hostName = 'https://decode-bot-project-sql-ajdez.c9users.io'

exports.checkCompany = (client) => client.createStep({
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

exports.handleAddConfirmation = (client) => client.createStep({
    satisfied() {
        return false
    },

    prompt(next) {
        const company = client.getConversationState().companyName

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
