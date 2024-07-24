import Booking from '../models/Booking.js';
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/badRequest.js';
import UnauthorizedError from '../errors/unauthorized.js';

export const createBooking = async (req, res) => {
  req.body.user = req.user.userId;
  const booking = await Booking.create(req.body);
  res.status(StatusCodes.CREATED).json({ attributes: booking });
};

export const getAllBooking = async (req, res) => {
  let {
    user,
    date,
    status,
    shippingId,
    shippingMode,
    packaging,
    weight,
    cargoName,
    message,
    quantity,
    typeOfCargo,
    insuranceRequired,
    departureLocation,
    deliveryLocation,
    pickupDate,
    details,
  } = req.query;

  const queryObject = {
    user: req.user.userId,
  };

  let result = Booking.find(queryObject);

  if (user) {
    result = Booking.find(queryObject, { user: { $eq: user } });
  }

  if (status) {
    result = Booking.find(queryObject, {
      status: { $eq: status },
    });
  }

  if (shippingId) {
    result = Booking.find(queryObject, {
      shippingId: { $regex: shippingId, $options: 'i' },
    });
  }

  if (shippingMode) {
    result = Booking.find(queryObject, {
      shippingMode: { $regex: shippingMode, $options: 'i' },
    });
  }

  if (packaging) {
    result = Booking.find(queryObject, {
      packaging: { $regex: packaging, $options: 'i' },
    });
  }

  if (weight) {
    result = Booking.find(queryObject, {
      weight: { $regex: weight, $options: 'i' },
    });
  }

  if (cargoName) {
    result = Booking.find(queryObject, {
      cargoName: { $regex: cargoName, $options: 'i' },
    });
  }

  if (message) {
    result = Booking.find(queryObject, {
      message: { $regex: message, $options: 'i' },
    });
  }

  if (quantity) {
    result = Booking.find(queryObject, {
      quantity: { $regex: quantity, $options: 'i' },
    });
  }

  if (typeOfCargo) {
    result = Booking.find(queryObject, {
      typeOfCargo: { $regex: typeOfCargo, $options: 'i' },
    });
  }

  if (insuranceRequired) {
    result = Booking.find(queryObject, {
      insuranceRequired: { $regex: insuranceRequired, $options: 'i' },
    });
  }

  if (deliveryLocation) {
    result = Booking.find(queryObject, {
      deliveryLocation: { $regex: deliveryLocation, $options: 'i' },
    });
  }

  if (departureLocation) {
    result = Booking.find(queryObject, {
      departureLocation: { $regex: departureLocation, $options: 'i' },
    });
  }
  if (pickupDate) {
    result = Booking.find(queryObject, {
      pickupDate: { $regex: pickupDate, $options: 'i' },
    });
  }
  if (details) {
    result = Booking.find(queryObject, {
      details: { $regex: details, $options: 'i' },
    });
  }
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }

  if (sort === 'a-z') {
    result = result.sort('cargoName');
  }
  if (sort === 'z-a') {
    result = result.sort('-cargoName');
  }

  if (date) {
    result = Booking.find(queryObject, {
      date: { $regex: date, $options: 'i' },
    });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const booking = await result;

  const totalBooking = await Booking.countDocuments();
  const numOfPage = Math.ceil(totalBooking / limit);

  res.status(StatusCodes.OK).json({
    booking: booking,
    meta: {
      pagination: {
        page: page,
        total: totalBooking,
        pageCount: numOfPage,
      },
    },
  });
};

