const router = require('express').Router();

const userController = require('../controllers/user');
const userAuth = require('../middlewares/auth');

router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);

router.get('/', userController.findAll);
router.get('/:id', userController.findOne);
router.get('/verifyEmail/:ticket', userController.verifyMail);

router.put('/:id', userAuth.checkToken, userController.updateUser);

router.delete('/:id', userAuth.checkToken, userController.blockUser);


module.exports = router;
