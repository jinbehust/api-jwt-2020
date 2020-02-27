const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv');
const nodemailer = require('nodemailer');
const User = require('../models/user');


async function createUser(name, email, password) {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const user = await User.create({ name, email, password: hashedPassword });
  return user;
}

async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user || user.isRemove === true || user.isActive === false) return null;

  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) return null;

  const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: process.env.EXPIRES });
  return token;
}

async function findAll() {
  const user = await User.find();
  return user;
}

async function findOne(id) {
  const user = await User.findById(id);
  if (user.isRemove) return null;
  return user;
}

async function updateUser(id, updateObj) {
  const user = await User.findByIdAndUpdate(id, updateObj, { new: true });
  return user;
}

async function blockUser(id) {
  await User.findByIdAndUpdate(id, { isRemove: true });
}

async function sMail(email) {
  const ticket = jwt.sign({ email }, process.env.SECRET, { expiresIn: 900 });

  const option = {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  };
  const transporter = await nodemailer.createTransport(option);

  transporter.verify((err) => {
    if (err) {
    } else {
      const mail = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Verify Your Account.',
        html: `<p>Hi,</p><p>Please click this to confirm: <a href="${process.env.DOMAIN}/users/verifyEmail/${ticket}">Email Verification</a></p>`,
      };
      transporter.sendMail(mail, (error) => {
        if (error) {
        } else {
        }
      });
    }
  });
}

async function verifyMail(ticket) {
  try {
    const text = jwt.decode(ticket, process.env.SECRET);
    const user = await User.findOneAndUpdate(text.email, { isActive: true }, { new: true });
    if (user) return true;
    return false;
  } catch (err) {
    return false;
  }
}


module.exports = {
  createUser,
  findAll,
  findOne,
  updateUser,
  blockUser,
  loginUser,
  sMail,
  verifyMail,
};
