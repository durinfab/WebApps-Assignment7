/**
 * @fileOverview  Defines utility procedures/functions
 * @author Gerd Wagner and Juan-Francisco Reyes
 * @editor Manuel Bohg
 */

/**
 * Verifies if a value represents an integer
 * @param {string} x
 * @return {boolean}
 */
function isNonEmptyString( x) {
  return typeof (x) === "string" && x.trim() !== "";
}

/**
 * Return the next year value (e.g. if now is 2013 the function will return 2014)
 * @return {number}  the integer representing the next year value
 */
function nextYear() {
  const date = new Date();
  return (date.getFullYear() + 1);
}

/**
 * Verifies if a value represents an integer or integer string
 * @param {string} x
 * @return {boolean}
 */
function isIntegerOrIntegerString( x) {
  return typeof (x) === "number" && x.toString().search(/^-?[0-9]+$/) === 0 ||
    typeof (x) === "string" && x.search(/^-?[0-9]+$/) === 0;
}
function isNumberOrNumberString(x) {
    return typeof(x) === "number" && Number.is(x) ||
        typeof(x) === "string" && parseFloat(x) !== undefined;
}

/**
 * Creates a typed "data clone" of an object
 * @param {object} obj
 */
function cloneObject( obj) {
  const clone = Object.create(Object.getPrototypeOf(obj));
  for (let p in obj) {
    if (obj.hasOwnProperty(p) && typeof obj[p] !== "object") {
      clone[p] = obj[p];
    }
  }
  return clone;
}
/** Create option elements from a map of objects
 * and insert them into a selection list element
 *
 * @param {object} objColl  A collection (list or map) of objects
 * @param {object} selEl  A select(ion list) element
 * @param {string} stdIdProp  The standard identifier property
 * @param {string} displayProp [optional]  A property supplying the text
 *                 to be displayed for each object
 */
function fillSelectWithOptions( objColl, selEl, stdIdProp, displayProp) {
  if (Array.isArray(objColl)) {
    for (let obj of objColl) {
      const optionEl = document.createElement("option");
      optionEl.value = obj[stdIdProp];
      optionEl.text = displayProp ? obj[displayProp] : obj[stdIdProp];
      selEl.add(optionEl, null)
    }
  } else {
    for (let key of Object.keys( objColl)) {
      const obj = objColl[key];
      const optionEl = document.createElement("option");
      optionEl.value = obj[stdIdProp];
      optionEl.text = displayProp ? obj[displayProp] : obj[stdIdProp];
      selEl.add(optionEl, null)
    }
  }
}
/**
 * Show or hide progress bar element
 * @param {string} status
 */
function showProgressBar (status) {
  let progressEl = document.querySelector( 'progress');
  if (status === "show") progressEl.hidden = false;
  if (status === "hide") progressEl.hidden = true;
}

function parseDate(date) {
    return (date instanceof Date)? date: new Date(date);
}

function handleUserMessage (status, data) {
    const userMessageContainerEl = document.querySelector(".user-message"),
        errorMessage = userMessageContainerEl.querySelector("div"),
        buttonEl = document.createElement("button");
    let msgText = `The selected drink ${JSON.stringify(data)} has been ${status}.
\nPlease reload this page to continue `;
    // display user message
    userMessageContainerEl.innerHTML = "";
    errorMessage.textContent = msgText;
    buttonEl.setAttribute("type", "button");
    buttonEl.textContent = "Reload";
    errorMessage.appendChild( buttonEl);
    userMessageContainerEl.appendChild( errorMessage);
    userMessageContainerEl.hidden = false;
    // add listener to reload button
    buttonEl.addEventListener( "click", function () {
        location.reload();
    })
}

function createLabeledChoiceControl( t,n,v,lbl) {
    var ccEl = document.createElement("input"),
        lblEl = document.createElement("label");
    ccEl.type = t;
    ccEl.name = n;
    ccEl.value = v;
    lblEl.appendChild( ccEl);
    lblEl.appendChild( document.createTextNode( lbl));
    return lblEl;
}

