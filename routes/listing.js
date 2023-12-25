const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middlerware.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });



// controllers 

const listingController = require("../controllers/listings.js");



//************************************************************************8

//============================================================
/*
   get/listings

   router.use(express.urlencoded({ extended: true }));

*/

//============================================================
// index route
//============================================================

router.get("/", wrapAsync(listingController.index));



//============================================================
/*
    New & Create Route

    New :-  GET  /listings/new      ----> form
                                            |
                                          Submit
                                            |
    Create :-  POST  /listings           <---

*/

//============================================================

// New & Create Route

//============================================================

// new route

router.get("/new", isLoggedIn, listingController.renderNewForm);

// Create Route

router.post("/", isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));



//============================================================
/*
GET /listings/:id  (show) - specific listings data (view)

*/

//============================================================

// show route for specific data view

//============================================================

router.get("/:id", wrapAsync(listingController.showListing));


//============================================================


//============================================================
/*
  Edit & Update Route

    Edit :-  GET  /listings/:id/edit      ----> form
                                                 |
                                               Submit
                                                 |
    Update :-  PUT  /listings/:id             <---

    const methodOverride = require("method-override");
    router.use(methodOverride("_method"));


*/

//============================================================

// Edit & Update Route

//============================================================


//edit
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//update

router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing));


//============================================================
/*

    DELETE /listings/:id

*/

//============================================================

// Delete

//============================================================
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));
//============================================================


module.exports = router;