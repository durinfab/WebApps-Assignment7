/**
 * @fileOverview  Contains various view functions for the use case deleteDrink
 * @authors Gerd Wagner & Juan-Francisco Reyes
*/
pl.v.deleteDrink = {
  setupUserInterface: async function () {
    const formEl = document.forms["Drink"],
          deleteButton = formEl.commit,
          selectObject = formEl.selectDrink;
    // load all drinks
    const objects = await Drink.retrieveAll();
    for (const object of objects) {
      const optionEl = document.createElement("option");
      optionEl.text = object.title;
      optionEl.value = object.dId;
      selectObject.add( optionEl, null);
    }
    // Set an event handler for the submit/delete button
    deleteButton.addEventListener("click",
        pl.v.deleteDrink.handleDeleteButtonClickEvent);
  },
  // Event handler for deleting a object
  handleDeleteButtonClickEvent: async function () {
    const selectObjectEl = document.forms['Drink'].selectDrink;
    const id = selectObjectEl.value;
    if (id) {
      await Drink.destroy( id);
      // remove deleted drink from select options
      selectObjectEl.remove( selectObjectEl.selectedIndex);
    }
  }
}