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
    itemsMiddleware,
    withAuthorization,
    withSuccessResponse
} = require('../constrollers/middleware');

const {
    withGetItemId,
    withUpdateItem,
    withDeleteItem,
    withCreateItem,
    withSearchItems,
    withDeleteItemImage,
    withUploadItemImage,
} = itemsMiddleware;

const express = require("express");
const router = express.Router();

router.get(getItem, withGetItemId(), withSuccessResponse());

router.get(searchItems, withSearchItems(), withSuccessResponse());

router.post(createItem, withAuthorization(), withCreateItem(), withSuccessResponse());

router.post(uploadItemImage, withAuthorization(), withUploadItemImage(), withSuccessResponse());

router.put(updateItem, withAuthorization(), withUpdateItem(), withSuccessResponse());

router.delete(removeItemImage, withAuthorization(), withDeleteItemImage(), withSuccessResponse());

router.delete(deleteItem, withAuthorization(), withDeleteItem(), withSuccessResponse());

module.exports = router;
