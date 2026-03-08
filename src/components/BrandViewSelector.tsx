import { useBrandLaunch } from '@/contexts/BrandLaunchContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function BrandViewSelector() {
  const { state, dispatch } = useBrandLaunch();

  return (
    <Select
      value={state.selectedBrandId}
      onValueChange={(v) => dispatch({ type: 'SELECT_BRAND', brandId: v })}
    >
      <SelectTrigger className="w-[220px] h-9 text-sm">
        <SelectValue placeholder="All Brands" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Brands</SelectItem>
        {state.brands.map((b) => (
          <SelectItem key={b.id} value={b.id}>
            {b.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
