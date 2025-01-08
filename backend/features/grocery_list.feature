Feature: See a grocery list for the week
    As a busy remote worker
    I would like to see all the needed Item to buy
    So I can do my grocery
Scenario:
    Given I scheduled "Scramble egg" in tomorrow
    and Scamble eggs need oil, salt and eggs
    When I visite my Grocery list
    Then I can see oil, salt and eggs

