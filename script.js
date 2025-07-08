function main() {
  let machineValue = 0; // total amount in cents in the machine
  let machineDisplay = document.querySelector("#display");
  let selectedItem = null;

  function DEBUG_STRING() {
    return `
      machineValue ${machineValue}
      machineDisplay ${machineDisplay}
      selectedItem ${selectedItem}
      `;
  }

  function updateMachineCreditDisplay(amount) {
    machineDisplay.querySelector("#amount").textContent = `$ ${(amount / 100.0).toFixed(2)}`;
  }

  function updateMachineItemDisplay(name) {
    machineDisplay.querySelector("#selected-item").textContent = name;
  }

  function updateMachineCreditItemDisplay(amount, name) {
    updateMachineCreditDisplay(amount);
    updateMachineItemDisplay(name);
  }

  function resetMachineCreditDisplay() {
    updateMachineCreditDisplay(0);
  }

  function resetMachineItemDisplay() {
    updateMachineItemDisplay("SELECT AN ITEM");
  }

  function resetMachineCreditItemDisplay() {
    resetMachineCreditDisplay();
    resetMachineItemDisplay();
  }

  function machineDisplayTimedReset(mSec = 1000) {
    setTimeout(resetMachineCreditItemDisplay, mSec);
  }

  function updateItemStock(element, num) {
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

  function dispenseWhenReady() {
    if (!selectedItem) { return; }
    const ITEM_COST = selectedItem.dataset.itemCost;
    const ITEM_STOCK = selectedItem.dataset.itemStock;

    // Dispense if has stock and macine value >= item cost
    if (0 < ITEM_STOCK && ITEM_COST <= machineValue) {
      machineValue -= ITEM_COST;
      updateItemStock(selectedItem, ITEM_STOCK - 1);
      selectedItem = undefined;

      // Fade out feature
      const DISPLAY_CHILDREN = Array.from(machineDisplay.childNodes);

      let fadeElement = document.createElement('span');
      fadeElement.textContent = "Dispensing Product";
      fadeElement.classList.add("fade-out");
      machineDisplay.replaceChildren(fadeElement);

      // Restore display
      setTimeout(function () {
        machineDisplay.replaceChildren(...DISPLAY_CHILDREN);
        updateMachineCreditDisplay(machineValue);
        resetMachineItemDisplay();
      }, 3000);
    }
  }

  function itemSelected(element) {
    element = getItemButtonElement(element);
    selectedItem = element;
    const ITEM_NAME = selectedItem.dataset.itemName;
    const ITEM_COST = selectedItem.dataset.itemCost;
    updateMachineCreditItemDisplay(machineValue - ITEM_COST, ITEM_NAME);
    dispenseWhenReady(selectedItem);
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

      // OnClick Event
      button.addEventListener("click", function (event) {
        machineValue += parseInt(button.dataset.amount);
        let toDisplayAmount = machineValue - (selectedItem ? selectedItem.dataset.itemCost : 0);
        updateMachineCreditDisplay(toDisplayAmount);
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

      // OnClick Event
      button.addEventListener("click", function (event) {
        if (selectedItem) return; // ignore if previously an item was selected
        itemSelected(event.target);
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