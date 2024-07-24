import express from 'express';
const router = express.Router();

import auth from '../middleware/authentication.js';
import authPermission from '../middleware/authPermission.js';

import {
  createBooking,
  getSingleBooking,
  deleteSingleBooking,
  deleteAllBooking,
  getAllBooking,
  deleteUserBooking,
  editSingleBooking,
  getBooking,
  editUserBooking,
} from '../controllers/BookingController.js';

router
  .route('/')
  .get(auth, getAllBooking)
  .post(auth, createBooking)
  .delete(auth, authPermission('admin', 'owner'), deleteAllBooking);

router.route('/allBooking').get(getBooking);

router
  .route('/:id')
  .get(getSingleBooking)
  .delete(auth, authPermission('admin', 'owner'), deleteSingleBooking)
  .patch(auth, editSingleBooking);

router.route('/:id/deleteUserBooking').delete(auth, deleteUserBooking);
router.route('/:id/editUserBooking').patch(auth, editUserBooking);

export default router;
