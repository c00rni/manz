Feature: Schedule a meal to my planning
    As a busy remote worker
    I would like to schedule one of my favorite meal in my calendar
    So I can keep track of my plan
Scenario:
    Given I selected today 8-9 hour
    and I selected a recipe name "Scramble eggs"
    When I save the meal
    Then I can see a meal name "Scramble egg"
