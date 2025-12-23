export function sumUnitFields(
  units:
    | Array<{
        id: number;
        price: number;
        ticket_price: number;
        admin_fee: number;
        final_price: number;
        distributed_price: number;
        diff_price: number;
      }>
    | undefined,
  selectedIds: number[] | undefined
) {
  if (!units || !selectedIds) {
    return { base: 0, ticket: 0, fee: 0, final: 0, distributed: 0, diff: 0 };
  }

  const selected = new Set(selectedIds);

  return units.reduce(
    (acc, unit) => {
      if (!selected.has(unit.id)) return acc;

      acc.base += unit.price || 0;
      acc.ticket += unit.ticket_price || 0;
      acc.fee += unit.admin_fee || 0;
      acc.final += unit.final_price || 0;
      acc.distributed += unit.distributed_price || 0;
      acc.diff += unit.diff_price || 0;

      return acc;
    },
    { base: 0, ticket: 0, fee: 0, final: 0, distributed: 0, diff: 0 }
  );
}
