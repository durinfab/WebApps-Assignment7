/**
 * @fileOverview  View methods for the use case "create drink"
 * @basics Gerd Wagner & Juan-Francisco Reyes
 * @author Manuel Bohg
 */
import BobaTea, {BobaEL} from "../m/BobaTea.mjs";
import Drink from "../m/Drink.mjs";
import { showProgressBar, fillSelectWithOptions, createChoiceWidget} from "../../lib/util.mjs";

const objects = await Drink.retrieveAll();

const formEl = document.forms['BobaTea'],
    saveButton = formEl.commit,
    selectDrinkEl = formEl.selectDrink,
    //selectDrinkEl = formEl.querySelector("fieldset[data-bind='drink']");
    bobaFieldsetEl = formEl.querySelector("fieldset[data-bind='boba']");

fillSelectWithOptions(objects, selectDrinkEl, Drink.instances,"title");
createChoiceWidget( bobaFieldsetEl, "boba", [],
    "radio", BobaEL.labels, true);

// add event listeners for responsive validation
formEl.tId.addEventListener("input", function () {
    // do not yet check the ID constraint, only before commit
    formEl.tId.setCustomValidity( BobaTea.checkTId( formEl.tId.value).message);
});
formEl.title.addEventListener("input", function () {
    formEl.title.setCustomValidity( BobaTea.checkTitle( formEl.title.value).message);
});
bobaFieldsetEl.addEventListener("click", function () {
    formEl.boba[0].setCustomValidity(
        (!bobaFieldsetEl.getAttribute("data-value")) ?
            "A boba must be selected!":"" );
});

  // save user input data
saveButton.addEventListener("click", async function () {
    const formEl = document.forms['BobaTea'];
    const slots = {
      tId: formEl.tId.value,
      title: formEl.title.value,
        drink: selectDrinkEl.value,
        //drink: selectDrinkEl.getAttribute("data-value"),
        boba: bobaFieldsetEl.getAttribute("data-value"),
      date: new Date().toLocaleString(),
      rating: undefined,
      rateCounter: undefined
    };

    showProgressBar( "show");
    formEl.tId.setCustomValidity(( await BobaTea.checkTIdAsId( slots.tId)).message);
    formEl.title.setCustomValidity( BobaTea.checkTitle( slots.title).message);
    formEl.boba[0].setCustomValidity(
        BobaTea.checkBoba( slots.boba).message);
    if (formEl.checkValidity()) {
        BobaTea.add( slots);
        formEl.reset();
    }
    showProgressBar( "hide");
});
// neutralize the submit event
formEl.addEventListener("submit", function (e) {
    e.preventDefault();
});
