import Joi from 'joi';

import user from './model/userModel.js'
import service from './model/serviceModel.js';

const validationForUserAddition = (req, res, next) => {
    const ValidationSchema = Joi.object({
        userName: Joi.string().required(),
        userID: Joi.string().email({ minDomainSegments: 2 }).required(),
        userType: Joi.string().required(),
        userLocation: Joi.object({
            street: Joi.string(),
            province: Joi.string()
        })
    });
    try {
        const { value, error } = ValidationSchema.validate(req.body);
        if (error) {
            return res.status(200).json({
                err: false,
                message: 'Validation Error',
                data: error.details
            });
        } else {
            req.xop = value;
            next();
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({
            err: true,
            message: e
        })
    }
}

const validationForServiceAddition = (req, res, next) => {
    const ValidationSchema = Joi.object({
        serviceName: Joi.string().required(),
        serviceCategory: Joi.string().required(),
        price: Joi.number().required(),
        description: Joi.string().required()
    });
    try {
        const { value, error } = ValidationSchema.validate(req.body);
        if (error) {
            return res.status(200).json({
                err: false,
                message: 'Validation Error',
                data: error.details
            });
        } else {
            req.xop = value;
            next();
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({
            err: true,
            message: e
        })
    }
}

const validationForUserImageAddition = async (req, res, next) => {

    let userCheck = await user.findOne({ _id: req.params.id });

    userCheck == null ? res.status(200).json({ err: true, message: 'User Not Found' }) : next();
}

const validationForServiceRequest = (req, res, next) => {
    if (req.headers.auth == undefined) {
        res.status(200).json({
            err: false,
            message: `User Authentication Failed`
        })
    } else {
        req.xop = {
            user: req.headers.auth,
            service: req.params.id
        }
        next();
    }
}

const validationForServiceImageAddition = async (req, res, next) => {
    let userCheck = await service.findOne({ _id: req.params.id });
    userCheck == null ? res.status(200).json({ err: true, message: 'Service Not Found' }) : next();
}

const validationForServiceRequestedCustomers = (req, res, next) => {
    next();
}

const validationForParamsID = (req, res, next) => {
    if (req.params.id == undefined || req.params.id == null) {
        res.status(200).json({
            err: true,
            message: 'Credentials Missing'
        })
    } else {
        req.xop = {
            id: req.params.id
        }
        next();
    }
}

const validationForRescheduleCustomerServiceRequest = (req, res, next) => {
    const ValidationSchema = Joi.object({
        time: Joi.string().required(),
        date: Joi.string().required(),
        userid: Joi.string().required(),
        serviceid: Joi.string().required()
    });
    try {
        const { value, error } = ValidationSchema.validate(req.body);
        if (error) {
            return res.status(200).json({
                err: false,
                message: 'Validation Error',
                data: error.details
            });
        } else {
            req.xop = value;
            next();
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({
            err: true,
            message: e
        })
    }
}

const validationForCustomerRequestAccept = (req, res, next) => {
    next();
}


const validationForInvoiceGeneration = (req, res, next) => {
    next();
}

const validationForResendInvoice = (req, res, next) => {
    next();
}

export default {
    validationForUserAddition,
    validationForServiceAddition,
    validationForUserImageAddition,
    validationForServiceImageAddition,
    validationForServiceRequest,
    validationForServiceRequestedCustomers,
    validationForParamsID,

    validationForCustomerRequestAccept,
    validationForRescheduleCustomerServiceRequest,
    validationForInvoiceGeneration,
    validationForResendInvoice
}