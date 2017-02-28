var axios = require('axios')
var hostName = 'https://decode-bot-project-sql-ajdez.c9users.io'

exports.checkGoalAmount = (client) => client.createStep({
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
        client.addResponse('client_goal/ask_amount')
        client.expect(client.getStreamName(), ['amount_response'])
        client.done()
    }

})
exports.checkGoalStartDate = (client) => client.createStep({
    extractInfo() {
        let startDate = client.getEntities(client.getMessagePart(), 'time/date-start')
        if (startDate) {
            client.updateConversationState({startDate: startDate.generic[0].parsed.results[0].value.value})

            console.log('User wants to insert new start date:', startDate.generic[0].parsed.results[0].value.value)
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
exports.checkGoalEndDate = (client) => client.createStep({
    extractInfo() {
        let endDate = client.getEntities(client.getMessagePart(), 'time/date-end')

        if (endDate) {
            client.updateConversationState({endDate: endDate.generic[0].parsed.results[0].value.value})

            console.log('User wants to insert new end date:', endDate.generic[0].parsed.results[0].value.value)
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
exports.handleGoalConfirmation = (client) => client.createStep({
    satisfied() {
        return false
    },
    prompt() {
        const amount = client.getConversationState().Amount;
        const startDate = client.getConversationState().startDate
        const endDate = client.getConversationState().endDate;

        axios.post(`${hostName}/goals`, {
            amount_of_money: amount,
            date_start: startDate,
            date_end: endDate
        })
        client.addResponse('client_goal/confirmation', {
            amount_of_money: amount,
            date_start: startDate,
            date_end: endDate
        })
        client.updateConversationState({Amount: null, startDate: null, endDate: null})
        client.done()

    }
})
