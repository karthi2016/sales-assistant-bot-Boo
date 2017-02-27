---
title: new-goal-02
timestamp: 2017-02-27T12:26:35.821980773-05:00
---

i have a new goal
* client_goal

< Cool. What is the amount???
* client_goal/ask_amount

[10000](amount_of_money)
* amount_response

< Great. Now can you tell me the start date for this goal?
* client_goal/start_date

the [15th of january 2017](time/date-start)
* start_date_response

< Ok. Now the end date?
* client_goal/end_date

[18th of february 2017](time/date-end)
* end_date_response

< I have added a new goal of [10000](amount_of_money) starting [15th of january 2017](date_start) and ending [18th of february 2017](date_end).
* client_goal/confirmation
