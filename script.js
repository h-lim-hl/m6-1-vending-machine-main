function main() {
  let machineValue = 0; // total amount in cents in the machine

  function getCentsAmountFromTextContext (element) {
    const CENTS_NOTATION = 1;
    const DOLLOR_NOTATION = 2;
    let notationFormat = 3;

    const TEXT = element.textContent;

    if(!text.includes("¢")) notationFormat ^= CENTS_NOTATION;
    if(!text.includes("$")) notationFormat ^= DOLLOR_NOTATION; 

    if(notationFormat == 0) {
      console.error(`Element ${element} does not have valid price tag in it's textContext`);
      return null;
    }

    let value = text.match(/\b\d*\.?\d+\b/g);

    if (value.length != 1) {
      value = parseInt(value[0]) * 100 + parseInt(value[1]); 
    } else {
      value = parseInt(value[0]);
    }

    return value;
  }

  function initInsertCoinButtons() {
    let coinButtons = document.querySelectorAll(".coin-button");
    coinButtons.forEach(function(button) {
      const label = button.textContent;
      let value = parseFloat(label.match(/\d+/));
      if(label.includes('$')) value  *= 100;
      button.dataset.amount = value;
    });
  }
  initInsertCoinButtons();
}
main();