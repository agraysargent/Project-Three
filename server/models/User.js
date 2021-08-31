const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const Order = require('./Order');
// const Event = require('./Event');


const userSchema = new Schema ({
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
        unique: true
     }, 
    //  Validate regex...?
    password: {
        type: String,
        required: true,
        minlength: 5
    },

    orders: [Order.schema]
        //  Hashed
    // events:  [Event.schema]
    // {
        //  [
        // type: String,
        // booked: Boolean,
        // location: {
        //     address: {
        //         street: String,
        //         city: String,
        //         state: String
        //     }   
        // },
        // ] 
       
    // },
});

userSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
});

userSchema.method.isCorrectPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;