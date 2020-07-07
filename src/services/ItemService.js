const BaseService = require('../services/BaseService');
const { Item } = require('../db/models');

class ItemService extends BaseService {
    constructor(props) {
        super(props);
    }

    create( item ) {
        Item.create(item);
    }

}

module.exports = ItemService;
