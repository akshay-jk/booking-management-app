import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import user from './model/userModel.js';
import service from './model/serviceModel.js';
import requestedService from './model/requestedService.js';

const getUserList = async (req, res) => {

    let userData = await user.find({}, {
        userType: 0,
        userLocation: 0
    });
    res.status(200).json({
        err: false,
        message: userData.length ? 'User Info' : 'User Info not Found',
        data: userData.length ? userData : null
    });
}

const getServiceList = async (req, res) => {

    let serviceData = await service.find({}, {
        description: 0
    });
    res.status(200).json({
        err: false,
        message: serviceData.length ? 'Service Info' : 'Service Info Not Found',
        data: serviceData.length ? serviceData : null
    })
}

const addUser = async (req, res) => {
    try {
        let duplicateCheck = await user.findOne({
            userName: req.xop.userName,
            userID: req.xop.userID
        })
        if (duplicateCheck !== null) {
            return res.status(200).json({
                err: true,
                message: `User already Exist`
            })
        }
        const newUser = new user({
            ...req.xop
        });
        let addUserResult = await newUser.save();
        if (addUserResult._id) {
            res.status(200).json({
                err: false,
                message: 'User Added Succesfully'
            })
        }
    } catch (e) {
        console.log(e)
        res.status(404).json({
            err: true,
            message: `Somewhere Crashed`
        })
    }
}

const addUserImage = async (req, res, next) => {

    let pathName = `${dirname(fileURLToPath(import.meta.url))}/img/${req.params.id}.jpeg`

    let dbUpdate = await user.updateOne({
        _id: req.params.id
    }, {
        imageFile: pathName
    });

    res.status(200).json({ err: false, message: 'File saved' });
}

const getUserImage = async (req, res) => {

    let userMentioned = await user.findOne({
        _id: req.xop.id
    }, {
        imageFile: 1
    });

    if (userMentioned !== null) {
        if (userMentioned.imageFile == '') res.status(200).json({ err: false, message: 'No image Found' })
        else res.status(200).sendFile(userMentioned.imageFile)
    } else res.status(200).json({
        err:true,
        message:'No user on this id'
    })
}

const addService = async (req, res) => {
    try {

        let duplicateCheck = await service.findOne({
            serviceName: req.xop.serviceName,
            serviceCategory: req.xop.serviceCategory,
            price: req.xop.price
        });
        if (duplicateCheck !== null) {
            return res.status(200).json({
                err: true,
                message: `Service already Exist`
            })
        }
        const newService = new service({
            ...req.xop
        });
        let addServiceResult = await newService.save();
        if (addServiceResult._id) {
            res.status(200).json({
                err: false,
                message: 'Service Added Properly'
            })
        }
    } catch (e) {
        res.status(200).json({
            err: true,
            message: 'Server Crashed'
        })
    }
}

const addServiceImage = async (req, res) => {
    let pathName = `${dirname(fileURLToPath(import.meta.url))}/img/${req.params.id}.jpeg`

    let dbUpdate = await service.updateOne({
        _id: req.params.id
    }, {
        imageFile: pathName
    });

    res.status(200).json({ err: false, message: 'File saved' });
}

const getServiceImage = async (req, res) => {
    let serviceMentioned = await service.findOne({
        _id: req.xop.id
    }, {
        imageFile: 1
    });

    if (serviceMentioned !== null) {
        if (serviceMentioned.imageFile == '') res.status(200).json({ err: false, message: 'No image Found' })
        else res.status(200).sendFile(serviceMentioned.imageFile)
    } else res.status(200).json({
        err:true,
        message:'No service on this id'
    });
}

const requestService = async (req, res) => {

    let userExist = await user.findOne({
        _id: req.xop.user
    });
    let serviceExist = await service.findOne({
        _id: req.xop.service
    });
    if (userExist == null || serviceExist == null) {
        res.status(200).json({
            err: true,
            message: 'Requested service not available'
        });
    } else {

        let duplicateCheck = await requestedService.findOne({
            'requestedUser': userExist['_id'],
            'requestedService.serviceID': serviceExist['_id']

        });

        if (duplicateCheck !== null) {
            res.status(200).json({
                err: true,
                message: 'You have already purchased'
            })
        } else {
            const requestReceived = new requestedService({
                requestedUser: userExist['_id'],
                // userID: userExist['userID'],
                requestedService: {
                    serviceID: serviceExist['_id'],
                    serviceName: serviceExist['serviceName']
                }
            });

            let requestServiceResult = await requestReceived.save();
            if (requestServiceResult._id) {
                res.status(200).json({
                    err: false,
                    message: 'Request recieved'
                })
            }
        }

    }
}

