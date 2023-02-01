const wallet = require('../models/wallet');
const S3service = require('../services/S3services')
const UserServices = require('../services/userservices');
const downloadHistoryTable = require('../models/downloadHistory');

require('dotenv').config();

function stringInvalid(str) {
    if (str == undefined || str.length === 0 || str == null)
        return true;
    else return false;
}


const downlaodExpense = async (req, res) => {

    try {
        const uId = req.user.id;
        if (!req.user.ispremiumuser) {
            return res.status(401).json({ success: false, error: 'Sorry, You are not a premium User' })
        }
        const expenses = await UserServices.getWallets(req);
        console.log(expenses);
        const userID = req.user.id;
        const stringifiedWallet = JSON.stringify(expenses);
        const filename = `Wallet${userID}/${new Date()}.txt`;
        const fileURL = await S3service.uploadToS3(stringifiedWallet, filename);
        await downloadHistoryTable.create({
            userId: userID,
            downloadURL: fileURL
        })
        return res.status(201).json({ fileURL, success: true });

    } catch (error) {
        return res.status(500).json({ fileURL: '', success: false, message: error });

    }


}
const postAddExp = async (req, res, next) => {
    try {
        const amount = req.body.amount;
        const detail = req.body.detail;
        const category = req.body.category;
        const userId = req.user.id;
        if (stringInvalid(amount) || stringInvalid(detail) || stringInvalid(category)) {
            return res.status(400).json({ success: false, err: "Missing input parameters" });
        }
        const data = await wallet.create({
            amount: amount,
            detail: detail,
            category: category,
            userId: userId
        })
        return res.status(201).json({ success: true, newExpenseDetail: data });
    } catch (err) {

        return res.status(403).json({
            success: false,
            error: err
        })
    }
}

const getExpense = async (req, res) => {
    try {
        console.log("hiii", req.query.ITEMS_PER_PAGE);
        let ITEMS_PER_PAGE = +(req.query.ITEMS_PER_PAGE) || 2;
        const page = +req.query.page || 1;
        let totalItems;

        await wallet
            .count({ where: { userId: req.user.id } })
            .then((total) => {
                totalItems = total;
            });

        const getWallet = await wallet.findAll({
            where: { userId: req.user.id },
            offset: (page - 1) * ITEMS_PER_PAGE,
            limit: ITEMS_PER_PAGE,
        });
        console.log(getWallet);
        return res.status(200).json({
            expense: getWallet,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        });
    } catch (err) {
        console.log("***GET expense failed***", JSON.stringify(err));
        return res.status(402).json({
            success: false,
            error: err,
        });
    }
};

const deleteExpense = async (req, res, next) => {
    try {
        const uId = req.params.id;
        const userId = req.user.userId;
        if (stringInvalid(uId)) {
            console.log('ID is missing');
            return res.status(400).json({ success: false, err: 'ID is missing' });
        }

        await wallet.destroy({ where: { id: uId, userId: userId } }).then((noOfRows) => {
            if (noOfRows === 0) {
                return res.status(404).json({ success: false, message: 'Expense doesnt belong to user' });
            }
            return res.status(200).json({ success: true, message: "Deleted successfully" })
        })

    } catch (err) {
        console.log('***DELETE failed***', JSON.stringify(err));
        res.status(500).json({
            success: false,
            error: err,
            message: 'deletion failed'
        })
    }
}

const editExpense = async (req, res, next) => {
    try {
        if (!req.params.id) {
            console.log('ID is missing');
            return res.status(400).json({ err: 'ID is missing' });
        }
        const uId = req.params.id;
        const updatedAmount = req.body.amount;
        const updatedDetail = req.body.detail;
        const updatedCategory = req.body.category;
        data = await wallet.update(
            { amount: updatedAmount, detail: updatedDetail, category: updatedCategory },
            { where: { id: uId } }
        )
        res.status(201).json({ newExpenseDetail: data });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        })
    }
}
const downloadHistory = async (req, res) => {
    const uID = req.user.id;


    const downloadhistory = await downloadHistoryTable.findAll({ where: { userId: uID } });



    return res.status(200).json({ success: true, downloadhistory });


}

module.exports = {
    downlaodExpense,
    downloadHistory,
    postAddExp,
    getExpense,
    deleteExpense,
    editExpense
}