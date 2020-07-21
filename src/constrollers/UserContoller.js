const {
    login,
    register,
    currentUser,
    getUserById,
    updateUser,
    searchUsers,
} = require("../utils/paths");

const {
    usersMiddleware,
    withAuthorization,
    withSuccessResponse
} = require('../constrollers/middleware');

const {
    withLogin,
    withGetId,
    withRegister,
    withUserQuery,
    withSearchUser,
    withUpdateUser,
    withDecodeToken,
    withCreateToken,
    withFindByUserId,
    withFindByUserName,
    withFindByUseremail,
} = usersMiddleware;

const express = require("express");

const router = express.Router();

router.get(getUserById, withGetId(), withFindByUserId(), withSuccessResponse());

router.get(currentUser, withAuthorization(), withDecodeToken(), withFindByUserName(), withSuccessResponse());

router.get(searchUsers, withUserQuery(), withSearchUser(), withSuccessResponse());

router.post(login, withLogin(), withFindByUseremail() , withSuccessResponse());

router.post(register, withRegister(), withCreateToken(), withSuccessResponse());

router.put(updateUser, withAuthorization(), withDecodeToken(), withUpdateUser(), withSuccessResponse());

module.exports = router;
