/**
 * @fileOverview  The model class Drink with attribute definitions and storage management methods
 */


//The class Drink
class Drink {
    constructor({dId, title, description}) {
        // assign properties by invoking implicit setters
        this.dId = dId;
        this.title = title;
        this.description = description;
    }
/*
//-- Id -----------------------------------------------------------------------------------------------------------------

    get dId() {
        return this._dId;
    }

    static checkDId(dId) {

        if (typeof dId === "undefined") {
            return new NoConstraintViolation();
        } else if (!isNonEmptyString(dId)) {
            return new MandatoryValueConstraintViolation("Do not leave this field empty!");
        } else if (!isIntegerOrIntegerString(dId) || parseInt(dId) < 0) {
            return new PatternConstraintViolation("The ID should consists only positive digits!");
        } else {
            if (!dId) {
                return new MandatoryValueConstraintViolation("Do not leave this field empty!");
            } else if (Drink.instances[dId] !== undefined) {
                return new UniquenessConstraintViolation("This id already exists!");
            } else {
                return new NoConstraintViolation();
            }
        }
    };

    set dId(dId) {
        const validationResult = Drink.checkDId(dId);
        if (validationResult instanceof NoConstraintViolation) {
            this._dId = dId;
        } else {
            throw validationResult;
        }
    }

//-- Title -----------------------------------------------------------------------------------------------------------

    get title() {
        return this._title;
    }

    static checkTitle(t) {
        if (!t) {
            return new MandatoryValueConstraintViolation(
                "A title must be provided!");
        } else if (!isNonEmptyString(t)) {
            return new RangeConstraintViolation(
                "The title must be a non-empty string!");
        } else if (t.length > 120) {
            return new StringLengthConstraintViolation(
                "The title must be not longer than 120 characters!");
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
            return new MandatoryValueConstraintViolation(
                "A title must be provided!");
        } else if (!isNonEmptyString(d)) {
            return new RangeConstraintViolation(
                "The title must be a non-empty string!");
        } else if (d.length > 120) {
            return new StringLengthConstraintViolation(
                "The title must be not longer than 120 characters!");
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

    toString() {
        return `Drink{ 
            dId: ${this.dId}, 
            title: ${this.title},
            description: ${this.description}}`;
    }
    toJSON() {  // is invoked by JSON.stringify
        const rec = {};
        for (let p of Object.keys( this)) {
            // copy only property slots with underscore prefix
            if (p.charAt(0) === "_") {
                // remove underscore prefix
                rec[p.substr(1)] = this[p];
            }
        }
        return rec;
    }
    */
}

//-- Class-level ("static") storage management methods -----------------------------------------------------------------


Drink.add = async function (slots) {
    const CollRef = db.collection("Drink"),
        DocRef = CollRef.doc( slots.dId);
    try {
        await DocRef.set( slots);
    } catch( e) {
        console.error(`Error when adding drink: ${e}`);
        return;
    }
    console.log(`Drink record ${slots.dId} created.`);
};

Drink.retrieve = async function (did) {
    const CollRef = db.collection("Drink"),
        DocRef = CollRef.doc( did);
    var DocSnapshot=null;
    try {
        DocSnapshot = await DocRef.get();
    } catch( e) {
        console.error(`Error when retrieving drink: ${e}`);
        return null;
    }
    return DocSnapshot.data();
};

Drink.retrieveAll = async function () {
    const CollRef = db.collection("Drink");
    var QuerySnapshot=null;
    try {
        QuerySnapshot = await CollRef.get();
    } catch( e) {
        console.error(`Error when retrieving drinks: ${e}`);
        return null;
    }
    const Docs = QuerySnapshot.docs,
        drinks = Docs.map( d => d.data());
    console.log(`${drinks.length} drinks retrieved.`);
    return drinks;
};
Drink.update = async function (slots) {
    const updSlots={};
    // retrieve up-to-date object
    const drink = await Drink.retrieve( slots.dId);
    // update only those slots that have changed
    if (drink.title !== slots.title) updSlots.title = slots.title;
    if (drink.description !== slots.description) updSlots.description = slots.description;
    if (Object.keys( updSlots).length > 0) {
        try {
            await db.collection("Drink").doc( slots.dId).update( updSlots);
        } catch( e) {
            console.error(`Error when updating drink: ${e}`);
            return;
        }
        console.log(`Drink ${slots.dId} modified.`);
    }
};

Drink.destroy = async function (dId) {
    try {
        await db.collection("Drink").doc( dId).delete();
    } catch( e) {
        console.error(`Error when deleting Drink: ${e}`);
        return;
    }
    console.log(`Drink ${dId} deleted.`);
};

Drink.generateTestData = async function () {
    if (confirm("Do you really want to overwrite all existing drinks?")) {
    let drinks = [
        {
            dId: "1",
            title: "Water",
            description: "Fresh Water"
        },
        {
            dId: "2",
            title: "Green Tea",
            description: "Healthy and tasty"
        },
        {
            dId: "3",
            title: "Milk",
            description: "From the best cows of the region"
        }
    ];

    // save all objects
    await Promise.all( drinks.map(
        drink => db.collection("Drink").doc( drink.dId).set( drink)
    ))};
    console.log(`${Object.keys( drinks).length} drinks saved.`);
};
// Clear test data
Drink.clearData = async function () {
    if (confirm("Do you really want to delete all drinks?")) {
        // retrieve all objects documents from Firestore
        const drinks = await Drink.retrieveAll();
        // delete all documents
        await Promise.all( drinks.map(
            drink => db.collection("Drink").doc( drink.dId).delete()));
        // ... and then report that they have been deleted
        console.log(`${Object.values( drinks).length} drinks deleted.`);
    }
};

//export default Drink;
