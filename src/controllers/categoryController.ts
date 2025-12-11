import { Request, Response } from 'express';
import { prisma } from "../prisma.js";

export const createRecordByMariePierreLessard = async (req: Request, res: Response) => {
    console.log(req.body);

    const { name, createdOn, updatedOn } = req.body;

    if (!name || !createdOn || !updatedOn) {
        return res.status(400).json({ error: "Feltet skal udfyldes." });
    };

    try {
        const data = await prisma.category.create({
            data: {
                name,
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

export const getRecordsByMariePierreLessard = async (req: Request, res: Response) => {
    try {
        /* "prisma.car.findMany() bruges til at hente alle rækker fra tabellen Car."
        https://moodle.techcollege.dk/course/section.php?id=282542 */
        const data = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                /* The following does show an array.
                This is a different way of doing it than in carController because brand and category contain more than 1 car, while each car has only 1 brand and 1 category. */
                cars: true
                /* I left out createdOn and updatedOn. */
            },
            orderBy: {
                name: "desc"
            }
        });
        console.log("The category controller is returning: ", data);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send(`DB Fejl: Kunne ikke hente liste af kategorier`);
    };
};

export const getRecordByMariePierreLessard = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!id) {
        return res.status(400).json({ error: 'Id har ingen værdi' });
    };

    try {
        const data = await prisma.category.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                name: true,
                /* The following does show an array. */
                cars: true
                /* I left out createdOn and updatedOn. */
            }
        });
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'DB Fejl: Kunne ikke hente kategori' });
    }
};

export const updateRecordByMariePierreLessard = async (req: Request, res: Response) => {
    // Logger url parametre: console.log(req.params)
    // Logger form body: console.log(req.body)

    const id = Number(req.params.id);
    const { name, createdOn, updatedOn } = req.body; // Deconstruerer form body objektet

    if (!id) {
        return res.status(400).json({ error: 'Id skal have en gyldig værdi' });
    };

    if (!name || !createdOn || !updatedOn) {
        return res.status(400).json({ error: 'Alle felter skal udfyldes' });
    };

    try {
        const data = await prisma.category.update({
            where: { id },
            data: {
                name,
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

export const deleteRecordByMariePierreLessard = async (req: Request, res: Response) => {
    //const id = Number(req.params.id)
    //console.log(id);

    const id = Number(req.params.id)

    try {
        await prisma.category.delete({
            where: { id },
        });

        res.status(200).json({ message: `Kategori nr. ${id} er slettet`, deletedId: id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Kunne ikke slette kategorien' });
    };
};

/* Copyright 2025, Marie-Pierre Lessard */