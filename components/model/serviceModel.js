import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    serviceName: {
        required: true,
        type: String
    },
    serviceCategory: {
        required: true,
        type: String
    },
    price: {
        required: true,
        type: Number
    },
    description: {
        required: true,
        type: String
    },
    imageFile: {
        default: '',
        type: String
    }
}, {
    versionKey: false
});

const Service = mongoose.model('service', serviceSchema);

export default Service;