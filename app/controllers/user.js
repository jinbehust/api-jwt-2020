const userService = require('../services/user');


async function createUser(req, res) {
  const { name, email, password } = req.body;
  const user = await userService.createUser(name, email, password);
  await userService.sMail(email);
  if (!user) return res.status(401).json({ err: 'Error! Please try again.' });
  return res.status(201).json({ user });
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  const token = await userService.loginUser(email, password);
  if (!token) return res.status(404).send({ err: 'Error! Please try again.' });
  return res.json({ result: true, token });
}

async function findAll(req, res) {
  const user = await userService.findAll();
  if (!user) return res.json({ err: 'User not found.' });
  return res.json({ user });
}

async function findOne(req, res) {
  const { id } = req.params;
  const user = await userService.findOne(id);
  if (!user) return res.status(404).json({ err: 'User not found.' });
  return res.json({ result: user });
}

async function updateUser(req, res) {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const allowUpdate = ['name'];
  let update = {};
  allowUpdate.map((key) => {
    if (req.body[key]) {
      update[key] = req.body[key];
    } else {
      update = null;
    }
  });
  const user = await userService.updateUser(id, update);
  if (!user) return res.status(404).json({ err: 'Could not update user.' });
  return res.json({ result: user });
}

async function blockUser(req, res) {
  await userService.blockUser(req.params.id);
  return res.json({ result: 'Blocked user' });
}

async function verifyMail(req, res) {
  const { ticket } = req.params;
  const isVerify = await userService.verifyMail(ticket);
  if (!isVerify) {
    return res.status(401).json({ result: 'False.' });
  }
  return res.json({ result: 'True.' });
}

module.exports = {
  createUser,
  loginUser,
  findAll,
  findOne,
  updateUser,
  blockUser,
  verifyMail,
};
