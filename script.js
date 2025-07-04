function main() {
  let machineValue = 0; // total amount in cents in the machine
  let machineDisplay = document.querySelector("#display");
  let selectedItem = null;

  function updateMachineCreditDisplay(amount = machineValue) {
     machineDisplay.querySelector("#amount").textContent = `$ ${(amount / 100.0).toFixed(2)}`;
  }

  function updateMachineItemDisplay(name = "SELECT AN ITEM") {
    machineDisplay.querySelector("#selected-item").textContent = name;
  }

  function updateMachineCreditItemDisplay(amount, name) {
    updateMachineCreditDisplay(amount);
    updateMachineItemDisplay(name);
  }

  function resetMachineCreditItemDisplay() {
    machineDisplay.classList.remove("fade-out");
    updateMachineCreditDisplay();
    updateMachineItemDisplay();
  }

  function machineDisplayTimedReset(mSec = 1000) {
    setTimeout(resetMachineCreditItemDisplay, mSec);
  }

  function updateItemStock(element, num) {
    console.log(element);
    element.dataset.itemStock = num;
    element.querySelector(".item-stock").textContent = `Stock: ${num}`;
  }

  function getItemButtonElement(childElement) {
    const ITEM_CLASS = "item";
    if (!(childElement instanceof HTMLElement)) {
      console.error(`Param ${element} is not a HTMLElement`);
      return null;
    }

    while (!childElement.classList.contains(ITEM_CLASS)) {
      if (childElement.parentElement == null) {
        console.error(`Could not find element with class ${ITEM_CLASS} in decendant tree`);
        return null;
      }
      childElement = childElement.parentElement;
    }
    return childElement;
  }

  function dispenseItem(element) {
    updateItemStock(element, ITEM_STOCK - 1);
    machineValue -= ITEM_COST;
    
    const DISPLAY_INNERHTML = machineDisplay.innerHTML;
    machineDisplay.innerHTML = "Dispensing Product";
    machineDisplay.classList.add("fade-out");
    setTimeout(function(innerHtml) {
      machineDisplay.innerHTML = DISPLAY_INNERHTML;
      resetMachineCreditItemDisplay();
    }, 3000, DISPLAY_INNERHTML);
  }

  function dispenseWhenReady() {
    if(!selectedItem) return;

    const ITEM_COST = element.dataset.itemCost;
    const ITEM_STOCK = element.dataset.itemStock;
    if(0 < ITEM_STOCK && ITEM_COST <= machineValue) {
      dispenseItem(selectedItem);
    }
  }

  function itemSelected(element) {
    element = getItemButtonElement(element);
    selectedItem = element;

    const ITEM_NAME = element.dataset.itemName;
    const ITEM_COST = element.dataset.itemCost;
    const ITEM_STOCK = element.dataset.itemStock;

    if (machineValue < ITEM_COST) { // if insufficent funds
      updateMachineCreditItemDisplay(machineValue - ITEM_COST, ITEM_NAME);
      machineDisplayTimedReset();
    } else if (0 < ITEM_STOCK) { // if has stock
      dispenseItem(selectedItem);
    }
  }

  function getCentsAmountFromTextContext(element) {
    const TEXT = element.textContent;
    // Check if input is a price tag
    const CENTS_NOTATION = 1;
    const DOLLOR_NOTATION = 2;
    let notationFormat = 3;

    if (!TEXT.includes("¢")) notationFormat ^= CENTS_NOTATION;
    if (!TEXT.includes("$")) notationFormat ^= DOLLOR_NOTATION;

    if (notationFormat == 0) {
      console.error(`Element ${element} does not have valid price tag in it's textContext`);
      return null;
    }

    let matches = TEXT.match(/\b\d*\.?\d+\b/g);

    if (notationFormat === CENTS_NOTATION) {
      return parseInt(matches[0]);
    }

    return Math.floor(parseFloat(matches[0] * 100));

  }

  function getStockAmountFromTextContext(element) {
    const TEXT = element.textContent;
    const matches = TEXT.match(/Stock:\s*(\d+)/);
    if (matches.length === 2) {
      return parseInt(matches[1]);
    }
    console.error(`Element ${element} does not have a valid formated stock text`);
    return null;
  }

  function initInsertCoinButtons() {
    let coinButtons = document.querySelectorAll(".coin-button");
    coinButtons.forEach(function (button) {
      button.dataset.amount = getCentsAmountFromTextContext(button);
      button.addEventListener("click", function (event) {
        machineValue += parseInt(button.dataset.amount);
        updateMachineCreditDisplay(machineValue);
        dispenseWhenReady();
      });
    });
  }

  function initItemButtons() {
    let itemButtons = document.querySelectorAll(".items-section .item");
    itemButtons.forEach(function (button) {
      button.dataset.itemName = button.querySelector(".item-name").textContent;
      button.dataset.itemCost =
        getCentsAmountFromTextContext(button.querySelector(".item-price"));
      button.dataset.itemStock =
        getStockAmountFromTextContext(button.querySelector(".item-stock"));

      button.addEventListener("click", function (event) {
        if(selectedItem) return; // ignore if previously an item was selected
        const element = event.target;
        itemSelected(element);
      });
    });

  }

  function initCancelButton() {
    let cancelButton = document.querySelector("#cancel");
    cancelButton.addEventListener("click", function () {
      machineValue = 0;
      selectedItem = null;
      resetMachineCreditItemDisplay();
    });
  }

  initInsertCoinButtons();
  initItemButtons();
  initCancelButton();
}
main();