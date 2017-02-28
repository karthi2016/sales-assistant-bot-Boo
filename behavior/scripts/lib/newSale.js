class Sale {
  /*
    1. Find the company ID based on the name (GET /companies?name={comapny1})
      2a: if there is no company, addResponse to tell the user hes stupid
      2b: if there is only one, then get its ID and move to step 3
      2c: if tehre are more than one, then give the user some opshunz with addResponseWithButtons
    3. Inser the expense by POST /companies/:id/expenses or POST /expenses {companyId: 1, amount: 100}
    4. Respond with a confirmation
    */
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
                  }).catch(err => {
                      console.log(err)
                      client.addTextResponse('Something went wrong you Dummy');
                      client.done()
                  })
              }
          })
      }
  })

}

export defalt new Sale();
