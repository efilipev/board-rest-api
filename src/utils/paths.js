const main = "/";

const login = "/api/login";
const register = "/api/register";
const updateUser = "/api/me";
const currentUser = "/api/me";
const getUserById = "/api/user/:id";
const searchUsers = "/api/user";

const createItem = "/api/item";
const getItem = "/api/item/:id";
const searchItems = "/api/item";
const deleteItem = "/api/item/:id";
const updateItem = "/api/item/:id";
const uploadItemImage = "/api/item/:id/image";
const removeItemImage = "/api/item/:id/image";

module.exports = {
    main,
    login,
    register,
    updateUser,
    currentUser,
    getUserById,
    searchUsers,
    createItem,
    getItem,
    searchItems,
    deleteItem,
    updateItem,
    uploadItemImage,
    removeItemImage,
};