export const getBooking = async (req, res) => {
  let {
    user,
    date,
    status,
    shippingId,
    shippingMode,
    packaging,
    weight,
    cargoName,
    message,
    quantity,
    typeOfCargo,
    insuranceRequired,
    departureLocation,
    deliveryLocation,
    pickupDate,
    details,
  } = req.query;

  let result = Booking.find({});

  if (user) {
    result = Booking.find({ user: { $eq: user } });
  }

  if (status) {
    result = Booking.find({
      status: { $eq: status },
    });
  }

  if (shippingId) {
    result = Booking.find({
      shippingId: { $regex: shippingId, $options: 'i' },
    });
  }

  if (shippingMode) {
    result = Booking.find({
      shippingMode: { $regex: shippingMode, $options: 'i' },
    });
  }

  if (packaging) {
    result = Booking.find({
      packaging: { $regex: packaging, $options: 'i' },
    });
  }

  if (weight) {
    result = Booking.find({
      weight: { $regex: weight, $options: 'i' },
    });
  }

  if (cargoName) {
    result = Booking.find({
      cargoName: { $regex: cargoName, $options: 'i' },
    });
  }

  if (message) {
    result = Booking.find({
      message: { $regex: message, $options: 'i' },
    });
  }

  if (quantity) {
    result = Booking.find({
      quantity: { $regex: quantity, $options: 'i' },
    });
  }

  if (typeOfCargo) {
    result = Booking.find({
      typeOfCargo: { $regex: typeOfCargo, $options: 'i' },
    });
  }

  if (insuranceRequired) {
    result = Booking.find({
      insuranceRequired: { $regex: insuranceRequired, $options: 'i' },
    });
  }

  if (deliveryLocation) {
    result = Booking.find({
      deliveryLocation: { $regex: deliveryLocation, $options: 'i' },
    });
  }

  if (departureLocation) {
    result = Booking.find({
      departureLocation: { $regex: departureLocation, $options: 'i' },
    });
  }
  if (pickupDate) {
    result = Booking.find({
      pickupDate: { $regex: pickupDate, $options: 'i' },
    });
  }
  if (details) {
    result = Booking.find({
      details: { $regex: details, $options: 'i' },
    });
  }
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }

  if (sort === 'a-z') {
    result = result.sort('cargoName');
  }
  if (sort === 'z-a') {
    result = result.sort('-cargoName');
  }

  if (date) {
    result = Booking.find({
      date: { $regex: date, $options: 'i' },
    });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const booking = await result;

  const totalBooking = await Booking.countDocuments();
  const numOfPage = Math.ceil(totalBooking / limit);

  res.status(StatusCodes.OK).json({
    booking: booking,
    meta: {
      pagination: {
        page: page,
        total: totalBooking,
        pageCount: numOfPage,
      },
    },
  });
};

export const getSingleBooking = async (req, res) => {
  const { id: bookingId } = req.params;
  const booking = await Booking.findOne({ _id: bookingId });
  if (!booking) {
    throw new BadRequestError(`Booking with id ${bookingId} does not exist`);
  }

  res.status(StatusCodes.OK).json({ booking: booking });
};

export const editSingleBooking = async (req, res) => {
  const { id: bookingId } = req.params;
  const booking = await Booking.findOneAndUpdate({ _id: bookingId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!booking) {
    throw new BadRequestError(`Booking with id ${bookingId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ booking: booking });
};

export const editUserBooking = async (req, res) => {
  const { id: userId } = req.params;
  const booking = await Booking.updateMany({ user: userId }, req.body);

  res.status(StatusCodes.OK).json({ booking: booking });
};

export const deleteSingleBooking = async (req, res) => {
  const { id: bookingId } = req.params;
  const booking = await Booking.findByIdAndDelete({
    _id: bookingId,
  });
  if (!booking) {
    throw new BadRequestError(`Booking with id ${bookingId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ msg: 'Booking Deleted' });
};

export const deleteAllBooking = async (req, res) => {
  const booking = await Booking.deleteMany();
  res.status(StatusCodes.OK).json({ msg: 'Booking Deleted' });
};

export const deleteUserBooking = async (req, res) => {
  const { id: userId } = req.params;
  const booking = await Booking.deleteMany({ user: userId });

  res.status(StatusCodes.OK).json({ msg: 'Booking successfully deleted' });
};
