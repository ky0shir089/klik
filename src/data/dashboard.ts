export const dashboard = async () => {
  return {
    data: {
      totalInvoices: 45231890,
      invoicesCount: 2350,
      monthlyInvoicesCount: 265,
      pendingPV: 12,
      activeNow: 573,
      recentInvoices: [
        {
          id: "INV/2024/001",
          customer: "PT. Sinar Jaya",
          amount: 1999000,
        },
        {
          id: "INV/2024/002",
          customer: "CV. Maju Mundur",
          amount: 39000,
        },
      ],
    },
  };
};