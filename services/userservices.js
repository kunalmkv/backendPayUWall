const getWallets = (req, where) => {
    return req.user.getWallets(where);
}
module.exports = {
    getWallets
}