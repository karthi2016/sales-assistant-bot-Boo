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

}

const handleThanks = client.createStep({
    satisfied() {
        return false
    },

    prompt() {
        client.addResponse('welcome')
        client.done()
    }
})

export default new Plansantries({client})
