exports.sayHello = (client) => client.createStep({
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

exports.untrained = (client) => client.createStep({
    satisfied() {
        return false
    },

    prompt() {
        client.addResponse('apology/untrained')
        client.done()
    }
})

exports.handleGreeting = (client) => client.createStep({
    satisfied() {
        return false
    },

    prompt() {
        client.addResponse('greeting')
        client.done()
    }
})

exports.handleGoodbye = (client) => client.createStep({
    satisfied() {
        return false
    },

    prompt() {
        client.addResponse('goodbye')
        client.done()
    }
})


exports.handleThanks = (client) => client.createStep({
satisfied() {
    return false
},

prompt() {
    client.addResponse('welcome')
    client.done()
}
})
