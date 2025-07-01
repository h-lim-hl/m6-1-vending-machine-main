- Your first task is to allow the user to add coins. As the user adds coin, show the amount in the display, like in the example below where the user has just clicked on the 10 cent button.
- When the user selects an item, the name should be reflected in the vending machine display.  We should also modify the credit to show how  much more the user needs to add to afford the item.
    -  For instance, assume that the amount of credit is 0. When the user selects Potato Chip. Then the vending machine displayed should be shown as inserted minus required amount.
- When the user clicks on the Cancel button, assume it returns all the user's coins and reset the product selection. 

- Once the amount of credit meets and equal to the price of the selected item, then dispense the item. This could happen in two cases: when the user adds coins so that the credit is above 0, or when the user clicks on a product and the credit is above 0. 

    - Replace the item display and item price with the text "Dispensing Product" and has it fades away in 3 seconds
    - After 3 seconds, restore the display so that it goes back to the original: "CREDIT: $X.XX | SELECT AN ITEM" after dispensing the product
    - Reduce the stock number by 1.


