export const isPremiumUser = (purchaseDate, daysForPremiumAccess) => {
  const currentDate = new Date();
  const purchaseDateObj = new Date(purchaseDate);
  const daysSincePurchase = Math.floor(
    (currentDate - purchaseDateObj) / (1000 * 60 * 60 * 24)
  );

  return daysSincePurchase < daysForPremiumAccess;
};
