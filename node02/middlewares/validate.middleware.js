const {object} = require("yup");
module.exports = (req, res, next) => {
    //Sửa request
    const errors = req.flash("errors");
    req.errors = errors.length ? errors[0] : {};

    const old = req.flash("old");
    req.old = old.length ? old[0] : {};
    console.log(req.old);

    req.validate = async(data, rule={}) => {
        // console.log("data", data);
        const schema = object(rule);
        try {
            const body = await schema.validate(req.body, {
                abortEarly: false,
            });
            return body;
        } catch (e) {
            const errors = Object.fromEntries(
                e.inner.map((item) => [item.path, item.message])
            );
            // console.log("middleware",errors);
            console.log(errors);
            req.flash("errors", errors);
            req.flash("old", data);
        }
    };
    next();
};

