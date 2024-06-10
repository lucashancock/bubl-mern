const connectToDatabase = require("./db");
const fs = require("fs");

async function resetDatabase() {
  try {
    const db = await connectToDatabase();

    // Read and parse JSON files
    const profiles = JSON.parse(fs.readFileSync("profiles.json", "utf8"));
    const bubls = JSON.parse(fs.readFileSync("bubls.json", "utf8"));
    const pictures = JSON.parse(fs.readFileSync("pictures.json", "utf8"));

    // Drop existing collections
    await db
      .collection("profiles")
      .drop()
      .catch(() => {});
    await db
      .collection("bubls")
      .drop()
      .catch(() => {});
    await db
      .collection("pictures")
      .drop()
      .catch(() => {});

    // Insert initial data
    await db.collection("profiles").insertMany(profiles);
    await db.collection("bubls").insertMany(bubls);
    await db.collection("pictures").insertMany(pictures);

    console.log("Database reset successfully");
  } catch (error) {
    console.error("Error resetting database:", error);
  }
}

module.exports = resetDatabase;
