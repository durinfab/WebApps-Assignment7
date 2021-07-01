/**
 * @fileOverview  Contains various view functions for the use case listDrinks
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
pl.v.retrieveAndListAllDrinks = {
  setupUserInterface: async function () {
    const tableBodyEl = document.querySelector("table#Drinks>tbody");
    // load a list of all object from Firestore
    const object = await Drink.retrieveAll();
    // for each object, create a table row with a cell for each attribute
    for (const drink of object) {
      const row = tableBodyEl.insertRow();
      row.insertCell().textContent = drink.dId;
      row.insertCell().textContent = drink.title;
      row.insertCell().textContent = drink.description;
    }
  }
};