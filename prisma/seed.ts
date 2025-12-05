/* The following seeding will NOT work unless a database reset is done first because I have given specific IDs, and a 2nd seeding will just delete rows and make ID numbers go up. 
The deletions are thereby not very useful in the current scenario. They were useful until I entered tables that require certain keys in other tables to exist. 
Steps to follow:
Option 1:
    Go to prisma folder in terminal and enter:
    npx prisma migrate reset
    The seeding is performed as part of the reset.
Option 2 (more time-consuming):
    Delete db, go to prisma folder and create a new dabase, e.g.:
    npx prisma migrate dev --name fresh-db
Note: entering the following is not required with the two options above. The seeding is done automatically with the reset or the migration.  
    npx prisma db seed
*/

import bcrypt from 'bcrypt';
import { prisma } from '../src/prisma.js';

// Asynkron main-funktion som kører vores seed-data
const main = async () => {
    /* This works: 
    console.log("test"); 
    */
    // Sletter eksisterende data i bruger tabellen
    /* The order in which this is executed matters. For instance, categories cannot be deleted before cars
       because records in the Car model depend on the existence of categories and brands.
       Basically, the models containing the @relation represent the tables that have to be deleted first.  
     */
    await prisma.user.deleteMany(); 
    await prisma.carFuelRel.deleteMany(); 
    await prisma.fuelType.deleteMany(); 
    await prisma.car.deleteMany(); 
    await prisma.category.deleteMany(); 
    await prisma.brand.deleteMany(); 

    // Opretter en testbruger i databasen
    // .create() only creates one record; use createMany() to create more
    const users = await prisma.user.createMany({
        data: [
            {
                firstname: "Marie-Pierre",
                lastname: "Lessard",
                email: "male9@elev.techcollege.dk", // Login-email
                password: await bcrypt.hash('password', 10), // Password hash 
                role: "ADMIN", // Bruger rolle
                isActive: true, // Brugeren er aktiv og må logge ind
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                firstname: "Heinz",
                lastname: "Kanstrup",
                email: "heka@techcollege.dk", // Login-email
                password: await bcrypt.hash('password', 10), // Password hash 
                role: "USER", // Bruger rolle
                isActive: true, // Brugeren er aktiv og må logge ind
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                firstname: "Bo",
                lastname: "Nicolaisen",
                email: "bni@techcollege.dk", // Login-email
                password: await bcrypt.hash('password', 10), // Password hash 
                role: "USER", // Bruger rolle
                isActive: true, // Brugeren er aktiv og må logge ind
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                firstname: "Kasper",
                lastname: "Frydensberg",
                email: "kfry@techcollege.dk", // Login-email
                password: await bcrypt.hash('password', 10), // Password hash 
                role: "USER", // Bruger rolle
                isActive: true, // Brugeren er aktiv og må logge ind
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                firstname: "Tim",
                lastname: "Sørensen",
                email: "tvso@techcollege.dk", // Login-email
                password: await bcrypt.hash('password', 10), // Password hash 
                role: "USER", // Bruger rolle
                isActive: true, // Brugeren er aktiv og må logge ind
                createdOn: new Date(),
                updatedOn: new Date()
            }
        ]
    });
    // Udskriver i terminalen at brugeren/brugerne er oprettet
    console.log("Seed completed for user(s): ", users);

    const categories = await prisma.category.createMany({
        data: [
            {
                name: "A (city car)",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "B (small car)",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "C (medium car)",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "D (large car)",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "E (executive car)",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "F (luxury car)",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "J (sport-utility vehicle (SUV)/crossover-utility vehicle (CUV))",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "S (sport coupes)",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "M (multi-purpose vehicle (MPV))",
                createdOn: new Date(),
                updatedOn: new Date()
            }
        ]
    });
    console.log("Seed completed for category or categories: ", categories);

    const brands = await prisma.brand.createMany({
        data: [
            {
                name: "Alfa Romeo",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Audi",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "BMW",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "BYD",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Citroen",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Cupra",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Dacia",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Ford",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Honda",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Hongqi",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Hyundai",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Kia",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Land Rover",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Lexus",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Mazda",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Mercedes-Benz",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "MG",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Mini",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Navor",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Nissan",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Opel",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Peugeot",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Polestar",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Porsche",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Renault",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Seat",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Skoda",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Subaru",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Suzuki",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Toyota",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Volkswagen",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Volvo",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "XPeng",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Zeekr",
                logo: "http://localhost:4000/assets/img/brand-logo-1.svg",
                createdOn: new Date(),
                updatedOn: new Date()
            }
        ]
    });
    console.log("Seed completed for brand(s): ", brands);

    const fuels = await prisma.fuelType.createMany({
        data: [
            {
                name: "Diesel",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "Benzin",
                createdOn: new Date(),
                updatedOn: new Date()
            },
            {
                name: "El",
                createdOn: new Date(),
                updatedOn: new Date()
            }
        ]
    });
    console.log("Seed completed for fuel(s): ", fuels);

    const car = await prisma.car.create({
        data: {
            category_id: 1,
            brand_id: 2,
            make: "Audi",
            model: "Fantastic",
            year: 2003,
            trimLevel: "TL1",
            generation: "II",
            price: 100000,
            used: true,
            createdOn: new Date(),
            updatedOn: new Date()
        }
    });
    console.log("Seed completed for car: ", car);

    const carFuelRel = await prisma.carFuelRel.create({
        data: {
            car_id: 1,
            fuelType_id: 1,
            createdOn: new Date(),
            updatedOn: new Date()
        }
    });
    console.log("Seed completed for car-fuel relationship: ", carFuelRel);
};

// Kør main-funktionen
main()
    .then(() => prisma.$disconnect()) // Lukker db forbindelsen når alt er ok
    .catch((e) => {
        console.error(e); 
        prisma.$disconnect();
        process.exit(1);
    });
