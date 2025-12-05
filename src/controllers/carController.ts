import { Request, Response } from 'express';
import { prisma } from "../prisma.js";

/* The following code stems from a codealong. It's JavaScript.
Heinz updated the instructions on Moodle (https://moodle.techcollege.dk/course/section.php?id=282545) after giving up on using Prisma 7. The instructions are now for TypeScript, which is a superset of JavaScript acc. to various online sources, incl. https://stackoverflow.com/questions/29918324/is-typescript-really-a-superset-of-javascript 
"A superset is a language that includes all of the features of another language, as well as additional features. (...)
TypeScript adds functionality to JavaScript, including:
Early error detection (...)
Code consistency (...)
Scalability (...)
Tooling (...)
Your TypeScript is compiled into JavaScript so that your browser can parse it."
https://www.epicweb.dev/what-is-a-superset-in-programming
*/
/**
 * Method Create Record
 * @param req 
 * @param res 
 * @returns Object
Source of comment: https://github.com/Webudvikler-TechCollege/H1WE080125-dsi-codealong/blob/main/src/controllers/carController.ts
 */
export const createRecordByMariePierreLessard = async (req: Request, res: Response) => {
    // console.log(1234);
    /* The following works:
    console.log(req.body);
    res.send("Du har kaldt car med en POST-metode.");
    */
    console.log(req.body);

    /* The id field is excluded from the deconstructing assignment because it is populated automatically by the database according to what Heinz said in the codealong.
    I am excluding the createdOn field (from my exercise) because it should also be populated automatically with the default value.
    I could have excluded updatedOn for the sake of logic. However, it was good to experiment with dates. There was sth to learn.
    */
    /* The following works after entering the field names under Body > x-www-form-urlencoded in Postman (otherwise, the properties are said to be undefined since there is no request from an actual form):  */
    /* My exercises in V4 did NOT establish relationships between tables. I am not keeping that version in comments, just in a separate folder. */
    const { category_id, brand_id, make, model, year, trimLevel, generation, price, used, createdOn, updatedOn } = req.body;
    //console.log(category);

    if (!category_id || !brand_id || !make || !model || !year || !trimLevel || !generation || !price || !used || !createdOn || !updatedOn) {
        return res.status(400).json({ error: "Alle felter skal udfyldes." });
    };

    try {
        const data = await prisma.car.create({
            data: {
                /* Adding the field id here hinders the creation of a record in the db and does not help return the id 
                so that it can be used in some other function. 
                id,
                */
                category_id: Number(category_id),
                brand_id: Number(brand_id),
                make,
                model,
                /* When testing with Postman, everything coming to the API is a string, so it is necessary to convert to a JS data type. 
                Even though MySQL database uses format YYYY-MM-DD HH:MM:SS for dates, the JS data type doesn't need to be converted to that.
                Heinz thinks Prisma takes care of the conversion.
                */
                year: Number(year),
                trimLevel,
                generation,
                price: Number(price),
                used: Boolean(used),
                createdOn: new Date(createdOn),
                /* Normalisation rules (normal forms)
                There are rules in database design acc. to which: 
                - data should not be repeated;
                - no field should be empty. 
                This is to reduce errors (e.g. typos) and keep database size down. 
                For instance, a relation can be created to a table that contains the options in a select menu in a form that populates the database. 
                If some fields are optional, they should be in a table where rows only get created if the field is populated. 
                Exceptions are often made for names (first and last) and addresses, but there can be separate tables for city names, which can be automatically provided when users give their postal code, for instance. */
                updatedOn: new Date(updatedOn)
            }
        });

        /* Codealong said: 
        BUT this does not return the id of the newly created record, only the properties of the data object declared above.
        return res.status(201).json(data);
        */
        /* The following doesn't work. Nothing is returned even though a new record is created.
        return res.status(201).json();
        */
        /* Solution:
        "In Prisma when you're creating a record using the create method it returns the newly created data along with all it's fields as a object. So after creating it you can access the newly created records id from there. (...)
        Wakil Ahmed (...)
        const bundleId = bundle.id"
        https://stackoverflow.com/questions/77653608/using-prisma-how-to-get-the-newly-created-records-idpk
        */

        /* The following does return the id of the newly created record, but not inside of the data object.
        data is the key, and the value only contains the fields in the object above. 
        const dataIdByMariePierreLessard = data.id;
        console.log(dataIdByMariePierreLessard);
        const dataWithIdByMariePierreLessard = {
            dataIdByMariePierreLessard,
            data
        };
        return res.status(201).json(dataWithIdByMariePierreLessard);
        */

        /* I thought of the following myself instead of data.id as recommended on Stackoverflow. */
        const dataWithIdByMariePierreLessard = {
            id: data.id,
            category_id,
            brand_id,
            make,
            model,
            year,
            trimLevel,
            generation,
            price,
            used,
            createdOn,
            updatedOn
       };
       console.log(dataWithIdByMariePierreLessard); //It works.
       return res.status(201).json(dataWithIdByMariePierreLessard);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Noget gik galt på serveren." });
    };
};

