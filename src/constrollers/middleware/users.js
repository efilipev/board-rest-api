const Joi = require('joi');
const { responseWithError } = require('../../utils/http');
const {
    NotFoundException,
    UnsupportedException,
    UnauthorizedException
} = require('../../exceptions');

const {
    UserService,
    JwtTokenService,
    BcryptPasswordService,
} = require('../../services');

const service = new UserService();

const loginUserSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net']}}).required(),
    password: Joi.string().required()
});

const registerUserSchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net']}}).required(),
    password: Joi.string().required(),
    phone: Joi.string()
});

const withLogin = () => {
    return (req, res, next) => {
        const {error} = loginUserSchema.validate(req.body);
        const valid = error == null;
        if (valid) {
            next();
        } else {
            returnresponseWithError(422, new UnsupportedException('password', "Wrong email or password"), res);
        }
    }
};

const withRegister = () => {
    return (req, res, next) => {
        const {error} = registerUserSchema.validate(req.body);
        const valid = error == null;
        if (valid) {
            next(req.body);
        } else {
            returnresponseWithError(422, new UnsupportedException('password', "Wrong email or password"), res);
        }
    };
};

const withCreateToken = () => {
    return async (body, req, res, next) => {
        await BcryptPasswordService.generate(body.password);
        const token = JwtTokenService.createToken({
            created: new Date(),
            id: body.id,
            user: body.name,
            role: "user",
        });
        await service.create.call(this, body);
        next({token: token});
    }
};

const withGetId = () => {
    return async (req, res, next) => {
        const {id} = req.params;
        if (id) {
            next(id);
        } else {
            return responseWithError(404, new NotFoundException(), res);
        }
    };
};

const withUserQuery = () => {
    return (req, res, next) => {
        if (req.query) {
            next();
        } else {
            return responseWithError(422, new UnsupportedException('name or email', 'Wrong user name or email'), res);
        }
    }
};

const withDecodeToken = () => {
    return async (token, req, res, next) => {
        const decodedToken = await JwtTokenService.decodeToken(token);
        if (decodedToken) {
            next(decodedToken);
        } else {
            return responseWithError(422, new UnsupportedException('Wrong current password'), res);
        }
    }
};

const withFindByUserName = () => {
    return async (decodedToken, req, res, next) => {
        const user = await service.findUserByName(decodedToken.user);
        if (!user) {
            return responseWithError(422, new UnsupportedException('Such user has been not found'), res)
        }
        next(user);
    }
};

const withFindByUseremail = () => {
    return async (req, res, next) => {
        const user = req.body;
        const currentUser = await service.findByUseremail(user.email, res);
        if (!currentUser) {
            return responseWithError(422, new UnsupportedException('password', "Wrong email or password"), res);
        }
        const passed = await BcryptPasswordService.comparePassword(user.password, currentUser.password);
        if (!passed) {
            return responseWithError(422, new UnsupportedException('password', "Wrong email or password"), res);
        }
        const token = JwtTokenService.createToken({
            created: new Date(),
            id: currentUser.id,
            user: currentUser.name,
            role: "user",
        });
        next({token: token});
    }
};

const withFindByUserId = () => {
    return async (id, req, res, next) => {
        const user = await service.findUserById(id);
        if (user) {
            next(user);
        } else {
            return responseWithError(404, new NotFoundException(), res);
        }
    }
};

const withUpdateUser = () => {
    return async (decodedToken, req, res, next) => {
        const updatedUser = req.body;
        if (!updatedUser) {
            return responseWithError(422, new UnsupportedException('password', 'Wrong current email or password'), res);
        }
        if (!updatedUser.current_password  && !updatedUser.new_password) {
            return responseWithError(422,
                new UnsupportedException('password', 'Current password is required or provide a new_password'), res);
        }
        if (updatedUser.new_password) {
            await BcryptPasswordService.generate(updatedUser.new_password);
            const user = await service.updateUser(decodedToken.id, updatedUser);
            if (user) {
                next(user);
            } else {
                return responseWithError(404, new NotFoundException(), res);
            }
        } else {
            const user = await service.updateUser(decodedToken.id, updatedUser);
            if (user) {
                next(user);
            } else {
                return responseWithError(404, new NotFoundException(), res);
            }
        }
    }
};

const withSearchUser = () => {
    return async (req, res, next) => {
        const {name, email} = req.query;
        if (name && email) {
            const user = await service.searchUser({name, email});
            if (user) {
                next(user);
            } else {
                next([]);
            }
        }
        if (name) {
            const user = await service.searchUser({name});
            if (user) {
                next(user);
            } else {
                next([]);
            }
        }
        if (email) {
            const user = await service.searchUser({email});
            if (user) {
                next(user);
            } else {
                next([]);
            }
        }
    }
};

module.exports = {
    withLogin,
    withGetId,
    withRegister,
    withUserQuery,
    withSearchUser,
    withUpdateUser,
    withCreateToken,
    withDecodeToken,
    withFindByUserId,
    withFindByUserName,
    withFindByUseremail,
};
