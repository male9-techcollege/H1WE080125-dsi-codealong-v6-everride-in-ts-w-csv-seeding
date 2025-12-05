/* "Without a doubt I know what the controllers and models are used for. However, I am able to write code that interacts with my db, for example adding users to a table, on either the controller or model. At what times should I write code in the controller vs. in model? (...)
Code to access the database should be in service layer instead of keeping in Controller or Model. (...)
ASP.NET MVC and MVC, in general, is a presentation layer pattern; thus your interaction with the database should be in a layer beyond the presentation layer, usually a data-access layer, but it could be a service layer or business layer as well."
https://stackoverflow.com/questions/18282795/when-should-i-write-code-in-the-controller-vs-model */
import { prisma } from '../prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
/* 'secret-key' is a fallback, to make sure that there is a string and to avoid an error if there is no key in the .env file */
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';
export const loginUser = async (email, password) => {
    console.log({ email, password });
    // 1. Find bruger i databasen
    const user = await prisma.user.findUnique({
        /* If the user is not active, it won't be returned. This way, it is not necessary to delete the user and all of his/her info. */
        where: { email, isActive: true },
        select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            password: true,
            role: true
        }
    });
    console.log(user);
    if (!user) {
        throw new Error('Bruger findes ikke');
    }
    ;
    // 2. Sammenlign password med det hash’ede password (password is the one coming in, and user.password is in the db)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
        /* This is not a smart message to give to a user because it tells a potential criminal where the mistake is,
        but this is what we are doing today. */
        throw new Error('Forkert password');
    }
    ;
    // 3. Lav en token (JWT)
    const token = jwt.sign({
        id: user.id,
        email: user.email,
        fullname: `${user.firstname} ${user.lastname}`,
        role: user.role
    }, JWT_SECRET, { expiresIn: '1h' } // token udløber efter 1 time
    );
    console.log(token);
    /* Explanation for the following deconstruction:
    "Examples of Syntactic Sugar in JavaScript
    Written by Sophia on August 08, 2020. (...)
    In this blog, we'll go over a few of examples of syntactic sugar in JavaScript:
    - for...of loop
    - Destructuring (...)
    With destructuring, we can also assign new variable names with a value other than the object's key.
    In this example, we create a new variable, superheroName, and assign it the value 'quake', from agents' nickname property.
        // Create new variable superheroName, with the value agent.nickname ('quake')
        let { nickname: superheroName } = agent
        console.log(superheroName) // 'quake' (...)
    In this example, we achieve the same functionality as above using destructuring. We create new variables from the values of the agents array in one line.
        // Create agents array
        let agents = ['coulson', 'may', 'daisy', 'simmons', 'fitz']
        // Use destructuring to create new variables from the agents array
        let [coulson, may, daisy, simmons, fitz] = agents (...)"
    https://sophiali.dev/syntactic-sugar-examples-javascript
    */
    /* Research on the use of ... (aka. suspension points, ellipsis or three dots) in JS:
    "The spread operator (…) and the rest parameter (…) in JavaScript are both denoted by three dots (…), but they serve different purposes. (...)
    The rest operator(…) is used in function parameters to collect all remaining arguments into an array. (...)
    The spread operator is used for expanding elements, while the rest parameter is used for collecting multiple elements into an array."
    https://medium.com/@pallavi8khedle/difference-between-spread-and-rest-operator-dc43a86a8991
    "Modern JavaScript allows us to use three dots, …, also known as an ellipsis, to perform certain transformations and shorthand methods. The use of ellipses falls into two categories: rest syntax and spread syntax."
    https://medium.com/better-programming/javascript-ellipses-the-spread-and-rest-syntax-c12df294548d
    */
    // 4. Returnér bruger + token (uden password)
    const { password: _password, ...userWithoutPassword } = user; // password: _password  represents the value to exclude from user (const defined above)
    console.log(userWithoutPassword); //Returns user, excluding his/her password, as an array.
    return {
        user: userWithoutPassword,
        token
    };
};
