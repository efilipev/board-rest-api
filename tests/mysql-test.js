const User = require('../src/models/User');

(async () => {
    User.sync({force: true})
        .then(()=> User.save({ id: 1, name: "Jane", password: '12345', email: 'mail@gmail.com', phone: '+338068'})
            .catch(e => console.log(e)));
})();
