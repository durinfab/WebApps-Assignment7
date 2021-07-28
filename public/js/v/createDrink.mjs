/**
 * @fileOverview  View methods for the use case "create drink"
 * @basics Gerd Wagner & Juan-Francisco Reyes
 * @author Manuel Bohg
 */
import Drink from "../m/Drink.mjs";
import { showProgressBar } from "../../lib/util.mjs";

const formEl = document.forms['Drink'],
    saveButton = formEl.commit;


// add event listeners for responsive validation
formEl.dId.addEventListener("input", function () {
    // do not yet check the ID constraint, only before commit
    formEl.dId.setCustomValidity( Drink.checkDId( formEl.dId.value).message);
});
formEl.title.addEventListener("input", function () {
    formEl.title.setCustomValidity( Drink.checkTitle( formEl.title.value).message);
});
formEl.description.addEventListener("input", function () {
    formEl.description.setCustomValidity( Drink.checkDescription( formEl.description.value).message);
});

  // save user input data
saveButton.addEventListener("click", async function () {
    const formEl = document.forms['Drink'];
    const slots = {
      dId: formEl.dId.value,
      title: formEl.title.value,
      description: formEl.description.value
    };

    showProgressBar( "show");
    formEl.dId.setCustomValidity(( await Drink.checkIdAsId( slots.dId)).message);
    formEl.title.setCustomValidity( Drink.checkTitle( slots.title).message);
    formEl.description.setCustomValidity( Drink.checkDescription( slots.description).message);
    if (formEl.checkValidity()) {
        Drink.add( slots);
        formEl.reset();
    }
    showProgressBar( "hide");
});
// neutralize the submit event
formEl.addEventListener("submit", function (e) {
    e.preventDefault();
});
