require("dotenv").config();
console.log("CWD:", process.cwd());
console.log("ENV:", process.env.DATABASE_URL);
const express = require("express");
const expressSession = require('express-session');
const passport = require("passport");
const middleware = require("./controllers/userControllers")
const path = require("node:path");
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = require("./lib/prisma");


const indexRouter = require("./routes/indexRouter");
const app = express();
const assetsPath = path.join(__dirname, "public");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(assetsPath));
app.use(express.urlencoded({extended: false}));

app.use(
    expressSession({
        cookie: {
         
            maxAge: 7 * 24 * 60 * 60 * 1000 
        },
        secret: "a santa at nasa",
        resave: false,
        saveUninitialized: false,
        store: new PrismaSessionStore(
            prisma,
            {
                checkPeriod: 2 * 60 * 1000, 
                dbRecordIdIsSessionId: true, 
                dbRecordIdFunction: undefined,
            }
        )
    })
)

app.use(passport.session());
app.use(middleware.userDesktopFolder)

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
})
app.use("/", indexRouter);


const PORT = process.env.PORT || 3000

app.listen(PORT, (error) => {
    if(error) {
        throw error
    }
    console.log(`Webserver active on port: ${PORT}`)
} )
