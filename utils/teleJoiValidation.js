const Joi = require("joi");

class teleJoiValidation {
    static submitUrl = Joi.object({
        url: Joi.string().uri().pattern(/^https:\/\/t\.me\/[a-zA-Z0-9_]+$/).required()
    });

    static addGroup = Joi.object({
        userKey: Joi.string().required().label('User Key'),
        url: Joi.string().uri().pattern(/^https:\/\/t\.me\/[a-zA-Z0-9_]+$/).required().label('URL'),
        name: Joi.string().required().label('Name'),
        image: Joi.string().uri().required().label('Image'),  
        category: Joi.string().required().allow('latest', 'games', 'dating', 'funny', 'education', 'friendship', 'videos', 'entertainment', 'sports', 'travels', 'foods', 'business', 'news', 'medical', 'technology', 'movies').label('User Key'),
        description: Joi.string().optional().label('Description')
    });
    static myGroups = Joi.object({
        userKey: Joi.string().required().label('User Key')
    });
    static getGroups = Joi.object({
        category: Joi.string().required().allow('all','latest', 'games', 'dating', 'funny', 'education', 'friendship', 'videos', 'entertainment', 'sports', 'travels', 'foods', 'business', 'news', 'medical', 'technology','movies').label('User Key'),
        page: Joi.number().integer().min(1).default(1).label('Page'),
    });

    static getGroupsForAdmin = Joi.object({
        status:Joi.number().allow(0,1,3)
    });

    static approveGroup = Joi.object({
        id:Joi.string().required(),
        status: Joi.number().valid(0, 1, 2).default(1).label('Status')
    })
}

module.exports = teleJoiValidation;
