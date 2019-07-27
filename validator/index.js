exports.createPostValidator = (req, res, next) => {
    //title
    req.check('title',"Write a title").notEmpty();
    req.check('title', 'Title must be between 4-150 characters').isLength({
        min: 4,
        max: 150
    });

    //body
    req.check('body',"Write a Body").notEmpty();
    req.check('body', 'Body must be between 4-2000 characters').isLength({
        min: 4,
        max: 2000
    });

    //Check for errors
    const errors = req.validationErrors();

    if (errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({error: firstError});
    }

    next();
};

exports.userSignUpValidator = (req, res, next) =>{
    //Name
    req.check('name',"Name is Required").notEmpty();
    //Email
    req.check('email',"Email must be between 3-32 characters")
        .matches(/.+\@iiu\.edu\.pk/)
        .withMessage('Please use email provided by University')
        .isLength({
            min:4,
            max:2000
        });
    //Password

    req.check('password',"Password is Required").notEmpty();
    req.check('password')
        .isLength({
            min:6
        })
        .withMessage('Password must contain at-least 6 characters')
        .matches(/\d/)
        .withMessage('Password Must contain a number');

    //Check for errors
    const errors = req.validationErrors();

    if (errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({error: firstError});
    }

    next();
};

exports.passwordResetValidator = (req, res, next) => {
    // check for password
    req.check("newPassword", "Password is required").notEmpty();
    req.check("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long")
        .matches(/\d/)
        .withMessage("must contain a number")
        .withMessage("Password must contain a number");

    // check for errors
    const errors = req.validationErrors();
    // if error show the first one as they happen
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware or ...
    next();
};

