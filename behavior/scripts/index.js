'use strict'

exports.handle = (client) => {
    // Create steps

    const sayHello = require('./lib/pleasantries').sayHello(client);
    const untrained = require('./lib/pleasantries').untrained(client);
    const handleGreeting = require('./lib/pleasantries').handleGreeting(client);
    const handleGoodbye = require('./lib/pleasantries').handleGoodbye(client);
    const handleThanks = require('./lib/pleasantries').handleThanks(client);
    const checkCompany = require('./lib/newCompany').checkCompany(client);
    const handleAddConfirmation = require('./lib/newCompany').handleAddConfirmation(client);
    const checkSalesCompany = require('./lib/newSale').checkSalesCompany(client);
    const checkSalesAmount = require('./lib/newSale').checkSalesAmount(client);
    const handleSalesConfirmation = require('./lib/newSale').handleSalesConfirmation(client);
    const checkExpenseCompany = require('./lib/newExpense').checkExpenseCompany(client);
    const checkExpenseAmount = require('./lib/newExpense').checkExpenseAmount(client);
    const handleExpenseConfirmation = require('./lib/newExpense').handleExpenseConfirmation(client);
    const checkGoalAmount = require('./lib/newGoal').checkGoalAmount(client);
    const checkGoalStartDate = require('./lib/newGoal').checkGoalStartDate(client);
    const checkGoalEndDate = require('./lib/newGoal').checkGoalEndDate(client);
    const handleGoalConfirmation = require('./lib/newGoal').handleGoalConfirmation(client);
    const handleSaleTile = require('./lib/infoRequests').handleSaleTile(client);
    const handleMarginTile = require('./lib/infoRequests').handleMarginTile(client);
    const handleProfitTile = require('./lib/infoRequests').handleProfitTile(client);
    const handleADSTile = require('./lib/infoRequests').handleADSTile(client);
    const handleExpenseTile = require('./lib/infoRequests').handleExpenseTile(client);

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
            request_expense_tile: 'requestExpense',
            client_goal: 'clientGoal'
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
            clientGoal: [
                checkGoalAmount, checkGoalStartDate, checkGoalEndDate, handleGoalConfirmation
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
