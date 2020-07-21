const Joi = require('joi');
const { responseWithError } = require('../../utils/http');

const {
    NotFoundException,
    ForbiddenException,
    UnsupportedException,
} = require('../../exceptions');

const {
    ItemService,
    JwtTokenService
} = require('../../services');

const service = new ItemService();

const createItemSchema = Joi.object({
    title: Joi.string().min(4).required(),
    price: Joi.number().required()
});

const withGetItemId = () => {
    return async (req, res, next) => {
        const {id} = req.params;
        if (!id || id.trim() === '') {
           return responseWithError(403, new ForbiddenException(), res);
        }
        const item = await service.getItemById(id);
        if (item) {
           next(item);
        } else {
            return responseWithError(404, new NotFoundException(), res);
        }
    }
};

const withUpdateItem = () => {
    return async (token, req, res, next) => {
        const {id} = req.params;
        if (!id || id.trim() === '') {
           return responseWithError(403, new ForbiddenException('Item id is not defined'), res);
        }
        if (Object.keys(req.body).length === 0) {
            return responseWithError(403, new ForbiddenException('Item is not defined'), res);
        }
        const {title, price} = req.body;
        if (title) {
            if (title.length >= 3 && price) {
                const updatedItem = await service.updateItem(title, price, id);
                if (updatedItem) {
                    next(updatedItem);
                } else {
                    return responseWithError(404, {}, res);
                }
            }
            if (title.length >= 3 && !price) {
                const updatedItem = await service.updateItemByTitle(title, id);
                if (updatedItem) {
                    next(updatedItem);
                } else {
                    return responseWithError(404, {}, res);
                }
            }
        }
        if (price && !title) {
            const updatedItem = await service.updateItemByPrice(price, id);
            if (updatedItem) {
                next(updatedItem);
            } else {
                responseWithError(404, {}, res);
            }
        }
        if((!title || title.length < 3)) {
            return responseWithError(422, new UnsupportedException('Title should contain at least 3 characters'), res);
        } else {
            return responseWithError(422, new UnsupportedException('Price is not specified'), res);
        }
    }
};

const withCreateItem = () => {
    return async (token, req, res, next) => {
        const {title, price} = req.body;
        const {error} = createItemSchema.validate({title, price});
        const valid = error == null;
        if (!valid) {
            return responseWithError(422, new UnsupportedException(error.stack, error.message), res);
        }
        const decodedToken = JwtTokenService.decodeToken(token);
        const createdItem = await service.create(Object.assign({}, {
            created_at: new Date(),
            title: title,
            price: price,
            user_id: decodedToken.id
        }));
        if (createdItem) {
            next(createdItem);
        } else {
            return responseWithError(403, new ForbiddenException(), res);
        }
    }
};

const withUploadItemImage = () => {
    return async (token, req, res, next) => {
        const {id} = req.params;
        if (!id || id.trim() === '') {
            return responseWithError(401, new ForbiddenException(), res);
        }
        if (Object.keys(req.body).length === 0) {
            return responseWithError(403, new ForbiddenException('Item image is not defined'), res);
        }
        const [result] = await service.uploadItemImage(req.body.file, id);
        if (result === 1) {
            const item = await service.getItemById(id);
            if (item) {
                next(item);
            } else {
                return responseWithError(404, new NotFoundException(), res);
            }
        } else {
           return responseWithError(422,
                new UnsupportedException("message", `The FIle ${req.body.file} is to big!!!`), res);
        }
    }
};

const withDeleteItemImage = () => {
    return async (token, req, res, next) => {
        const {id} = req.params;
        if (id === null || id.trim() === '') {
            return responseWithError(403, new ForbiddenException(), res);
        }
        const [result] = await service.removeItemImage(id);
        if (result === 1) {
            next({});
        } else {
            return responseWithError(404, new NotFoundException(), res);
        }
    }
};

const withDeleteItem = () => {
    return async (token, req, res, next) => {
        const {id} = req.params;
        if (id === null || id.trim() === '') {
           return  responseWithError(403, new ForbiddenException(), res);
        }
        const result = await service.deleteItem(id);
        if (result === 1) {
            next({});
        } else {
            return responseWithError(404, new NotFoundException(), res);
        }
    }
};

const withSearchItems = () => {
    return async (req, res, next) => {
        let order_by = "create_at" || "price";
        let order_type = "desc" || "asc";
        const {title} = req.query;
        if (!title) {
            next([]);
        }
        if (req.query.order_by) {
            order_by = req.query.order_by;
        }
        if (req.query.order_type) {
            order_type = req.query.order_type;
        }
        const result = await service.searchItems(title, order_by, order_type);
        if (result) {
            next(result);
        } else {
            next([]);
        }
    }
};

module.exports = {
    withGetItemId,
    withUpdateItem,
    withDeleteItem,
    withCreateItem,
    withSearchItems,
    withDeleteItemImage,
    withUploadItemImage,
};