const serviceRequestedCustomerList = async (req, res) => {
    let customerListRequest = await requestedService.find({
        'requestedService.serviceID': req.params.id
    }, {
        _id: 0,
        requestedService: 0
    }).populate('requestedUser');

    res.status(200).json({
        err: customerListRequest.length ? false : true,
        message: customerListRequest.length ? `The list of all customer requests` : `No customer requests`,
        data: customerListRequest.length ? customerListRequest : ''
    })
}

const customerPreviousPurchaseList = async (req, res) => {
    let searchResult = await requestedService.find({
        requestedUser: req.xop.id,
        status: 'Closed'
    })

    res.status(200).json({
        err: searchResult.length ? false : true,
        message: searchResult.length ? 'Previous Purchase Found' : 'No Previous Purchase Exists',
        data: searchResult.length ? searchResult.length : null
    })
}

const rescheduleCustomerServiceRequest = async (req, res) => {

    let timeSlot = new Date(`${req.xop.date}` + ' ' + `${req.xop.time}`);
    if (timeSlot == 'Invalid Date')
        return res.status(200).json({
            err: true,
            message: 'Enter the date n time in mentioned structure',
            data: {
                date: 'Mmm DD, YYYY',
                time: '00:00:00'
            }
        })
    let rescheduleServiceTiming = await requestedService.updateOne({
        requestedUser: req.xop.userid,
        'requestedService.serviceID': req.xop.serviceid,
        'status': 'Pending'
    }, {
        requestedTime: timeSlot
    })
    res.status(200).json({
        err: false,
        message: rescheduleServiceTiming.nModified > 0 ? 'Your service has been rescheduled' : 'Error while performing'
    })
}

const acceptCustomerServiceRequest = async (req, res) => {
    let serviceRequestAccept = await requestedService.updateOne({
        _id: req.params.id,
        status: 'Pending'
    }, {
        status: 'Active'
    });

    res.status(200).json({
        err: serviceRequestAccept.nModified ? false : true,
        message: serviceRequestAccept.nModified ? 'Request Accepted' : 'Request Rejected'
    })
}

const generateInvoice = async (req, res) => {

    let invoiceRequestedService = await requestedService.findOne({
        _id: req.params.id,
        status: 'Active',
        invoiceFileName: ''
    }).populate('requestedUser');

    if (invoiceRequestedService == null) {
        return res.status(200).json({
            err: true,
            message: 'Sorry, Your request is not in a state for generating invoice'
        })
    }

    let servicePrice = await service.findOne({
        _id: invoiceRequestedService.requestedService.serviceID
    }, {
        _id: 0,
        price: 1
    });

    const templateOne = fs.readFileSync(`${dirname(fileURLToPath(import.meta.url))}/templates/invoice1.txt`, 'utf-8');
    const templateTwo = fs.readFileSync(`${dirname(fileURLToPath(import.meta.url))}/templates/invoice2.txt`, 'utf-8');

    const Invoice =
        `${templateOne} <h3>User Name :${invoiceRequestedService.requestedUser.userName} </h3>
        <h3>Service Name : ${invoiceRequestedService.requestedService.serviceName} </h3>
    <h3> Total Price: ${servicePrice.price} </h3>
    ${templateTwo}`;

    const invoiceCopy = fs.writeFileSync(`${dirname(fileURLToPath(import.meta.url))}/invoice/${invoiceRequestedService._id}.html`, Invoice);

    const dbStatusUpdate = await requestedService.updateOne({
        _id: invoiceRequestedService._id
    }, {
        status: 'Payment',
        invoiceFileName: `${dirname(fileURLToPath(import.meta.url))}/invoice/${invoiceRequestedService._id}.html`
    });

    if (dbStatusUpdate.nModified) res.status(200).sendFile(`${dirname(fileURLToPath(import.meta.url))}/invoice/${invoiceRequestedService._id}.html`);
    else res.status(200).json({
        err: true,
        message: 'Some Problem Happened'
    })
}

const resendInvoice = async (req, res) => {

    let sendFileName = await requestedService.findOne({
        _id: req.params.id,
        status: 'Payment'
    }, {
        _id: 0,
        invoiceFileName: 1
    });

    if (sendFileName !== null) res.status(200).sendFile(sendFileName.invoiceFileName);
    else res.status(200).json({
        err: true,
        message: 'Sorry, Invoice cannot be retrieved.'
    })
}


export default {
    getUserList,
    getServiceList,

    addUser,
    addService,

    addUserImage,
    addServiceImage,

    getUserImage,
    getServiceImage,

    requestService,
    serviceRequestedCustomerList,
    customerPreviousPurchaseList,

    rescheduleCustomerServiceRequest,
    acceptCustomerServiceRequest,
    generateInvoice,
    resendInvoice
}