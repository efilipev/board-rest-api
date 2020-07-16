const {
    UnsupportedException,
    UnauthorizedException,
    NotFoundException,
    ErrorHandler
} = require("../exceptions");

const {
    JwtTokenService,
    BcryptPasswordService
} = require("../services");

const {
    login,
    register,
    currentUser,
    getUserById,
    updateUser,
    searchUsers,
} = require("../utils/paths");

const {
    trimBearer,
    responseWithError
} = require("../utils/http");

const { UserService } = require("../services");
const express = require("express");

const router = express.Router();
const service = new UserService();

router.post(login, async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        responseWithError(422, new UnsupportedException('password', "Wrong email or password"), res);
    }
    const user = req.body;
    if (user.email && user.password) {
        const currentUser = await service.findUserByEmailAndPassword(user.email);
        const passed = await BcryptPasswordService.comparePassword(user.password, currentUser.password);
        if (!passed) {
            responseWithError(422, new UnsupportedException('password', "Wrong email or password"), res);
        }
        const token = JwtTokenService.createToken({
            created: new Date(),
            id: currentUser.id,
            user: currentUser.username,
            role: "user",
        });
        res.status(200).json({ token: token });
    }
});

router.post(register, async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        responseWithError(422, new UnsupportedException('password', "Wrong email or password"), res);
    }
    const user = req.body;
    if (user) {
        await BcryptPasswordService.generate(user.password);
        const token = JwtTokenService.createToken({
            created: new Date(),
            id: user.id,
            user: user.name,
            role: "user",
        });
        await service.create.call(this, user);
        res.status(200).json({ token: token });
    } else {
        responseWithError(422, new UnsupportedException(user.password, "Wrong current password"), res);
    }
});

router.get(currentUser, async (req, res) => {
    const token = trimBearer(req.header("Authorization"));
    if (!token) {
        responseWithError(401, new UnauthorizedException(), res);
    }
    const decodedToken = JwtTokenService.decodeToken(token);
    const user = await service.findUserByName(decodedToken.user);
    res.status(200).json(user);
});

router.put(updateUser, async (req, res, next) => {
    const auth = trimBearer(req.header("Authorization"));
    const decodedToken = JwtTokenService.decodeToken(auth);
    const updatedUser = req.body;
    if (!auth) {
        responseWithError(401, new UnauthorizedException(), res);
    }
    if (!updatedUser) {
        next();
    }
    if (!updatedUser.current_password  && !updatedUser.new_password) {
        responseWithError(422,
            new UnsupportedException('password', 'Current password is required or provide a new_password'), res);
    }
    if (updatedUser.new_password) {
        await BcryptPasswordService.generate(updatedUser.new_password);
        const user = await service.updateUser(decodedToken.id, updatedUser);
        res.status(200).json(user);
    } else {
        const user = service.updateUser(decodedToken.id, updatedUser);
        res.status(200).json(user);
    }
});

router.get(getUserById, async (req, res, next) => {
    const {id} = req.params;
    if (!req.params) {
        next();
    }
    if (id) {
        const user = await service.findUserById(id);
        res.status(200).json(user);
    } else {
        responseWithError(404, new NotFoundException(), res);
    }
});

router.get(searchUsers, async (req, res, next) => {
    const { name, email } = req.query;
    if (!req.query) {
        next();
    }
    if (name && email) {
        const user = await service.searchUser({ name, email });
        res.status(200).json(user);
    } else if (name) {
        const user = await service.searchUser({ name });
        res.status(200).json(user);
    } else if (email) {
        const user = await service.searchUser({ email });
        res.status(200).json(user);
    } else {
        res.status(200).json([]);
    }
});

module.exports = router;
