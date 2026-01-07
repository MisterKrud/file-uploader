const expressSession = require('express-session');
require('dotenv/config');
const { PrismaPg } = require('@prisma/adapter-pg');  // For other db adapters, see Prisma docs
const { PrismaClient } = require('./generated/prisma/client.js');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const passport = require("passport");
const express = require("express");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
// const pool = require("./db.pool")
const app = express();
const assetsPath = path.join(__dirname, "public");

const connectionString = "${process.env.DATABASE_URL}"
const adapter = new PrismaPg({ connectionString});
const prisma = new PrismaClient({ adapter });

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

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    console.log("Current User:", req.user); 
    console.log("Session ID:", req.sessionID);
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
