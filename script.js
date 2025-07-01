function main() {
  let machineValue = 0; // total amount in cents in the machine
  let machineCreditDisplay = document.querySelector("#display #amount");
  let machineItemDisplay = document.querySelector("#display #selected-item");

  function updateMachineCreditDisplay(amount = 0) {
    machineCreditDisplay.textContent = `$ ${amount.toFixed(2)}`;
  }

  function updateMachineItemDisplay(name = "SELECT AN ITEM") {
    machineItemDisplay.textContent = name;
  }

  function updateMachineCreditItemDisplay(amount, name) {
    updateMachineCreditDisplay(amount);
    updateMachineItemDisplay(name);
  }

  function updateItemStock (element, num) {
    element.dataset.stock = num;
    element.querySelector(".item-stock").textContent = num;
  }

  function itemSelected (element, name, cost, stock) {

  }

  function getCentsAmountFromTextContext (element) {
    const TEXT = element.textContent;
    
    // Check if input is a price tag
    const CENTS_NOTATION = 1;
    const DOLLOR_NOTATION = 2;
    let notationFormat = 3;

    if(!TEXT.includes("¢")) notationFormat ^= CENTS_NOTATION;
    if(!TEXT.includes("$")) notationFormat ^= DOLLOR_NOTATION; 

    if(notationFormat == 0) {
      console.error(`Element ${element} does not have valid price tag in it's textContext`);
      return null;
    }

    let matches = TEXT.match(/\b\d*\.?\d+\b/g);
       
    if(notationFormat === CENTS_NOTATION) {
      return parseInt(matches[0]);
    }

    let value = parseInt(matches[0]) * 100;
    if (matches.length === 2) {
      value += parseInt(matches[1]); 
    }

    return value;
  }

  function initInsertCoinButtons() {
    let coinButtons = document.querySelectorAll(".coin-button");
    coinButtons.forEach(function(button) {
      button.dataset.amount = getCentsAmountFromTextContext(button);
      button.addEventListener("click", function(event) {
        machineValue += button.dataset.amount;
      });
    });
  }

  function initItemButtons() {
    let itemButtons = document.querySelectorAll(".items-section .item");
    itemButtons.forEach(function(button){
      button.dataset.itemName = button.querySelector(".item-name").textContent;
      button.dataset.itemCost = 
        getCentsAmountFromTextContext(button.querySelector(".item-price"));
      button.dataset.stock = 
        getCentsAmountFromTextContext(button.querySelector(".item-stock"));
      
      button.addEventListener("click", function(event){
        const element = event.target;
        console.log(event);
        console.log(element);

        itemSelected(
          element,
          element.dataset.itemName,
          element.dataset.itemCost,
          element.dataset.stock);
      });
    });

  }

  initInsertCoinButtons();
  initItemButtons();
}
main();