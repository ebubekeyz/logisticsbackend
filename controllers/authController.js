import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/badRequest.js';
import UnauthorizedError from '../errors/unauthorized.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res) => {
  let {
    id,
    email,
    lastName,
    firstName,
    phoneNumber,
    officeNumber,
    companyName,
    trackId,
    address,
    password,
    role,
  } = req.body;

  const getRandomTwoDigit1 = () => {
    return Math.floor(Math.random() * 100);
  };

  let randomTwoDigit1 = getRandomTwoDigit1();

  const getRandomTwoDigit2 = () => {
    return Math.floor(Math.random() * 100);
  };

  let randomTwoDigit2 = getRandomEightDigit2();

  const user = await User.create({
    id: `UZ-${randomTwoDigit1}`,
    email,
    lastName,
    firstName,
    phoneNumber: 'XXX-XXX-XXX',
    officeNumber: 'XXX-XXX-XXX',
    companyName: 'COMPANY NAME',
    trackId: `SW-${randomTwoDigit1}-${randomTwoDigit2}`,
    address: 'ADDRESS',
    password,
    role,
  });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: user, token: token });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new BadRequestError('Please provide an email');
  }
  if (!password) {
    throw new BadRequestError('Please provide a password');
  }
  const user = await User.findOne({ email });
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Password did not match');
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user: user, token: token });
};
export const getAllUsers = async (req, res) => {
  let { sort, name, accountNumber, email, ref, date, balance } = req.query;

  let result = User.find({});

  if (name) {
    result = User.find({ name: { $regex: name, $options: 'i' } });
  }

  if (ref) {
    result = User.find({ ref: { $eq: ref } });
  }
  if (accountNumber) {
    result = User.find({ accountNumber: { $eq: accountNumber } });
  }
  if (balance) {
    result = User.find({ balance: { $eq: balance } });
  }
  if (date) {
    result = Order.find(queryObject, {
      date: { $regex: date, $options: 'i' },
    });
  }

  if (email) {
    result = User.find({
      email: { $regex: email, $options: 'i' },
    });
  }

  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }
  if (sort === 'a-z') {
    result = result.sort('name');
  }
  if (sort === 'z-a') {
    result = result.sort('-name');
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 1000;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const users = await result;

  const totalUsers = await User.countDocuments();
  const numOfPage = Math.ceil(totalUsers / limit);

  res.status(StatusCodes.OK).json({
    users: users,
    meta: {
      pagination: { page: page, total: totalUsers, pageCount: numOfPage },
    },
  });
};

export const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new BadRequestError(`User with id ${userId} does not exist`);
  }

  res.status(StatusCodes.OK).json({ user: user });
};

export const editSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new BadRequestError(`User with id ${userId} does not exist`);
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: user, token: token });
};

export const deleteSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findByIdAndDelete({ _id: userId });
  if (!user) {
    throw new BadRequestError(`User with id ${userId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ msg: 'User Deleted' });
};

export const deleteAllUsers = async (req, res) => {
  const user = await User.deleteMany();
  res.status(StatusCodes.OK).json({ msg: 'Users Deleted' });
};

export const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

export const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new BadRequestError('Please provide both values');
  }

  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Password did not match existing user');
  }

  user.password = newPassword;

  await user.save();

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user: user, token: token });
};

export const emailPassword = async (req, res) => {
  const { email } = req.body;

  const checkEmail = await User.findOne({ email });
  if (!checkEmail) {
    throw new BadRequestError('Email does not exist');
  }

  res.status(StatusCodes.OK).json({ user: checkEmail });
};

export const passwordReset = async (req, res) => {
  const { newPassword, password } = req.body;

  if (newPassword !== password) {
    throw new BadRequestError('Password did not match');
  }

  if (!newPassword || !password) {
    throw new BadRequestError('No field must be empty');
  }

  const { id: userId } = req.params;

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await User.findOneAndUpdate(
    { _id: userId },
    { newPassword, password: hashPassword },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new UnauthorizedError(`No user with id ${userId} `);
  }

  const token = user.createJWT();

  res
    .status(StatusCodes.OK)
    .json({ user: user, token: token, msg: 'Password has been reset' });
};

// module.exports = {
//   passwordReset,
//   showCurrentUser,
//   registerUser,
//   loginUser,
//   getAllUsers,
//   getSingleUser,
//   editSingleUser,
//   deleteSingleUser,
//   deleteAllUsers,
//   updateUserPassword,
//   emailPassword,
// };
