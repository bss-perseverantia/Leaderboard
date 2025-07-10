const loc = __dirname + "/db.json";
const config = require("./config.js");


const app = require("express")();
app.use(require("express").static("static"));
app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}. Source code by Bumblebee.`);
});

const fs = require("fs");
const { loadFromMongo, saveToMongo } = require("./mongoUtil.js");

(async () => {
  const mongoData = await loadFromMongo();
  if (mongoData) {
    fs.writeFileSync(loc, JSON.stringify(mongoData, null, 2));
    console.log("Loaded data from MongoDB into db.json");
  }
  // Continue with your normal startup
  const { DB } = require("./Database.js");
  const db = new DB(loc, config.events, config.schools);
  //db.createDB();
  require("./api.js")(app, db);

  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/leaderboard.html");
  });

  app.get("/admin", (req, res) => {
    res.sendFile(__dirname + "/pages/admin.html");
  });
  app.use((req, res, next) => {
    res.status(404).sendFile(__dirname+"/pages/404.html");
  });
  /*
  for(let i=0;i<config.schools.length;i++){
    for(let j=0;j<config.events.length;j++){
      db.addEventPoints(config.events[j],config.schools[i],Math.floor(Math.random() * 10)+1);
    }
  }*/
})();

setInterval(() => {
  fs.readFile(loc, "utf8", async (err, data) => {
    if (!err) {
      try {
        await saveToMongo(JSON.parse(data));
        console.log("Backed up db.json to MongoDB");
      } catch (e) {
        console.error("Backup to MongoDB failed:", e);
      }
    }
  });
}, 5 * 60 * 1000); // Every 5 minutes

/*test*/