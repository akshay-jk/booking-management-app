import express from 'express';
const router = express.Router();

import multerConfig from '../multerConfig.js'

import guard from './guard.js';
import validation from './validation.js';
import controller from './controller.js';

router.use(guard.authFunction);

router.get('/get-user-list', controller.getUserList);
router.get('/get-service-list', controller.getServiceList);

router.post('/add-user', validation.validationForUserAddition, controller.addUser);
router.post('/add-service', validation.validationForServiceAddition, controller.addService);

router.get('/get-user-image/:id', validation.validationForParamsID, controller.getUserImage);
router.get('/get-service-image/:id', validation.validationForParamsID, controller.getServiceImage)

router.post('/user-image/:id', validation.validationForUserImageAddition, multerConfig.single('image'), controller.addUserImage);
router.post('/service-image/:id', validation.validationForServiceImageAddition, multerConfig.single('image'), controller.addServiceImage);

router.post('/request-service/:id', validation.validationForServiceRequest, controller.requestService);
router.get('/customer-requested/:id', validation.validationForServiceRequestedCustomers, controller.serviceRequestedCustomerList);
router.get('/customer-previous-purchase/:id', validation.validationForParamsID, controller.customerPreviousPurchaseList);

router.put('/reschedule-customer-request', validation.validationForRescheduleCustomerServiceRequest, controller.rescheduleCustomerServiceRequest);

router.put('/accept-customer-request/:id', validation.validationForCustomerRequestAccept, controller.acceptCustomerServiceRequest);
router.put('/generate-invoice/:id', validation.validationForInvoiceGeneration, controller.generateInvoice);
router.get('/resend-invoice/:id', validation.validationForResendInvoice, controller.resendInvoice);

export default router;