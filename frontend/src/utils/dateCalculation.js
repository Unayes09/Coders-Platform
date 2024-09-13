export const isPremiumUser = (purchaseDate, daysForPremiumAccess) => {
  if(purchaseDate==null)return false;
  else{
    const currentDate = new Date();
    const purchaseDateObj = new Date(purchaseDate);
    const daysSincePurchase = Math.floor(
      (currentDate - purchaseDateObj) / (1000 * 60 * 60 * 24)
    );
    return daysSincePurchase < daysForPremiumAccess;
  }
};
