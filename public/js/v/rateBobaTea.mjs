/**
 * @fileOverview  View methods for the use case "update drink"
 * @basics Gerd Wagner & Juan-Francisco Reyes
 * @author Manuel Bohg
 */
import BobaTea from "../m/BobaTea.mjs";
import { fillSelectWithOptions } from "../../lib/util.mjs";

const objects = await BobaTea.retrieveAll();

const formEl = document.forms["BobaTea"],
    saveButton = formEl.commit,
    selectObjectEl = formEl.selectBobaTea;


fillSelectWithOptions(objects, selectObjectEl, "tId", "title", "rating");
// when a drink is selected, populate the form with its data
selectObjectEl.addEventListener("change", async function () {
    const Key = selectObjectEl.value;
    if (Key) {
        // retrieve up-to-date drink
        const object = await BobaTea.retrieve( Key);
        for (let o of ["tId", "title"]) {
            formEl[o].value = object[o] !== undefined ? object[o] : "";
            // delete custom validation error message which may have been set before
            formEl[o].setCustomValidity("");
        }
    } else {
        formEl.reset();
    }
});

// set an event handler for the submit/save button
saveButton.addEventListener("click", handleSaveButtonClickEvent);
// neutralize the submit event
formEl.addEventListener("submit", function (e) {
    e.preventDefault();
});

async function handleSaveButtonClickEvent () {
    const formEl = document.forms["BobaTea"],
          selectObjectEl = formEl.selectBobaTea,
    IdRef = selectObjectEl.value;
    if (!IdRef) return;
    const slots = {
        tId: formEl.tId.value,
        title: formEl.title.value,
        rating: formEl.rating.value,

    };
    // set error messages in case of constraint violations
    formEl.rating.setCustomValidity( BobaTea.checkRate( slots.rating).message);

    if (formEl.checkValidity()) {
        BobaTea.update( slots);
        // update the selection list option
        selectObjectEl.options[selectObjectEl.selectedIndex].text = slots.title;
        formEl.reset();
    }
}

