import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const requestedServiceSchema = new Schema({
    requestedUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    requestedService: {
        serviceID: {
            required: true,
            type: String
        },
        serviceName: {
            required: true,
            type: String
        }
    },
    requestedTime: {
        type: Date,
        default: new Date()
    },
    status: {
        required: true,
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Active', 'Payment', 'Closed']
    },
    invoiceFileName: {
        type: String,
        default: ''
    }
}, {
    versionKey: false
});

const RequestedService = mongoose.model('RequestedService', requestedServiceSchema);

export default RequestedService;