/**
 * @fileOverview  Contains various view functions for the use case listBobaTeas
 * @basics Gerd Wagner & Juan-Francisco Reyes
 * @author Manuel Bohg
 */
import BobaTea, {BobaEL} from "../m/BobaTea.mjs";
import { showProgressBar } from "../../lib/util.mjs";

const selectOrderEl = document.querySelector("main > div > div > label > select");
const tableBodyEl = document.querySelector("table#BobaTea > tbody");

await renderList( "tId");

selectOrderEl.addEventListener("change", async function (e) {
    // invoke list with order selected
    await renderList( e.target.value);
});

async function renderList( order) {
    tableBodyEl.innerHTML = "";
    showProgressBar( "show");
    // load all BobaTeas using order param
    const objects = await BobaTea.retrieveAll( order);
    // for each BobaTea, create a table row with a cell for each attribute
    for (let t of objects) {
        let row = tableBodyEl.insertRow();
        row.insertCell(-1).textContent = t.tId;
        row.insertCell(-1).textContent = t.title;
        row.insertCell(-1).textContent = t.drink;
        row.insertCell(-1).textContent = BobaEL.labels[t.boba - 1];
        row.insertCell(-1).textContent = t.date;
        row.insertCell(-1).textContent = cuteRate((parseFloat(t.rating).toFixed(2)).toString());
        row.insertCell(-1).textContent = t.rateCounter
        ;
    }
    showProgressBar( "hide");
}

function cuteRate(rate) {
    if (rate.lastIndexOf("0") === 3){
        rate = parseFloat(rate).toFixed(1).toString();
        if (rate.lastIndexOf("0") === 2){
            return parseFloat(rate).toFixed(0).toString();
        } else {
            return rate
        }
    }else{
        return rate;
    }
}