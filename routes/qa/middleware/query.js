module.exports = {
    query: (req, res, next) => {
        let {count, page} = req.query;
        if (!count) {
            req.query.count = 5;
        } else {
            if (count === 'max') {
                req.query.count = 0;
            } else {
                req.query.count = parseInt(count);
            }

        }

        if (!page) {
            req.query.page = 0;
        } else {
            req.query.page = parseInt(page);
        }
        next();
    }


}