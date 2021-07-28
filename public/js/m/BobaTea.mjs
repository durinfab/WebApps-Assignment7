/**
 * @fileOverview  The model class Drink with attribute definitions and storage management methods
 * @basics Gerd Wagner & Juan-Francisco Reyes
 * @author Manuel Bohg
 */

import {db} from "../c/initialize.mjs";
import {
    MandatoryValueConstraintViolation,
    NoConstraintViolation,
    RangeConstraintViolation,
    UniquenessConstraintViolation,
    PatternConstraintViolation,
    StringLengthConstraintViolation
} from "../../lib/errorTypes.mjs";
import {isNonEmptyString, isIntegerOrIntegerString, isNumberOrNumberString, handleUserMessage} from "../../lib/util.mjs";
import Drink from "./Drink.mjs";
import Enumeration from "../../lib/Enumeration.mjs";

const BobaEL = new Enumeration(["lemon","apple",
    "coconut","cherry"]);

//The class Drink
class BobaTea {
    constructor({tId, title, date, rating, rateCounter, drink, boba}) {
        // assign properties by invoking implicit setters
        this.tId = tId;
        this.title = title;
        this.date = date;
        if (rating) this.rating = rating;
        if (rateCounter) this.rateCounter = rateCounter;
        this.drink = drink;
        this.boba = boba;

    };

//-- Id -----------------------------------------------------------------------------------------------------------------

    get tId() {
        return this._tId;
    }
  // all basic constraints of the isbn attribute
  static checkTId( tid) {
    if (!tid) return new NoConstraintViolation();
    else if (typeof( tid) !== "string" || tid.trim() === "") {
      return new RangeConstraintViolation("The ID must be a non-empty string!");
    } else if (!isIntegerOrIntegerString(tid) || parseInt(tid) < 0) { // 0 is allow for testing Security Rules
        return new PatternConstraintViolation("The ID should consists only positive digits!");
    }else {
      return new NoConstraintViolation();
    }
  };

  // mandatory value and uniqueness constraints
  static async checkTIdAsId(tid) {
    let validationResult = BobaTea.checkTId( tid);
    if ((validationResult instanceof NoConstraintViolation)) {
      if (!tid) {
        validationResult = new MandatoryValueConstraintViolation(
          "A value for the ID must be provided!");
      } else {
        let DocSn = await db.collection("BobaTea").doc( tid).get();
        if (DocSn.exists) {
          validationResult = new UniquenessConstraintViolation(
             "There is already a bobatea with this ID!");
        } else {
          validationResult = new NoConstraintViolation();
        }
      }
    }
    return validationResult;
  };
  set tId( n) {
    const validationResult = BobaTea.checkTId( n);
    if (validationResult instanceof NoConstraintViolation) {
      this._tId = n;
    } else {
      throw validationResult;
    }
  };

//-- Title -----------------------------------------------------------------------------------------------------------
    get title() {
        return this._title;
    }

    static checkTitle(t) {
        if (!t) {
            return new MandatoryValueConstraintViolation("A title must be provided!");
        } else if (!isNonEmptyString(t)) {
            return new RangeConstraintViolation("The title must be a non-empty string!");
        } else if (t.length > 120) {
            return new StringLengthConstraintViolation("The title must be not longer than 120 characters!");
        } else {
            return new NoConstraintViolation();
        }
    }

    set title(t) {
        const validationResult = BobaTea.checkTitle(t);
        if (validationResult instanceof NoConstraintViolation) {
            this._title = t;
        } else {
            throw validationResult;
        }
    }

//-- Drink --------------------------------------------------------------------------------------------------------------

    get drink() {
        return this._drink;
    };
    static async checkPublisher( did) {
        var validationResult = null;
        if (!did) {
            validationResult = new NoConstraintViolation();  // optional
        } else {
            // invoke foreign key constraint check
            validationResult = await Drink.checkIdAsId( did);
        }
        return validationResult;
    };
    set drink( d) {
        this._drink = d;
    };

//-- Boba --------------------------------------------------------------------------------------------------------------

