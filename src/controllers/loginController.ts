import { Request, Response } from 'express';
import { loginUser } from '../services/loginUser.js';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        console.log({ email, password }); //This prints the object, and variable names are shown as the keys! Good trick.

        // Simpel validering
        if (!email || !password) {
            return res.status(400).json({ message: 'Email og password er påkrævet' });
        };

        /* Else... if an email and a password exist,
        a call to the database will be made */
        const result = await loginUser(email, password);
        console.log(result);

        //user and token are returned by imported function expression loginUser (but they are called email and password above)
        return res.status(200).json({
            message: 'Login succesfuld',
            user: result.user,
            token: result.token
        });
    } catch (error: any) {
        console.error(error);
        return res.status(401).json({
            message: error.message || 'Login fejlede'
        });
    };
};
