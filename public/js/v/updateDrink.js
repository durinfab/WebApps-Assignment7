/**
 * @fileOverview  View methods for the use case "update drink"
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.updateDrink = {
  setupUserInterface: async function () {
    const formEl = document.forms["Drink"],
          updateButton = formEl.commit,
          selectObjectEl = formEl.selectDrink;
    // load all objects
    const objects = await Drink.retrieveAll();
    for (const drink of objects) {
      const optionEl = document.createElement("option");
      optionEl.text = drink.title;
      optionEl.value = drink.dId;
      selectObjectEl.add( optionEl, null);
    }
    // when a object is selected, fill the form with its data
    selectObjectEl.addEventListener("change", async function () {
      const id = selectObjectEl.value;
      if (id) {
        // retrieve up-to-date object
        const object = await Drink.retrieve( id);
        formEl.dId.value = object.dId;
        formEl.title.value = object.title;
        formEl.description.value = object.description;
      } else {
        formEl.reset();
      }
    });
    // set an event handler for the submit/save button
    updateButton.addEventListener("click",
        pl.v.updateDrink.handleSaveButtonClickEvent);
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
    });
  },
  // save data
  handleSaveButtonClickEvent: async function () {
    const formEl = document.forms["Drink"],
          selectObjectEl = formEl.selectDrink;
    const slots = {
      dId: formEl.dId.value,
      title: formEl.title.value,
      description: formEl.description.value
    };
    await Drink.update( slots);
    // update the selection list option element
    selectObjectEl.options[selectObjectEl.selectedIndex].text = slots.title;
    formEl.reset();
  }
};