/**
 * @fileOverview  View methods for the use case "update drink"
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
import Drink from "../m/Drink.mjs";
import { fillSelectWithOptions } from "../../lib/util.mjs";

const bookRecords = await Drink.retrieveAll();

const formEl = document.forms["Drink"],
    saveButton = formEl.commit,
    selectObjectEl = formEl.selectDrink;

let cancelSyncDBwithUI = null;

fillSelectWithOptions(bookRecords, selectObjectEl, "dId", "title");
// when a drink is selected, populate the form with its data
selectObjectEl.addEventListener("change", async function () {
    const Key = selectObjectEl.value;
    if (Key) {
        // retrieve up-to-date drink
        const object = await Drink.retrieve( Key);
        for (let o of ["dId", "title", "description"]) {
            formEl[o].value = object[o] !== undefined ? object[o] : "";
            // delete custom validation error message which may have been set before
            formEl[o].setCustomValidity("");
        }
    } else {
        formEl.reset();
    }
});

selectObjectEl.addEventListener("change", async function () {
    cancelSyncDBwithUI = await Drink.syncDBwithUI( selectObjectEl.value);
});

//Add EListeners
formEl.title.addEventListener("input", function () {
    formEl.title.setCustomValidity(
        Drink.checkTitle( formEl.title.value).message);
});
formEl.description.addEventListener("input", function () {
    formEl.description.setCustomValidity(
        Drink.checkDescription( formEl.description.value).message);
});

// set an event handler for the submit/save button
saveButton.addEventListener("click", handleSaveButtonClickEvent);
// neutralize the submit event
formEl.addEventListener("submit", function (e) {
    e.preventDefault();
});

window.addEventListener("beforeunload", function () {
    cancelSyncDBwithUI();
});

async function handleSaveButtonClickEvent () {
    const formEl = document.forms["Drink"],
          selectObjectEl = formEl.selectDrink,
    IdRef = selectObjectEl.value;
    if (!IdRef) return;
    const slots = {
        dId: formEl.dId.value,
        title: formEl.title.value,
        description: formEl.description.value
    };
    // set error messages in case of constraint violations
    formEl.title.setCustomValidity( Drink.checkTitle( slots.title).message);
    formEl.description.setCustomValidity( Drink.checkDescription( slots.description).message);

    if (formEl.checkValidity()) {
        Drink.update( slots);
        // update the selection list option
        selectObjectEl.options[selectObjectEl.selectedIndex].text = slots.title;
        formEl.reset();
    }
}

