import { prisma } from "../prisma.js";
export const createRecordByMariePierreLessard = async (req, res) => {
    console.log(req.body);
    const { name, logo, createdOn, updatedOn } = req.body;
    if (!name || !logo || !createdOn || !updatedOn) {
        return res.status(400).json({ error: "Alle felter skal udfyldes." });
    }
    ;
    try {
        const data = await prisma.brand.create({
            data: {
                name,
                logo,
                createdOn: new Date(createdOn),
                updatedOn: new Date(updatedOn)
            }
        });
        /* Codealong said:
        return res.status(201).json(data);
        */
        const dataWithIdByMariePierreLessard = {
            id: data.id,
            name,
            logo,
            createdOn,
            updatedOn
        };
        console.log(dataWithIdByMariePierreLessard); //It works.
        return res.status(201).json(dataWithIdByMariePierreLessard);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Noget gik galt på serveren." });
    }
    ;
};
export const getRecordsByMariePierreLessard = async (req, res) => {
    try {
        /* "prisma.car.findMany() bruges til at hente alle rækker fra tabellen Car."
        https://moodle.techcollege.dk/course/section.php?id=282542 */
        const data = await prisma.brand.findMany({
            select: {
                id: true,
                name: true,
                logo: true,
                /* The following does show an array.
                This is a different way of doing it than in carController because brand and category contain more than 1 car, while each car has only 1 brand and 1 category. */
                cars: true
                /* I left out createdOn and updatedOn. */
            },
            orderBy: {
                name: "asc"
            }
        });
        console.log("The brand controller is returning: ", data);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`DB Fejl: Kunne ikke hente liste af brands`);
    }
    ;
};
export const getRecordByMariePierreLessard = async (req, res) => {
    const id = Number(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'Id har ingen værdi' });
    }
    ;
    try {
        const data = await prisma.brand.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                name: true,
                logo: true,
                /* The following does show an array. */
                cars: true
                /* I left out createdOn and updatedOn. */
            }
        });
        return res.status(200).json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'DB Fejl: Kunne ikke hente varemærke' });
    }
};
export const updateRecordByMariePierreLessard = async (req, res) => {
    // Logger url parametre: console.log(req.params)
    // Logger form body: console.log(req.body)
    const id = Number(req.params.id);
    const { name, logo, createdOn, updatedOn } = req.body; // Deconstruerer form body objektet
    if (!id) {
        return res.status(400).json({ error: 'Id skal have en gyldig værdi' });
    }
    ;
    if (!name || !logo || !createdOn || !updatedOn) {
        return res.status(400).json({ error: 'Alle felter skal udfyldes' });
    }
    ;
    try {
        const data = await prisma.brand.update({
            where: { id },
            data: {
                name,
                logo,
                createdOn: new Date(createdOn),
                updatedOn: new Date(updatedOn)
            }
        });
        return res.status(201).json(data);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Noget gik galt i serveren' });
    }
    ;
};
export const deleteRecordByMariePierreLessard = async (req, res) => {
    //const id = Number(req.params.id)
    //console.log(id);
    const id = Number(req.params.id);
    try {
        await prisma.brand.delete({
            where: { id },
        });
        res.status(200).json({ message: `Mærke nr. ${id} er slettet`, deletedId: id });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Kunne ikke slette mærket' });
    }
    ;
};
/* Copyright 2025, Marie-Pierre Lessard */ 
