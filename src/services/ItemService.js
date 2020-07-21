const BaseService = require("../services/BaseService");
const { Item, User } = require("../db/models");

function ItemService() {
    this.create = (item) => {
        return Item.create(item).then( () => Item.findOne({
            where: {
                created_at: item.created_at
            },
            include: [
                {
                    model: User,
                    as: "user",
                },
            ],
        }));
    };

    this.getItemById = (id) => {
        return Item.findOne({
            where: {
                id: id,
            },
            include: [
                {
                    model: User,
                    as: "user",
                },
            ],
        });
    };

    this.updateItem = (title, price, id) => {
        return Item.update(
            {
                title: title || null,
                price: price || null,
            },
            {
                where: {
                    id: id,
                },
            }
        ).then( () => Item.findOne(
            {
                where: {
                    title: title || null,
                    price: price || null
                },
                include: [
                    {
                        model: User,
                        as: "user",
                    },
                ]}
            ));
    };

    this.updateItemByTitle = (title, id) => {
        return Item.update(
            {
                title: title,
            },
            {
                where: {
                    id: id,
                },
            }
        ).then( () => Item.findOne(
            {
                where: {
                    title: title,
                },
                include: [
                    {
                        model: User,
                        as: "user",
                    },
                ]}
        ));
    };

    this.updateItemByPrice = (price, id) => {
        return Item.update(
            {
                price: price,
            },
            {
                where: {
                    id: id,
                },
            }
        ).then( () => Item.findOne(
            {
                where: {
                    price: price,
                },
                include: [
                    {
                        model: User,
                        as: "user",
                    },
                ]}
        ));
    };

    this.deleteItem = (id) => {
        return Item.destroy({
            where: {
                id: id,
            },
        });
    };

    this.uploadItemImage = (file, id) => {
        return Item.update(
            {
                image: file,
            },
            {
                where: {
                    id: id,
                },
            }
        );
    };

    this.removeItemImage = (id) => {
        return Item.update(
            {
                image: null,
            },
            {
                where: {
                    id: id,
                },
            }
        );
    };
    this.searchItems = (title, order_by, order_type) => {
        return Item.findAll({
            where: {
                title: title,
            },
            include: [
                {
                    model: User,
                    as: "user",
                },
            ],
            order: [[order_by, order_type]],
        });
    };
}

ItemService.prototype = BaseService.prototype;

module.exports = ItemService;
