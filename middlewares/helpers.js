const totalPayment = (arrayPrice, arrayQuantity) => {
    let total = 0;
    for (let i = 0; i < arrayPrice.length; i++) {
        total += arrayPrice[i] * arrayQuantity[i];
    }
    return total;
};

module.exports = {
    totalPayment,
};
