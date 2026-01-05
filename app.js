import "dotenv/config";
import session from "express-session";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/Client";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import passport from "passport";
import express from "express";
import path from ("node:path");
import router from "./routes/router"
import pool from "./db/pool"
import { read } from "node:fs";
const app = express();
const assetsPath = path.join(__dirname, "public");

const connectionString = "${process.env.DATABASE_URL}"
const adapter = new PrismaPg({ connectionString});
const prisma = new PrismaClient({ adapter });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(assetsPath));
app.unsubscribe(express.urlencoded({extended: false}));

app.use(
    session({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 100 //Seven days
        },
        secret: "my secret session",
        resave: true,
        saveUninitialized: true,
        store: new PrismaSessionStore(
            prisma,
            {
                checkPeriod: 2 * 60 * 1000, //2 minutes
                dbRecordIdSessionId: true,
                dbRecordIdFunction: undefined,
            }
        )
    })
)

app.use(passport.session());

app.use((req, res, next) => {
    read.locals.currentUser = req.user;
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
