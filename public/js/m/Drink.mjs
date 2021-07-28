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
import {isNonEmptyString, isIntegerOrIntegerString, handleUserMessage} from "../../lib/util.mjs";

//The class Drink
class Drink {
    constructor({dId, title, description}) {
        // assign properties by invoking implicit setters
        this.dId = dId;
        this.title = title;
        this.description = description;
    };

//-- Id -----------------------------------------------------------------------------------------------------------------

    get dId() {
        return this._dId;
    }
  // all basic constraints of the isbn attribute
  static checkDId( did) {
    if (!did) return new NoConstraintViolation();
    else if (typeof( did) !== "string" || did.trim() === "") {
      return new RangeConstraintViolation("The ID must be a non-empty string!");
    } else if (!isIntegerOrIntegerString(did) || parseInt(did) < 0) { // 0 is allow for testing Security Rules
        return new PatternConstraintViolation("The ID should consists only positive digits!");
    }else {
      return new NoConstraintViolation();
    }
  };

  // mandatory value and uniqueness constraints
  static async checkIdAsId(did) {
    let validationResult = Drink.checkDId( did);
    if ((validationResult instanceof NoConstraintViolation)) {
      if (!did) {
        validationResult = new MandatoryValueConstraintViolation(
          "A value for the ID must be provided!");
      } else {
        let DocSn = await db.collection("Drink").doc( did).get();
        if (DocSn.exists) {
          validationResult = new UniquenessConstraintViolation(
             "There is already a drink with this ID!");
        } else {
          validationResult = new NoConstraintViolation();
        }
      }
    }
    return validationResult;
  };
  set dId( n) {
    const validationResult = Drink.checkDId( n);
    if (validationResult instanceof NoConstraintViolation) {
      this._dId = n;
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
        const validationResult = Drink.checkTitle(t);
        if (validationResult instanceof NoConstraintViolation) {
            this._title = t;
        } else {
            throw validationResult;
        }
    }

//-- Description -----------------------------------------------------------------------------------------------------------

    get description() {
        return this._description;
    }

    static checkDescription(d) {
        if (!d) {
            return new MandatoryValueConstraintViolation("A title must be provided!");
        } else if (!isNonEmptyString(d)) {
            return new RangeConstraintViolation("The title must be a non-empty string!");
        } else if (d.length > 120) {
            return new StringLengthConstraintViolation("The title must be not longer than 120 characters!");
        } else {
            return new NoConstraintViolation();
        }
    }

    set description(d) {
        const validationResult = Drink.checkDescription(d);
        if (validationResult instanceof NoConstraintViolation) {
            this._description = d;
        } else {
            throw validationResult;
        }
    }
}

//-- Class-level ("static") storage management methods -----------------------------------------------------------------

Drink.converter = {
    toFirestore: function (drink) {
        return {
            dId: drink.dId,
            title: drink.title,
            description: drink.description,
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data( options);
        return new Drink( data);
    },
};

Drink.add = async function (slots) {
    var drink = null;
    try {
        drink = new Drink (slots);
        // invoke asynchronous ID/uniqueness check
        let validationResult = await Drink.checkIdAsId( drink.dId);
        if (!validationResult instanceof NoConstraintViolation) {
            throw validationResult;
        }
    } catch (e) {
        console.error(`${e.constructor.name}: ${e.message}`);
        drink = null;
    }
    if (drink) {
        try {
            const DocRef = db.collection("Drink").doc( drink.dId);
            await DocRef.withConverter( Drink.converter).set( drink);
            console.log(`Drink "${drink.dId}" created!`);
        } catch (e) {
            console.error(`Error when adding drink: ${e}`);
        }
    }
};

Drink.retrieve = async function (did) {
    try {
        const object = (await db.collection("Drink").doc( did)
            .withConverter( Drink.converter).get()).data();
        console.log(`Drink "${object.dId}" retrieved.`);
        return object;
    } catch( e) {
        console.error(`Error when retrieving drink: ${e}`);
    }
};

Drink.retrieveAll = async function (slots) {
    let CollRef = db.collection("Drink");
    try {
        if (slots) CollRef = CollRef.orderBy( slots);
        const objects = (await CollRef.withConverter( Drink.converter)
            .get()).docs.map( d => d.data());
        console.log(`${objects.length} drinks retrieved ${slots ? "ordered by " + slots : ""}`);
        return objects;
    } catch (e) {
        console.error(`Error retrieving drinks: ${e}`);
    }
};
Drink.update = async function (slots) {
    const updatedSlots = {};
    let validationResult = null,
        object = null,
        DocRef = null;
    try {
        // retrieve up-to-date drink
        DocRef = db.collection("Drink").doc(slots.dId);
        const objectDocSn = await DocRef.withConverter(Drink.converter).get();
        object = objectDocSn.data();
    } catch (e) {
        console.error(`${e.constructor.name}: ${e.message}`);
    }
    try {
        if (object.title !== slots.title) {
            validationResult = Drink.checkTitle( slots.title);
            if (validationResult instanceof NoConstraintViolation) {
                updatedSlots.title = slots.title;
            } else {
                throw validationResult;
            }
        }
        if (object.description !== slots.description) {
            validationResult = Drink.checkDescription( slots.description);
            if (validationResult instanceof NoConstraintViolation) {
                updatedSlots.description = slots.description;
            } else {
                throw validationResult;
            }
        }
    } catch (e) {
        console.error(`${e.constructor.name}: ${e.message}`);
    }
    let updatedProperties = Object.keys( updatedSlots);
    if (updatedProperties.length > 0) {
        // update drink
        await DocRef.update( updatedSlots);
        console.log(`Property(ies) "${updatedProperties.toString()}" modified for drink "${slots.dId}"`);
    } else {
        console.log(`No property value changed for drink "${slots.dId}"!`);
    }
};


Drink.destroy = async function (dId) {
    try {
        await db.collection("Drink").doc( dId).delete();
        console.log(`Drink ${dId} deleted!`);
    } catch( e) {
        console.error(`Error when deleting drink: ${e}`);
    }
};

Drink.generateTestData = async function() {
    try {
        console.log('Generating test data...');
        const response = await fetch( "../../test-data/drinks.json");
        const objects = await response.json();
        await Promise.all( objects.map( d => Drink.add( d)));
        console.log(`${objects.length} drinks saved.`);
    } catch (e) {
        console.error(`${e.constructor.name}: ${e.message}`);
    }
};


// Clear test data
Drink.clearData = async function () {
    if (confirm("Do you really want to delete all drinks?")) {
        console.log('Clearing test data...');
        let CollRef = db.collection("Drink");
        try {
            const DocSns = (await CollRef.withConverter( Drink.converter)
                .get()).docs;
            await Promise.all( DocSns.map( d => Drink.destroy( d.id)));
            console.log(`${DocSns.length} drinks deleted.`);
        } catch (e) {
            console.error(`${e.constructor.name}: ${e.message}`);
        }
    }
};

Drink.syncDBwithUI = async function (did) {
    try {
        let DocRef = db.collection("Drink").doc( did);
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
};

export default Drink;
