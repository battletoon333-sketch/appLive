const waJoinValidation = require("../utils/waJoinValidation");
const axios = require("axios");
const cheerio = require('cheerio');
const waGroupModel = require("../models/waGroups");


async function fetchWaGroupByUrl(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            },
        });

        const $ = cheerio.load(response.data);

        // Step 3: Extract group details using Cheerio selectors
        const groupName = $('meta[property="og:title"]').attr("content"); // Group name
        const groupDescription = $('meta[property="og:description"]').attr("content"); // Group description
        const profilePic = $('meta[property="og:image"]').attr("content"); // Profile image URL

        if (groupName.includes('Telegram: Contact')) return false;
        return { status: true, name: groupName, description: groupDescription, image: profilePic };
    } catch (error) {
        return { status: false }
    }
}

const fetchUrl = async (req, res) => {
    try {
        const bodyValidation = waJoinValidation.submitUrl.validate(req.query);
        if (bodyValidation.error) throw new Error('Invalid Group URL !');
        console.log(req.query.url);
        
        const getData = await fetchWaGroupByUrl(req.query.url);
        if (!getData.status) throw new Error('No Group Exist!');
        delete getData.status;
        return res.status(200).send({
            status: 200,
            message: "success",
            data: getData
        })
    } catch (error) {
        return res.send({
            status: 400,
            message: error.message
        });
    }
}

const addGorup = async (req, res) => {
    try {
        const { error, value } = waJoinValidation.addGroup.validate(req.body);
        if (error) throw new Error('Invalid Group Data! Try Again');

        const isGroupExist = await waGroupModel.findOne({ url: value.url }).select('name');
        if (isGroupExist) throw new Error(`${isGroupExist.name} group already exists!`);

        // Optional: fetch from WhatsApp group page
        // const getData = await fetchWaGroupByUrl(value.url);
        // if (!getData || !getData.status) throw new Error('Failed to fetch group details from WhatsApp');
        // delete getData.status;

        const createGroup = new waGroupModel({
            userKey: value.userKey,
            url: value.url, // no conversion needed
            name: value.name, // or getData.name if fetched dynamically
            image: value.image, // or getData.image
            category: value.category || 'latest',
            description: value.description // or getData.description
        });

        const isRegistered = await createGroup.save();

        return res.status(200).send({
            status: 200,
            message: "Success",
            data: isRegistered
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            status: 400,
            message: error.message
        });
    }
};


const myGroups = async (req, res) => {
    try {
        const { error, value } = waJoinValidation.myGroups.validate(req.query);
        if (error) throw new Error('Invalid user Key !');

        const myGroups = await waGroupModel.find({
            userKey: value.userKey,
        }).select('_id name category views status image url').sort({ createdAt: -1 });

        return res.status(200).send({
            status: 200,
            message: "success",
            data: myGroups
        })
    } catch (error) {
        console.log(error);
        return res.send({
            status: 400,
            message: error.message
        });
    }
}

const getGroups = async (req, res) => {
    try {
        const { error, value } = waJoinValidation.getGroups.validate(req.query);
        if (error) throw new Error('Invalid user Key !');

        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided
        const skip = (page - 1) * limit; // Calculate how many items to skip

        let getGroups;
        if (value.category == 'all') {
            getGroups = await waGroupModel.find({
                status: 1
            })
                .select('_id url name image category views')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
        } else {
            getGroups = await waGroupModel.find({
                category: value.category,
                status: 1
            })
                .select('_id url name image category views')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
        }

        // Get the total count for pagination metadata
        const totalGroups = await waGroupModel.countDocuments({
            status: 1,
            ...(value.category !== 'all' && { category: value.category })
        });

        const totalPages = Math.ceil(totalGroups / limit); // Calculate the total number of pages

        return res.status(200).send({
            status: 200,
            message: "success",
            data: getGroups,
            pagination: {
                totalItems: totalGroups,
                totalPages: totalPages
            },
        });
    } catch (error) {
        console.log(error);
        return res.send({
            status: 400,
            message: error.message,
        });
    }
};


const increaseViews = async (req, res) => {
    try {
        const { groupId } = req.body;

        await waGroupModel.findByIdAndUpdate(
            groupId,
            { $inc: { views: 1 } }
        );

        return res.status(200).send({
            status: 200,
            message: 'View count increased successfully',
        });

    } catch (error) {
        console.log('Error in increaseViews:', error);
        return res.status(500).send({
            status: 500,
            message: 'Something went wrong',
        });
    }
};

const getGroupsForAdmin = async (req, res) => {
    try {
        const { error, value } = waJoinValidation.getGroupsForAdmin.validate(req.query);
        console.log(value);
        if (error) throw new Error( error);

        const userGroups = await waGroupModel.find({
            status: value.status
        });
        return res.status(200).send({
            status: 200,
            message: "success",
            data: userGroups
        })
    } catch (error) {
        console.log(error);
        return res.send({
            status: 400,
            message: error.message
        });
    }
}

const approveGroup = async (req, res) => {
    try {
        const { error, value } = waJoinValidation.approveGroup.validate(req.body);
        if (error) throw new Error('Invalid requested Group id  !');

        const isStatusChanged = await waGroupModel.findByIdAndUpdate(value.id, {
            status: req.body.status
        })

        if (!isStatusChanged) throw new Error('While Approving Group! something went Wrong.');

        return res.status(200).send({
            status: 200,
            message: "success",
            data: isStatusChanged
        })
    } catch (error) {
        return res.send({
            status: 400,
            message: error.message
        });
    }
}


module.exports = {
    fetchUrl, addGorup, myGroups, getGroups, increaseViews, getGroupsForAdmin, approveGroup
}