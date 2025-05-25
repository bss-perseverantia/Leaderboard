module.exports = (app, db) => {
  app.get("/api/full", (req, res) => {
    let data = db.getDB();
    res.json(data);
  });
  app.get("/api/info", (req, res) => {
    const mdb = db.getDB();
    let points = [];
    for (let i = 0; i < mdb.schools.length; i++) {
      points.push(mdb.schools[i].points);
    }
    let data = { schools: db.schools, events: db.events, points: points, eventEnd:mdb.eventEnd };
    res.json(data);
  });

  app.get("/validate", (req, res) => {
    if (
      req.query.uname == process.env.un &&
      req.query.pass == process.env.pass
    ) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  });

  app.get("/api/add", (req, res) => {
    if (
      req.query.uname == process.env.un &&
      req.query.pass == process.env.pass
    ) {
      db.addEventPoints(
        req.query.event,
        req.query.school,
        parseInt(req.query.points),
      );
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
  app.get("/api/rem", (req, res) => {
    if (
      req.query.uname == process.env.un &&
      req.query.pass == process.env.pass
    ) {
      if (
        parseInt(req.query.points) >
        db.getDB().schools[db.schools.indexOf(req.query.school)].eventpoints[db.events.indexOf(req.query.event)]
      )
        return res.json({ success: false });
      db.remEventPoints(
        req.query.event,
        req.query.school,
        parseInt(req.query.points),
      );

      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });

  app.get("/api/reset", (req, res) => {
    if (
      req.query.uname == process.env.un &&
      req.query.pass == process.env.pass
    ) {
      db.createDB();
      res.json({ success: true });
    }
  });



  app.get("/api/endEvent", (req, res) => {
    if (
      req.query.uname == process.env.un &&
      req.query.pass == process.env.pass
    ) {
      db.eventEnd();
      res.json({ success: true });
    }
    else {
      res.json({ success: false });
    }
  });
  app.get("/api/eventStart", (req, res) => {
    if (
      req.query.uname == process.env.un &&
      req.query.pass == process.env.pass
    ) {
      db.eventStart();
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
};
