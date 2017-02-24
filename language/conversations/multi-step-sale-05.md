---
title: multi-step-sale-05
timestamp: 2017-02-24T16:47:31.15545019-05:00
---

i just made a new sale
* client/sale

< To which company did you sell?
* client_sale/ask_company

[Concordia](company_name)
* company_response

< To which company did you sell?
* client_sale/ask_company

[Apple](company_name)
* company_response

< Good job Boo. What's the amount of the sale?
* client_sale/ask_amount

$[400](company_name)
* amount_response

< I added [$](amount_of_money) to sales for [Apple](company_name)
* client_sale/confirmation