    get boba() {
        return this._boba;
    };
    static checkBoba( b) {
        if (!b) {
            return new MandatoryValueConstraintViolation(
                "A boba must be choose!");
        } else if (!isIntegerOrIntegerString( b) || parseInt(b) < 1 ||
            parseInt( b) > BobaEL.MAX) {
            return new RangeConstraintViolation(
                `Invalid value for boba: ${b}`);
        } else {
            return new NoConstraintViolation();
        }
    };
    set boba( c) {
        const validationResult = BobaTea.checkBoba( c);
        if (validationResult instanceof NoConstraintViolation) {
            this._boba = parseInt( c);
        } else {
            throw validationResult;
        }
    };

//-- Date --------------------------------------------------------------------------------------------------------------

    get date () {
        return this._date;
    }

    set date (d) {
        this._date = d;
    }

//-- Rating --------------------------------------------------------------------------------------------------------------

    get rating () {
        return this._rating;
    }

    static checkRate(rate) {
        if (typeof rate === "undefined") {
            return new NoConstraintViolation();
        }else if (rate === "-"){
            return new MandatoryValueConstraintViolation("Please select a value!");
        } else if (!isNonEmptyString(rate)) {
            return new MandatoryValueConstraintViolation("Do not leave this field empty!");
        } else if (!isNumberOrNumberString(rate)) {
            return new PatternConstraintViolation("The ratevalue should consists only digits!");
        } else {
            if (!rate) {
                return new MandatoryValueConstraintViolation("Do not leave this field empty!");
            }
            else {
                return new NoConstraintViolation();
            }
        }
    };

    set rating(r) {
        const validationResult = BobaTea.checkRate(r);
        if (validationResult instanceof NoConstraintViolation) {
            this._rating = r;
        } else {
            throw validationResult;
        }
    }
/*    set rating(r){
        this._rating = r;
    }*/

    get rateCounter () {
        return this._rateCounter;
    }
    set rateCounter(c){
        this._rateCounter = c;
    }
}
//-- Class-level ("static") storage management methods -----------------------------------------------------------------

BobaTea.converter = {
    toFirestore: function (tea) {
        console.log(`con to F`)
        const data = {
            tId: tea.tId,
            title: tea.title,
            drink: tea.drink,
            date: tea.date,
        };
        if (tea.boba) {data.boba = tea.boba}
        if (tea.rating) {data.rating = tea.rating;} /*console.log(`rating erkannt`);} else {console.log(`rating nicht erkannt`);}*/
        if (tea.rateCounter) data.rateCounter = tea.rateCounter;
        return data;
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data( options);
        return new BobaTea( data);
    },
};

BobaTea.add = async function (slots) {
    var tea = null;
    try {
        tea = new BobaTea (slots);
        // invoke asynchronous ID/uniqueness check
        let validationResult = await BobaTea.checkTIdAsId( tea.tId);
        if (!validationResult instanceof NoConstraintViolation) {
            throw validationResult;
        }
    } catch (e) {
        console.error(`${e.constructor.name}: ${e.message}`);
        tea = null;
    }
    if (tea) {
        try {
            const DocRef = db.collection("BobaTea").doc( tea.tId);
            await DocRef.withConverter( BobaTea.converter).set( tea);
            console.log(`BobaTea "${tea.tId}" created!`);
        } catch (e) {
            console.error(`Error when adding BobaTea: ${e}`);
        }
    }
};

BobaTea.retrieve = async function (tid) {
    try {
        const object = (await db.collection("BobaTea").doc( tid)
            .withConverter( BobaTea.converter).get()).data();
        console.log(`BobaTea "${object.tId}" retrieved.`);
        return object;
    } catch( e) {
        console.error(`Error when retrieving BobaTea: ${e}`);
    }
};

