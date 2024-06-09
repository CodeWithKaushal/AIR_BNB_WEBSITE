const express = require("express");
const router = express.Router({ mergeParams: true }); // for merge after id part
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");



const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middlerware.js");

const reviewController = require("../controllers/reviews.js");



//remove common part


//===========================================================
/*
   Reviews  // post route
*/
//===========================================================

// router.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


//===========================================================

//===========================================================
/*
   Reviews  // Delete route
*/
//===========================================================

// router.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));


//===========================================================


module.exports = router;