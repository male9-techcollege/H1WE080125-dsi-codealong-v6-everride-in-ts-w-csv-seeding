/* The seeding from CSV assignment requires the use of TypeScript.
The purpose of this file is to give the right type to the values in the CSV files.
"Som udgangspunkt er værdierne som kommer fra CSV filerne tekststrenge."
https://moodle.techcollege.dk/course/section.php?id=285238

This file needs to be updated every time the models are updated.
*/
export const fieldTypes = {
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
    },
    //Model 2  
    car: {
        id: "number",
        category_id: "number",
        brand_id: "number",
        make: "string",
        model: "string",
        year: "number",
        trimLevel: "string",
        generation: "string",
        price: "number",
        used: "boolean",
        createdOn: "date",
        updatedOn: "date"
    },
    //Model 3  
    category: {
        id: "number",
        name: "string",
        createdOn: "date",
        updatedOn: "date"
    },
    //Model 4 
    brand: {
        id: "number",
        name: "string",
        logo: "string",
        createdOn: "date",
        updatedOn: "date"
    },
    //Model 5  
    fuelType: {
        id: "number",
        name: "string",
        createdOn: "date",
        updatedOn: "date"
    },
    //Model 6
    carFuelRel: {
        id: "number",
        car_id: "number",
        fuelType_id: "number",
        createdOn: "date",
        updatedOn: "date"
    }
};
