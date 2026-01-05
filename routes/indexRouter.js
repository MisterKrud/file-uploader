import { Router } from "express";
const router = Router();
import passport from "../config/passport";

router.get("/", (req, res) => {
    res.render("index");
});