/**
 * Method Get Records
 * @param req 
 * @param res 
 * @returns Array
 Source of comment: https://github.com/Webudvikler-TechCollege/H1WE080125-dsi-codealong/blob/main/src/controllers/carController.ts
 */
export const getRecordsByMariePierreLessard = async (req: Request, res: Response) => {
    try {
        /* "prisma.car.findMany() bruges til at hente alle rækker fra tabellen Car."
        https://moodle.techcollege.dk/course/section.php?id=282542 
        Even though the spelling is Car in file schema.prisma, the following does not work unless the majuscule is dropped. */
        const data = await prisma.car.findMany({
            select: {
                id: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                        /* I left out createdOn and updatedOn. */
                    }
                },
                brand: {
                    select: {
                        id: true,
                        name: true,
                        logo: true
                        /* I left out createdOn and updatedOn. */
                    }
                },
                make: true,
                model: true,
                year: true,
                trimLevel: true,
                generation: true,
                price: true,
                carFuelRels: true,
                used: true
                /* I left out createdOn and updatedOn. */
            },
            orderBy: {
                price: "desc"
            }
        });
        console.log("The car controller is returning: ", data);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send(`DB Fejl: Kunne ikke hente liste af biler`);
    };
};

/**
 * Method Get Record
 * @param req 
 * @param res 
 * @returns Object
Source of comment: https://github.com/Webudvikler-TechCollege/H1WE080125-dsi-codealong/blob/main/src/controllers/carController.ts
*/
export const getRecordByMariePierreLessard = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!id) {
        return res.status(400).json({ error: 'Id har ingen værdi.' });
    };

    try {
        const data = await prisma.car.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                        /* I left out createdOn and updatedOn. */
                    }
                },
                brand: {
                    select: {
                        id: true,
                        name: true,
                        logo: true
                        /* I left out createdOn and updatedOn. */
                    }
                },
                make: true,
                model: true,
                year: true,
                trimLevel: true,
                generation: true,
                price: true,
                carFuelRels: true,
                used: true
                /* I left out createdOn and updatedOn. */
            }
        });
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'DB Fejl: Kunne ikke hente bil' });
    }
};

export const updateRecordByMariePierreLessard = async (req: Request, res: Response) => {
    // Logger url parametre: console.log(req.params)
    // Logger form body: console.log(req.body)

    const id = Number(req.params.id);
    const { category_id, brand_id, make, model, year, trimLevel, generation, price, used, createdOn, updatedOn } = req.body; // Deconstruerer form body objektet

    if (!id) {
        return res.status(400).json({ error: 'Id skal have en gyldig værdi' });
    };

    if (!category_id || !brand_id || !make || !model || !year || !trimLevel || !generation || !price || !used || !createdOn || !updatedOn) {
        return res.status(400).json({ error: 'Alle felter skal udfyldes' });
    };

    try {
        const data = await prisma.car.update({
            where: { id },
            data: {
                category_id: Number(category_id),
                brand_id: Number(brand_id),
                make,
                model,
                year: Number(year),
                trimLevel,
                generation,
                price: Number(price),
                used: Boolean(used),
                createdOn: new Date(createdOn),
                updatedOn: new Date(updatedOn)
            }
        });

        return res.status(201).json(data);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Noget gik galt i serveren' });
    };
};

export const deleteRecord = async (req: Request, res: Response) => {
    //const id = Number(req.params.id)
    //console.log(id);

    const id = Number(req.params.id)

    if (!id) {
        return res.status(400).json({ error: "Id har ingen værdi." });
    };

    try {
        /* Moodle instructions said the following, and it was sufficient to make it work.
        Codealong added const data = in front of await. 
        await prisma.car.delete({
            where: { id },
        });

        res.status(200).json({ message: `Bil nr. ${id} er slettet` });
        */
        await prisma.car.delete({
            where: { id },
        });

        res.status(200).json({ message: `Bil nr. ${id} er slettet`, deletedId: id });
        /* Security issues:
        It is highly advisable to ask the user for a confirmation before deleting anything,
        but this API is basic.

        In many situations, deletions should only be performed by authorised user(s), 
        so an authentification step is also missing here.
        */
 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Kunne ikke slette bilen' });
    };
};

/* Copyright 2025, Marie-Pierre Lessard */