BobaTea.retrieveAll = async function (slots) {
    let CollRef = db.collection("BobaTea");
    try {
        if (slots) CollRef = CollRef.orderBy( slots);
        const objects = (await CollRef.withConverter( BobaTea.converter)
            .get()).docs.map( t => t.data());
        console.log(`${objects.length} BobaTeas retrieved ${slots ? "ordered by " + slots : ""}`);
        return objects;
    } catch (e) {
        console.error(`Error retrieving BobaTeas: ${e}`);
    }
};

BobaTea.update = async function (slots) {
    const updatedSlots = {};
    let validationResult = null,
        object = null,
        DocRef = null;
    try {
        // retrieve up-to-date drink
        DocRef = db.collection("BobaTea").doc(slots.tId);
        const objectDocSn = await DocRef.withConverter(BobaTea.converter).get();
        object = objectDocSn.data();
    } catch (e) {
        console.error(`${e.constructor.name}: ${e.message}`);
    }
    try {
        if (object.rating === undefined || object.rating === "NaN") {
            console.log(`undefiniert erkannt`);
            updatedSlots.rating = slots.rating;
            console.log(`update gesetzt`);
            updatedSlots.rateCounter = "1";
            console.log(`counter gesetzt`);
        }else {
            console.log(`undefiniert nicht erkannt`);
            updatedSlots.rateCounter = (parseInt(object.rateCounter) + 1).toString();console.log(`counter gesetzt`);
            updatedSlots.rating = ((parseInt(slots.rating) + parseFloat(object.rating) * (parseInt(updatedSlots.rateCounter) - 1))
                / parseInt(updatedSlots.rateCounter)).toString();console.log(`rate gesetzt`);
        }
    } catch (e) {
        console.error(`${e.constructor.name}: ${e.message}`);
    }
    let updatedProperties = Object.keys( updatedSlots);
    if (updatedProperties.length > 0) {
        // update drink
        await DocRef.update( updatedSlots);
        console.log(`Property(ies) "${updatedProperties.toString()}" modified for drink "${slots.tId}"`);
    } else {
        console.log(`No property value changed for drink "${slots.tId}"!`);
    }
};


BobaTea.generateTestData = async function() {
    try {
        console.log('Generating test data...');
        const response = await fetch( "../../test-data/bobateas.json");
        const objects = await response.json();
        await Promise.all( objects.map( t => BobaTea.add( t)));
        console.log(`${objects.length} bobateas saved.`);
    } catch (e) {
        console.error(`${e.constructor.name}: ${e.message}`);
    }
};

BobaTea.destroy = async function (tid) {
    try {
        await db.collection("BobaTea").doc( tid).delete();
        console.log(`BobaTea ${tid} deleted!`);
    } catch( e) {
        console.error(`Error when deleting BobaTea: ${e}`);
    }
};

// Clear test data
BobaTea.clearData = async function () {
    if (confirm("Do you really want to delete all bobateas?")) {
        console.log('Clearing test data...');
        let CollRef = db.collection("BobaTea");
        try {
            const DocSns = (await CollRef.withConverter( BobaTea.converter)
                .get()).docs;
            await Promise.all( DocSns.map( t => BobaTea.destroy( t.id)));
            console.log(`${DocSns.length} BobaTeas deleted.`);
        } catch (e) {
            console.error(`${e.constructor.name}: ${e.message}`);
        }
    }
};

/*
BobaTea.syncDBwithUI = async function (tid) {
    try {
        let DocRef = db.collection("BobaTea").doc( tid);
        let originalDocSn = await DocRef.get();
        // listen document changes returning a snapshot on every change
        return DocRef.onSnapshot( objectDocSn => {
            // identify if changes are local or remote
            if (!objectDocSn.metadata.hasPendingWrites) {
                if (!objectDocSn.data()) {
                    handleUserMessage("removed", originalDocSn.data());
                } else if (!objectDocSn.isEqual( originalDocSn)) {
                    handleUserMessage("modified", objectDocSn.data());
                }
            }
        });
    } catch (e) {
        console.error(`${e.constructor.name} : ${e.message}`);
    }
}
*/

export default BobaTea;
export {BobaEL};