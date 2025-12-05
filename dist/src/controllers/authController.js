export const getUserProfileByMariePierreLessard = async (req, res) => {
    // Hvis auth-middleware IKKE har lagt en bruger på req,
    // er brugeren ikke logget ind eller token er ugyldig
    if (!req.user) {
        return res.status(401).json({
            message: 'Error 401: User not authenticated or token is missing/invalid',
        });
    }
    ;
    // Hvis alt er OK, returnér den dekodede brugerinfo fra token
    return res.status(200).json(req.user);
};
