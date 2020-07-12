const BaseService = require('../services/BaseService');
const { Item, User } = require('../db/models');

function ItemService(){
    this.create = ( item ) => {
        return Item.create( item ).then( item => item.toJSON());
    };

    this.getItemById = ( id ) => {
        return Item.findOne({
            where: {
                id: id
            },
            include: [
                {
                    model: User,
                    as: 'user'
                }
            ]
        });
    };

    this.updateItem = ( title, price, id ) => {
        return Item.update( {
            title: title,
            price: price
        },{
            where: {
                id: id
            }
        })
    };
    this.deleteItem = ( id ) => {
        return Item.destroy({
            where: {
                id: id
            },
        });
    };

    this.uploadItemImage = ( file, id ) => {
        return Item.update({
            image: file
        },{
            where: {
                id: id
            }
        });
    };

    this.removeItemImage = ( id ) => {
        return Item.update({
            image: null
        }, {
            where: {
                id: id
            }
        })
    };
    this.searchItems = ( title, user_id ) => {
        return Item.findAndCountAll({
            where: {
                title: title,
                user_id: user_id,
            },
            include: [
                {
                    model: User,
                    as: 'user'
                }
            ],
            /*order: [
                ['order_by', order_by],
                ['order_type', order_type]
            ]*/
        });
    };

}

ItemService.prototype = BaseService.prototype;

module.exports = ItemService;
