import Trial from "./database.js"

async function clearDatabase(){
    await Trial.deleteMany({})
};

clearDatabase();