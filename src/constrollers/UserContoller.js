const {
    UnsupportedException,
    UnauthorizedException,
    NotFoundException,
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

const { UserService } = require("../services");
const express = require("express");
const trimBearer = require("../utils/http");

const router = express.Router();
const service = new UserService();

router.post(login, (req, res) => {
    if (Object.keys(req.body).length !== 0) {
        if (req.body.email && req.body.password) {
            service.findUserByEmail(req.body.email).then((user) => {
                const token = JwtTokenService.createToken({
                    created: new Date(),
                    user: user.username,
                    role: "user",
                });
                res.status(200).json({ token: token });
            });
        } else {
            throw new UnsupportedException("password", "Wrong email or password");
        }
    } else {
        throw new UnsupportedException("password", "Wrong email or password");
    }
});

router.post(register, function (req, res) {
    if (Object.keys(req.body).length !== 0) {
        const user = req.body;
        if (user) {
            BcryptPasswordService.generate(user.password);
            const token = JwtTokenService.createToken({
                created: new Date(),
                id: user.id,
                user: user.name,
                role: "user",
            });
            service.create.call(this, user);
            res.status(200).json({ token: token });
        } else {
            throw new UnsupportedException(user.password, "Wrong current password");
        }
    }
});

router.get(currentUser, (req, res) => {
    const token = trimBearer(req.header("Authorization"));
    const decodedToken = JwtTokenService.decodeToken(token);
    service
        .findUserByName(decodedToken.user)
        .then((user) => {
            res.status(200).json(user);
        })
        .catch(() => {
            throw new UnauthorizedException();
        });
});

router.put(updateUser, (req, res, next) => {
    const auth = trimBearer(req.header("Authorization"));
    const decodedToken = JwtTokenService.decodeToken(auth);
    const updatedUser = req.body;
    if (!auth) {
        throw new UnauthorizedException();
    }
    if (!updatedUser) {
        next();
    }
    if (!updatedUser.current_password  && !updatedUser.new_password) {
        throw new UnsupportedException(updatedUser.current_password, 'Current password is required or provide a new_password');
    }
    if (updatedUser.new_password) {
        BcryptPasswordService.generate(updatedUser.new_password);
        service.updateUser(decodedToken.id, updatedUser).then((user) => {
            res.status(200).json(user);
        }).catch( () => new UnsupportedException());
    } else {
        service.updateUser(decodedToken.id, updatedUser).then((user) => {
            res.status(200).json(user);
        }).catch( () => new UnsupportedException());
    }
});

router.get(getUserById, (req, res, next) => {
    const { id } = req.params;
    if (!req.params) {
        next();
    }
    if (id) {
        service.findUserById(id).then((user) => {
            res.status(200).json(user);
        });
    } else {
        throw new NotFoundException();
    }
});

router.get(searchUsers, (req, res, next) => {
    const { name, email } = req.query;
    if (!req.query) {
        next();
    }
    if (name && email) {
        service.searchUser({ name, email }).then((user) => {
            res.status(200).json(user);
        });
    } else if (name) {
        service.searchUser({ name }).then((user) => {
            res.status(200).json(user);
        });
    } else if (email) {
        service.searchUser({ email }).then((user) => {
            res.status(200).json(user);
        });
    } else {
        res.status(200).json([]);
    }
});

module.exports = router;
