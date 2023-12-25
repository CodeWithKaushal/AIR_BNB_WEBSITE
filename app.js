if (process.env.NODE_ENV != "production") {

    require("dotenv").config();
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const dbUrl = process.env.ATLASDB_URL;

main().then((res) => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});


async function main() {
    await mongoose.connect(dbUrl);
}



//====================================
// for deployment

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,

});

//====================================

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE");
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }

};


app.use(session(sessionOptions));
app.use(flash()); // use before routes implementation

// use passport after use session 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// app.get("/demouser", async (req, res) => {

//     let fakeUser = new User({
//         email: "student1@gmail.com",
//         username: "delta-student1"
//     });

//     const registerUser = await User.register(fakeUser, "kaushal1");

//     res.send(registerUser);

// });



//implement routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter); //meargeParams:true in review.js while require const router = express.Router({mergeParams: true});
app.use("/", userRouter);

// app.get("/", (req, res) => {

//     res.send("working");

// });

app.listen(8080, () => {

    console.log("app listening 8080");

});

//===========================================================
/*
for all other request
*/
//===========================================================

app.all("*", (req, res, next) => {

    next(new ExpressError(404, "Page Not Found!"));

});

//===========================================================


//============================================================
/*
Custom middleware
*/
//============================================================

app.use((err, req, res, next) => {



    let { statusCode = 500, message = "Something Went Wrong!!!" } = err;

    res.status(statusCode).render("error.ejs", { message });

    // res.status(statusCode).send(message);

});


//============================================================







