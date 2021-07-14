/**
 * @fileOverview  Contains various view functions for the use case deleteDrink
 * @authors Gerd Wagner & Juan-Francisco Reyes
*/
import Drink from "../m/Drink.mjs";
import { fillSelectWithOptions } from "../../lib/util.mjs";

const objects = await Drink.retrieveAll();
const formEl = document.forms["Drink"],
    deleteButton = formEl["commit"],
    selectObjectEl = formEl["selectDrink"];

// set up the drink selection list
fillSelectWithOptions( objects, selectObjectEl,
    "dId", "title");

// Set an event handler for the delete button
deleteButton.addEventListener("click", async function () {
    const IdRef = selectObjectEl.value;
    if (!IdRef) return;
    if (confirm("Do you really want to delete this drink?")) {
        Drink.destroy(IdRef);
        // remove deleted drink from select options
        selectObjectEl.remove(selectObjectEl.selectedIndex);
    }
});
