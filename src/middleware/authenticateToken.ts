/* The teacher wasn't there on the day of this authentication exercise, so I had to copy and paste from Moodle and do research to understand the code. */
import { Request, Response, NextFunction } from 'express'; 
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

/* The extension of an interface is TypeScript as the following source shows.
"Extending Express Request interface to include custom property
Typescript beginner here...
I'm just learning typescript and am starting by converting a simple Node Express middleware from js to ts. I'm using the npm "@types/express" definition.
The middleware adds a custom user property to the express req object (Request type) which obviously doesn't exist in the definition."
https://www.reddit.com/r/typescript/comments/sdt3yg/extending_express_request_interface_to_include/
*/
// Udvider Request-typen så vi kan gemme "user" på req-objektet
export interface AuthRequest extends Request {
    user?: any;
};

/* "Middleware functions are functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle. The next function is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware.
Middleware functions can perform the following tasks:
- Execute any code.
- Make changes to the request and the response objects.
- End the request-response cycle.
- Call the next middleware in the stack.
If the current middleware function does not end the request-response cycle, it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging. (...)
The next() function is not a part of the Node.js or Express API, but is the third argument that is passed to the middleware function. The next() function could be named anything, but by convention it is always named “next”. To avoid confusion, always use this convention."
https://expressjs.com/en/guide/writing-middleware.html 
So, the function that calls (provides arguments to) function expression authenticateToken has to indicate what the following (next) function is.
Acc. to instructions on Moodle, it is the router that calls both the middleware authenticateToken and the controller getUserProfile by separating them by a comma.
That is not the usual way of providing an argument, but that is the next function. 
*/
export const authenticateTokenByMariePierreLessard = (req: AuthRequest, res: Response, next: NextFunction) => {
    /* "The headers read-only property of the Request interface contains the Headers object associated with the request."
    https://developer.mozilla.org/en-US/docs/Web/API/Request/headers 
    "Authorization is a request header, commonly use for HTTP Basic Auth. It would be set if the server requested authorization, and the browser then prompted the user for a username/password and sent it (base64-encoded) to the server with a subsequent request."
    https://stackoverflow.com/questions/24000580/how-does-req-headers-authorization-get-set
    See also: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Authorization
    */
    const authHeader = req.headers.authorization;

    // Hvis der ikke er en Authorization-header, afvis request
    if (!authHeader) {
        /* Maybe TO DO: the instructions on Moodle and in the codealongs switched from Danish to English.
        A web site needs to indicate its language, so ideally, all messages from the API should be in the same language. 
        OR, a more interesting task: 
        it would be nice to learn how to localise an API or a web site with translations in a database. */
        return res.status(401).json({ message: 'Error 401: No token found (authorization header required)' });
    };

    // Del headeren op i to dele: "Bearer" og selve token
    /* "The split() method of String values takes a pattern and divides this string into an ordered list of substrings by searching for the pattern, puts these substrings into an array, and returns the array."
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split 
    The following split() finds spaces.
    The deconstructing assignment finds a type and a token in the string. */
    const [type, token] = authHeader.split(" ");

    // Tjek om headeren er i korrekt format
    /* That format is to be set in Postman. See instructions on Moodle. */
    if (type !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Error 401: Wrong token format' });
    };

    try {
        // Tjek og dekod token med vores hemmelige nøgle
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log(decoded);

        // Gem brugerinfo fra token på req, så routes kan bruge den
        req.user = decoded;

        // Gå videre til næste middleware/route
        return next();
    } catch (error) {
        console.error(error);
        // Token er ugyldig eller udløbet
        return res.status(401).json({ message: 'Error 401: Token is expired' });
    };
};