function createChoiceWidget( containerEl, fld, values,
                             choiceWidgetType, choiceItems, isMandatory) {
    const choiceControls = containerEl.querySelectorAll("label");
    // remove old content
    for (const j of choiceControls.keys()) {
        containerEl.removeChild( choiceControls[j]);
    }
    if (!containerEl.hasAttribute("data-bind")) {
        containerEl.setAttribute("data-bind", fld);
    }
    // for a mandatory radio button group initialze to first value
    if (choiceWidgetType === "radio" && isMandatory && values.length === 0) {
        values[0] = 1;
    }
    if (values.length >= 1) {
        if (choiceWidgetType === "radio") {
            containerEl.setAttribute("data-value", values[0]);
        } else {  // checkboxes
            containerEl.setAttribute("data-value", "["+ values.join() +"]");
        }
    }
    for (const j of choiceItems.keys()) {
        // button values = 1..n
        const el = createLabeledChoiceControl( choiceWidgetType, fld,
            j+1, choiceItems[j]);
        // mark the radio button or checkbox as selected/checked
        if (values.includes(j+1)) el.firstElementChild.checked = true;
        containerEl.appendChild( el);
        el.firstElementChild.addEventListener("click", function (e) {
            const btnEl = e.target;
            if (choiceWidgetType === "radio") {
                if (containerEl.getAttribute("data-value") !== btnEl.value) {
                    containerEl.setAttribute("data-value", btnEl.value);
                } else if (!isMandatory) {
                    // turn off radio button
                    btnEl.checked = false;
                    containerEl.setAttribute("data-value", "");
                }
            } else {  // checkbox
                let values = JSON.parse( containerEl.getAttribute("data-value")) || [];
                let i = values.indexOf( parseInt( btnEl.value));
                if (i > -1) {
                    values.splice(i, 1);  // delete from value list
                } else {  // add to value list
                    values.push( btnEl.value);
                }
                containerEl.setAttribute("data-value", "["+ values.join() +"]");
            }
        });
    }
    return containerEl;
}

function createPushButton( txt) {
    var pB = document.createElement("button");
    pB.type = "button";
    if (txt) pB.textContent = txt;
    return pB;
}

function addItemToListOfSelectedItems( listEl, stdId, humanReadableId, classValue) {
    var el=null;
    const listItemEl = document.createElement("li");
    listItemEl.setAttribute("data-value", stdId);
    el = document.createElement("span");
    el.textContent = humanReadableId;
    listItemEl.appendChild( el);
    el = createPushButton("✕");
    listItemEl.appendChild( el);
    if (classValue) listItemEl.classList.add( classValue);
    listEl.appendChild( listItemEl);
}

function createMultiSelectionWidget(widgetContainerEl, selectionRange,
                                    inputTextId, placeholder, minCard) {
    const selectedItemsListEl = document.createElement("ul");
    let el = null;
    if (!minCard) minCard = 0;  // default
    widgetContainerEl.innerHTML = ""; // delete old contents
    // event handler for removing an item from the selection
    selectedItemsListEl.addEventListener( 'click', function (e) {
        if (e.target.tagName === "BUTTON") {  // delete/undo button was clicked
            const btnEl = e.target,
                listItemEl = btnEl.parentNode;
            let listEl = listItemEl.parentNode;
            if (listEl.children.length <= minCard) {
                alert(`A record must have at least one item associated!`);
                return;
            }
            if (listItemEl.classList.contains("removed")) {
                // undoing a previous removal
                listItemEl.classList.remove("removed");
                // change button text
                btnEl.textContent = "✕";
            } else if (listItemEl.classList.contains("added")) {
                // removing a previously added item means moving it back to the selection range
                listItemEl.parentNode.removeChild( listItemEl);
            } else {
                // removing an ordinary item
                listItemEl.classList.add("removed");
                // change button text
                btnEl.textContent = "undo";
            }
        }
    });
    for (const authorId of selectionRange) {
        addItemToListOfSelectedItems( selectedItemsListEl, authorId,
            `> ${authorId}`);
    }
    // embed input text field
    const spanEl = document.querySelector(`label[for="${inputTextId}"] > span`);
    spanEl.innerHTML = "";
    const inputEl = document.createElement("input");
    inputEl.setAttribute("size", "15") ;
    inputEl.setAttribute("placeholder", placeholder);
    inputEl.setAttribute("name",inputTextId)
    widgetContainerEl.appendChild( selectedItemsListEl);
    spanEl.appendChild( inputEl);
    const addButton = createPushButton("add")
    spanEl.appendChild( addButton);
    let enteredValues = selectionRange.length > 0 ? [] : selectionRange;
    // event handler for moving an item from the input text to the selected items list
    addButton.parentNode.addEventListener( 'click', function (e) {
        if (e.target.tagName === "BUTTON") {  // add button was clicked
            if (inputEl.value) {
                if (selectionRange.includes( parseInt( inputEl.value))) { // check uniqueness
                    alert(`There is an item entered with the same value: ${inputEl.value}`);
                } else if (isNaN( +inputEl.value)) { // check only numbers
                    alert(`Only numbers can be entered`);
                } else { // add item
                    addItemToListOfSelectedItems( selectedItemsListEl, inputEl.value,
                        `> ${inputEl.value}`, "added");
                    inputEl.value = "";
                }
            }
            inputEl.value = "";
            inputEl.focus();
        }
    });
}

export { isNonEmptyString, nextYear, isIntegerOrIntegerString, createChoiceWidget, createMultiSelectionWidget,
  cloneObject, fillSelectWithOptions, showProgressBar, handleUserMessage, isNumberOrNumberString };
