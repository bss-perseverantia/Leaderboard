const fs = require("fs");
const path = require("path");

class DB {
  constructor(loc, events, schools) {
    this.loc = loc;
    this.events = events;
    this.schools = schools;
  }
  getDB() {
    return JSON.parse(fs.readFileSync(this.loc));
  }
  createDB() {
    let evp = [];
    for (let i = 0; i < this.events.length; i++) {
      evp.push(0);
    }
    var db = {
      schools: [],
      eventEnd: false
    };
    for (let i = 0; i < this.schools.length; i++) {
      db.schools.push({
        name: this.schools[i],
        points: 0,
        events: this.events,
        eventpoints: evp,
      });
    }
    fs.writeFileSync(this.loc, JSON.stringify(db));
  }
  addEventPoints(event, school, points) {
    var db = JSON.parse(fs.readFileSync(this.loc));
    for (let i = 0; i < db.schools.length; i++) {
      if (db.schools[i].name == school) {
        db.schools[i].points += points;
        for (let j = 0; j < db.schools[i].events.length; j++) {
          if (db.schools[i].events[j] == event) {
            db.schools[i].eventpoints[j] += points;
          }
        }
      }
    }
    fs.writeFileSync(this.loc, JSON.stringify(db));
  }
  remEventPoints(event, school, points) {
    var db = JSON.parse(fs.readFileSync(this.loc));
    for (let i = 0; i < db.schools.length; i++) {
      if (db.schools[i].name == school) {
        for (let j = 0; j < db.schools[i].events.length; j++) {
          if (
            db.schools[i].events[j] == event &&
            points <= db.schools[i].eventpoints[j]
          ) {
            db.schools[i].points -= points;
            db.schools[i].eventpoints[j] -= points;
          }
        }
      }
    }
    fs.writeFileSync(this.loc, JSON.stringify(db));
  }
  eventEnd(){
    var db = JSON.parse(fs.readFileSync(this.loc));
    db.eventEnd = true;
    fs.writeFileSync(this.loc, JSON.stringify(db));
  }
  eventStart(){
    var db = JSON.parse(fs.readFileSync(this.loc));
    db.eventEnd = false;
    fs.writeFileSync(this.loc, JSON.stringify(db));
  }
}

module.exports = {
  DB,
};
