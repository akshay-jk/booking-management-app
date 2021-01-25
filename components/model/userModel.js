import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        required: true,
        type: String
    },
    userID: {
        required: true,
        type: String
    },
    userType: {
        required: true,
        type: String,
        enum: ['Customer']
    },
    userLocation: {
        street: String,
        province: String
    },
    imageFile: {
        default: '',
        type: String
    }
}, {
    versionKey: false
});

const User = mongoose.model('User', userSchema);

export default User;