/**
 * @fileOverview  View methods for the use case "create drink"
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.createDrink = {
  setupUserInterface: function () {
    const saveButton = document.forms['Drink'].commit;
    // set an event handler for the submit/save button
    saveButton.addEventListener("click",
      pl.v.createDrink.handleSaveButtonClickEvent);
  },
  // save user input data
  handleSaveButtonClickEvent: async function () {
    const formEl = document.forms['Drink'];
    const slots = {
      dId: formEl.dId.value,
      title: formEl.title.value,
      description: formEl.description.value
    };
    await Drink.add( slots);
    formEl.reset();
  }
};