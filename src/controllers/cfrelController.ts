import { Request, Response } from 'express';
import { prisma } from "../prisma.js";

export const createRecordByMariePierreLessard = async (req: Request, res: Response) => {
    console.log(req.body);

    const { car_id, fuelType_id, createdOn, updatedOn } = req.body;

    if (!car_id || !fuelType_id || !createdOn || !updatedOn) {
        return res.status(400).json({ error: "Alle felter skal udfyldes." });
    };

    try {
        const data = await prisma.carFuelRel.create({
            data: {
                car_id: Number(car_id),
                fuelType_id: Number(fuelType_id),
                createdOn: new Date(createdOn),
                updatedOn: new Date(updatedOn)
            }
        });
        /* Codealong said: 
        return res.status(201).json(data);
        */

        const dataWithIdByMariePierreLessard = {
            id: data.id,
            car_id,
            fuelType_id,
            createdOn,
            updatedOn
        };
        console.log(dataWithIdByMariePierreLessard); 
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
        const data = await prisma.carFuelRel.findMany({
            select: {
                id: true,
                car_id: true,
                fuelType_id: true
                /* I left out createdOn and updatedOn. */
            },
            orderBy: {
                car_id: "asc"
            }
        });
        console.log("The car-fuel-relations controller is returning: ", data);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send(`DB Fejl: Kunne ikke hente liste af bil-drivmiddel relationer.`);
    };
};

export const getRecordByMariePierreLessard = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!id) {
        return res.status(400).json({ error: 'Id har ingen værdi' });
    };

    try {
        const data = await prisma.carFuelRel.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                car_id: true,
                fuelType_id: true
                /* I left out createdOn and updatedOn. */
            }
        });
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'DB Fejl: Kunne ikke hente bil-drivmiddel relation.' });
    }
};

export const updateRecordByMariePierreLessard = async (req: Request, res: Response) => {
    // Logger url parametre: console.log(req.params)
    // Logger form body: console.log(req.body)

    const id = Number(req.params.id);
    const { car_id, fuelType_id, createdOn, updatedOn } = req.body; // Deconstruerer form body objektet

    if (!id) {
        return res.status(400).json({ error: 'Id skal have en gyldig værdi' });
    };

    if (!car_id || !fuelType_id || !createdOn || !updatedOn) {
        return res.status(400).json({ error: 'Alle felter skal udfyldes' });
    };

    try {
        const data = await prisma.carFuelRel.update({
            where: { id },
            data: {
                car_id,
                fuelType_id,
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
        await prisma.carFuelRel.delete({
            where: { id },
        });

        res.status(200).json({ message: `Bil-drivmiddel relation nr. ${id} er slettet.`, deletedId: id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Kunne ikke slette bil-drivmiddel relation.' });
    };
};

/* Copyright 2025, Marie-Pierre Lessard */