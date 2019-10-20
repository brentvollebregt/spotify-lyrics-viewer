import express from "express";

const router = express.Router();

router.post('/authenticate', (req, res) => {
    const { code } = req.body;
    res.json({ success: true, echo: code });
});

export default router;
