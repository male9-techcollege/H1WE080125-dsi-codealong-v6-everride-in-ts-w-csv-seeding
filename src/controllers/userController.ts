import { Request, Response } from 'express';
import { prisma } from '../prisma.js';
import bcrypt from "bcrypt";

/**
 * Method Create Record
 * @param req 
 * @param res 
 * @returns Object
Source of comment: https://github.com/Webudvikler-TechCollege/H1WE080125-dsi-codealong/blob/main/src/controllers/carController.ts
 */
export const createRecordByMariePierreLessard = async (req: Request, res: Response) => {
    console.log(req.body);

    const { firstname, lastname, email, password, role, isActive, createdOn, updatedOn } = req.body;

    if (!firstname || !lastname || !email || !password || !role || !isActive || !createdOn || !updatedOn) {
        return res.status(400).json({ error: "Alle felter skal udfyldes." });
    };

    try {
        /* For security reasons,
        the passwords always have to be encrypted before they are saved in the database.
        The following encryption is done with the bcrypt Node.js package. */
        const hashedPassword = await bcrypt.hash(password, 10);

        const data = await prisma.user.create({
            data: {
                firstname, 
                lastname, 
                email, 
                password: hashedPassword, 
                role, 
                isActive: Boolean (isActive), 
                createdOn: new Date(createdOn),
                updatedOn: new Date(updatedOn)
            }
        });

        const dataWithIdByMariePierreLessard = {
           id: data.id,
           firstname, 
           lastname, 
           email, 
           password, 
           role, 
           isActive, 
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

/**
 * Method Get Records
 * @param req 
 * @param res 
 * @returns Array
 Source of comment: https://github.com/Webudvikler-TechCollege/H1WE080125-dsi-codealong/blob/main/src/controllers/carController.ts
 */
export const getRecordsByMariePierreLessard = async (req: Request, res: Response) => {
    try {
        const data = await prisma.user.findMany({
            select: {
                id: true,
                firstname: true, 
                lastname: true, 
                email: true, 
                password: true, 
                role: true, 
                isActive: true 
                /* I left out createdOn and updatedOn. */
            },
            orderBy: {
                lastname: "asc"
            }
        });
        console.log("The user controller is returning: ", data);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send(`DB Fejl: Kunne ikke hente liste af brugere`);
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
        const data = await prisma.user.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                password: true,
                role: true,
                isActive: true 
                /* I left out createdOn and updatedOn. */
            },
        });
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'DB Fejl: Kunne ikke hente brugeren' });
    }
};

export const updateRecordByMariePierreLessard = async (req: Request, res: Response) => {

    const id = Number(req.params.id);
    /* In order to avoid a double encryption, we are leaving out the password field. 
    The password will have to be updated separately. 
    A double encryption is an encryption of sth already encryted. This event makes the password unusable since it is very difficult or impossible to restore it. */
    const { firstname, lastname, email, role, isActive, createdOn, updatedOn } = req.body; 

    if (!id) {
        return res.status(400).json({ error: 'Id skal have en gyldig værdi' });
    };

    if (!firstname || !lastname || !email || !role || !isActive || !createdOn || !updatedOn) {
        return res.status(400).json({ error: 'Alle felter skal udfyldes' });
    };

    try {
        const data = await prisma.user.update({
            where: { id },
            data: {
                firstname,
                lastname,
                email,
                role,
                isActive: Boolean (isActive),
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

    const id = Number(req.params.id)

    if (!id) {
        return res.status(400).json({ error: "Id har ingen værdi." });
    };

    try {
        await prisma.user.delete({
            where: { id },
        });

        res.status(200).json({ message: `Bruger nr. ${id} er slettet`, deletedId: id });
 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Kunne ikke slette brugeren' });
    };
};

/* Copyright 2025, Marie-Pierre Lessard */