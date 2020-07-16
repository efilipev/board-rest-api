const { ItemService } = require("../services");
const {
    NotFoundException,
    UnsupportedException,
    ForbiddenException,
    UnauthorizedException,
} = require("../exceptions");

const {
    getItem,
    updateItem,
    deleteItem,
    createItem,
    uploadItemImage,
    removeItemImage,
    searchItems,
} = require("../utils/paths");

const {
    trimBearer,
    responseWithError
} = require("../utils/http");

const express = require("express");

const router = express.Router();
const service = new ItemService();

router.get(getItem, async (req, res) => {
    const { id } = req.params;
    if (id) {
        const item = await service.getItemById(id);
        res.status(200).json(item);
    } else {
        responseWithError(404, new NotFoundException(), res);
    }
});

router.put(updateItem, async (req, res) => {
    const auth = trimBearer(req.header("Authorization"));
    if (!auth) {
        responseWithError(401, new UnauthorizedException(), res);
    }
    const { title, price, id } = req.params;
    if (!id) {
        responseWithError(403, new ForbiddenException("Item id is required"), res);
    }
    if (!title || !price) {
        responseWithError(403, new ForbiddenException("Item title, price must be not null"), res);
    }
    const result = await service.updateItem(title, price, id);
    if (result === 1) {
        res.status(200).json({});
    } else {
        responseWithError(404, new NotFoundException(), res);
    }
});

router.delete(deleteItem, async (req, res) => {
    const auth = trimBearer(req.header("Authorization"));
    if (!auth) {
        responseWithError(401, new UnauthorizedException(), res);
    }
    const { id } = req.params;
    const result = await service.deleteItem(id);
    if (result === 1) {
        res.status(200).json({});
    } else {
        responseWithError(404, new NotFoundException(), res);
    }
});

router.post(createItem, async (req, res) => {
    const auth = trimBearer(req.header("Authorization"));
    if (!auth) {
        responseWithError(401, new UnauthorizedException(), res);
    }
    const item = req.body;
    if (!item) {
        responseWithError(403, new ForbiddenException(), res);
    }
    if (!item.title || !item.price) {
        responseWithError(422, new UnsupportedException(item.field, "Title or price is required"), res);
    }
    if (!item.user_id) {
        responseWithError(403, new ForbiddenException(`user_id is required`));
    }
    const createdItem = await service.create(item);
    res.status(200).json(createdItem);
});

router.post(uploadItemImage, async (req, res) => {
    const auth = trimBearer(req.header("Authorization"));
    if (!auth) {
        responseWithError(401, new UnauthorizedException(), res);
    }
    const {id} = req.params;
    if (!id) {
        responseWithError(401, new ForbiddenException(), res);
    }
    const result = service.uploadItemImage(req.body.file, id);
    if (result[0] === 1) {
        service.getItemById(id).then((item) => {
            res.status(200).json(item);
        });
    } else {
        responseWithError(422,
            new UnsupportedException("message", `The FIle ${req.body.file} is to big!!!`), res);
    }
});

router.delete(removeItemImage, async (req, res) => {
    const auth = trimBearer(req.header("Authorization"));
    if (!auth) {
        responseWithError(401, new UnauthorizedException(), res);
    }
    const {id} = req.params;
    if (!id) {
        responseWithError(401, new ForbiddenException(), res);
    }
    const result = await service.removeItemImage(id);
    if (result[0] === 1) {
        res.status(200).json({});
    } else {
        responseWithError(404, new NotFoundException(), res);
    }
});

router.get(searchItems, async (req, res, next) => {
    let order_by = "create_at" || "price";
    let order_type = "desc" || "asc";
    const { title } = req.query;
    if (!res.query) {
        next();
    }
    if (req.query.order_by) {
        order_by = req.query.order_by;
    }
    if (req.query.order_type) {
        order_type = req.query.order_type;
    }
    if (!title) {
        next();
    } else {
        const result = await service.searchItems(title, order_by, order_type);
        res.status(200).json(result);
    }
});

module.exports = router;
