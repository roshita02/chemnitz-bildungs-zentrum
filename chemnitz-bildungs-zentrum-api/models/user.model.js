import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;
import { genSalt, hash as _hash, compare } from 'bcrypt';
import addressSchema from "./userAddressSchema.js";
import userFavouriteSchema from "./userFavouriteSchema.js";
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    address: {
        type: addressSchema,
        default: null
    },
    favouriteFacility: {
        type: userFavouriteSchema,
        default: null
    }
}, { versionKey: false });

// Middleware to hash the password before saving the user
UserSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) return next();
    genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        _hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// Method to compare password for login
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

export default model("User", UserSchema, "users")