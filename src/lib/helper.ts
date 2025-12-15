export function sumUnitFields(
  units:
    | Array<{
        id: number;
        price: number;
        admin_fee: number;
        final_price: number;
      }>
    | undefined,
  selectedIds: number[] | undefined
) {
  if (!units || !selectedIds) {
    return { base: 0, fee: 0, final: 0 };
  }

  const selected = new Set(selectedIds);

  return units.reduce(
    (acc, unit) => {
      if (!selected.has(unit.id)) return acc;

      acc.base += unit.price || 0;
      acc.fee += unit.admin_fee || 0;
      acc.final += unit.final_price || 0;

      return acc;
    },
    { base: 0, fee: 0, final: 0 }
  );
}
