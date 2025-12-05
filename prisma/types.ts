/* The seeding from CSV assignment requires the use of TypeScript. 
The purpose of this file is to give the right type to the values in the CSV files.
"Som udgangspunkt er værdierne som kommer fra CSV filerne tekststrenge."
https://moodle.techcollege.dk/course/section.php?id=285238

This file needs to be updated every time the models are updated.
*/
export const fieldTypes: Record<string, Record<string, "string" | "number" | "boolean" | "date">> = {
    //Model 1  
    user: {
        id: "number",
        firstname: "string",
        lastname: "string",
        email: "string",
        password: "string",
        role: "string",
        isActive: "boolean",
        createdOn: "date",
        updatedOn: "date"
    }
    //TO DO Model 2...  
};