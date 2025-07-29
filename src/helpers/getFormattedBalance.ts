const getFormattedBalance = (balance: number, decimals: number): number => {
    return balance / 10 ** decimals;
};

export default getFormattedBalance;
