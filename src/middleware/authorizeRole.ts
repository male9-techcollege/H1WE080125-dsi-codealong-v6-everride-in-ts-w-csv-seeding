/* The teacher wasn't there on the day of this authentication exercise, so I had to copy and paste from Moodle. */
import { Response, NextFunction } from 'express';
import { AuthRequest } from './authenticateToken.js';

// Funktionen kan kaldes med en eller flere roller som parameter
export const authoriseRoleByMariePierreLessard = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = req.user;

        // Hvis authenticate ikke har sat user
        if (!user) {
            return res.status(401).json({ message: 'Error 401: You are not logged in' });
        };

        // Hvis der ikke er sat nogen roller, så giv bare adgang
        if (allowedRoles.length === 0) {
            return next();
        };

        // Tjek om brugerens role er en af de tilladte
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: 'Error 403: You do not have permissions to access this url' });
        };

        // Alt ok
        return next();
    };
};