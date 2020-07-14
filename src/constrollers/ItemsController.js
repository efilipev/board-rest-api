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

const express = require("express");
const trimBearer = require("../utils/http");

const router = express.Router();
const service = new ItemService();

router.get(getItem, (req, res) => {
    const { id } = req.params;
    if (id) {
        service.getItemById(id).then((item) => {
            res.status(200).json(item);
        });
    } else {
        throw new NotFoundException();
    }
});

router.put(updateItem, (req, res) => {
    const auth = trimBearer(req.header("Authorization"));
    if (!auth) {
        throw new UnauthorizedException();
    }
    const { title, price, id } = req.params;
    if (!id) {
        throw new ForbiddenException("Item id is required");
    }
    if (!title || !price) {
        throw new ForbiddenException("Item title, price must be not null");
    }
    service.updateItem(title, price, id).then((result) => {
        if (result === 1) {
            res.status(200).json({});
        } else {
            throw new NotFoundException();
        }
    });
});

router.delete(deleteItem, (req, res) => {
    const auth = trimBearer(req.header("Authorization"));
    if (!auth) {
        throw new UnauthorizedException();
    }
    const { id } = req.params;
    service.deleteItem(id).then((result) => {
        if (result === 1) {
            res.status(200).json({});
        } else {
            throw new NotFoundException();
        }
    });
});

router.post(createItem, (req, res) => {
    const auth = trimBearer(req.header("Authorization"));
    if (!auth) {
        throw new UnauthorizedException();
    }
    const item = req.body;
    if (!item) {
        throw new ForbiddenException();
    }
    if (!item.title || !item.price) {
        throw new UnsupportedException(item.field, "Title or price is required");
    }
    if (!item.user_id) {
        throw new ForbiddenException(`user_id is required`);
    }
    service.create(item).then((item) => {
        res.status(200).json(item);
    });
});

router.post(uploadItemImage, (req, res) => {
    const auth = trimBearer(req.header("Authorization"));
    if (!auth) {
        throw new UnauthorizedException();
    }
    const { id } = req.params;
    if (!id) {
        throw new ForbiddenException();
    }
    service.uploadItemImage(req.body.file, id).then((result) => {
        if (result[0] === 1) {
            service.getItemById(id).then((item) => {
                res.status(200).json(item);
            });
        } else {
            throw new UnsupportedException(
                "message",
                `The FIle ${req.body.file} is to big!!!`
            );
        }
    });
});

router.delete(removeItemImage, (req, res) => {
    const auth = trimBearer(req.header("Authorization"));
    if (!auth) {
        throw new UnauthorizedException();
    }
    const { id } = req.params;
    if (!id) {
        throw new ForbiddenException();
    }
    service.removeItemImage(id).then((result) => {
        if (result[0] === 1) {
            res.status(200).json({});
        } else {
            throw new NotFoundException();
        }
    });
});

router.get(searchItems, (req, res, next) => {
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
        service.searchItems(title, order_by, order_type).then((result) => {
            res.status(200).json(result);
        });
    }
});

module.exports = router;
