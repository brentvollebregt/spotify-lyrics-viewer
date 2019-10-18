import express from "express";
import path from "path";

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

app.get("/api/ping", (req, res) => {
    res.send("pong");
    // res.json(passwords);
});

app.get("/api/test", (req, res) => {
    res.send("test");
    // res.json(passwords);
});

// Catch all non-matched urls
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname + '/client/build/index.html'));
// });

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});
