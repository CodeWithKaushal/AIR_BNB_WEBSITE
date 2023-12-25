const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


//username and password are automatically create passport
const userSchema = new Schema({

    email: {
        type: String,
        require: true
    }
});

userSchema.plugin(passportLocalMongoose); //username ,password ,salting automatically implement 

module.exports = mongoose.model("User", userSchema);