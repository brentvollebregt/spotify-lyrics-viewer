import express from "express";

export const subRoute = "/api/session";

const router = express.Router();

router.get("/", (req, res) => {
  if (process.env.NODE_ENV === "development") {
    res.json(req.session);
    res.end();
  } else {
    res.status(403).send("Forbidden");
    res.end();
  }
});

router.delete("/", (req, res) => {
  req.session = null;
  res.end();
});

export default router;
