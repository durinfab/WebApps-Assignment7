/**
 * @fileOverview  Contains various view functions for the use case listDrinks
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
import Drink from "../m/Drink.mjs";
import { showProgressBar } from "../../lib/util.mjs";

const selectOrderEl = document.querySelector("main > div > div > label > select");
const tableBodyEl = document.querySelector("table#Drink > tbody");

await renderList( "dId");

selectOrderEl.addEventListener("change", async function (e) {
    // invoke list with order selected
    await renderList( e.target.value);
});

async function renderList( order) {
    tableBodyEl.innerHTML = "";
    showProgressBar( "show");
    // load all drinks using order param
    const objects = await Drink.retrieveAll( order);
    // for each drink, create a table row with a cell for each attribute
    for (let d of objects) {
        let row = tableBodyEl.insertRow();
        row.insertCell(-1).textContent = d.dId;
        row.insertCell(-1).textContent = d.title;
        row.insertCell(-1).textContent = d.description;
    }
    showProgressBar( "hide");
}
