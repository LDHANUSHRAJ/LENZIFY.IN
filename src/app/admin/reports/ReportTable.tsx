import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReportTable({ data, searchQuery, setSearchQuery }: { data: any[], searchQuery: string, setSearchQuery: (s:string)=>void }) {
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc'|'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const sortedAndFiltered = useMemo(() => {
    let result = [...data];
    if (searchQuery) {
      result = result.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [data, searchQuery, sortConfig]);

  const paginatedData = sortedAndFiltered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(sortedAndFiltered.length / pageSize);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'desc') {
       setSortConfig(null);
       return;
    }
    if (sortConfig?.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="relative max-w-sm w-full">
           <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/30" />
           <input 
             type="text" 
             placeholder="FILTER MATRIX..." 
             className="w-full pl-10 pr-4 py-3 bg-brand-background border border-brand-navy/10 text-[10px] font-bold uppercase tracking-widest text-brand-navy placeholder:text-brand-navy/30 focus:outline-none focus:border-secondary transition-colors"
             value={searchQuery}
             onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
           />
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-text-muted">
           <SlidersHorizontal size={14} />
           <span>{sortedAndFiltered.length} Entities Located</span>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-background/50 border-b border-brand-navy/10">
              {columns.map(col => (
                <th key={col} className="p-4 text-[9px] font-black uppercase tracking-[0.2em] text-brand-navy whitespace-nowrap cursor-pointer hover:bg-brand-navy/5 transition-colors select-none" onClick={() => handleSort(col)}>
                  <div className="flex items-center gap-2">
                     {col}
                     <div className="flex flex-col opacity-50">
                        <ChevronUp size={8} className={cn(sortConfig?.key === col && sortConfig.direction === 'asc' && "text-secondary opacity-100")} />
                        <ChevronDown size={8} className={cn("-mt-1", sortConfig?.key === col && sortConfig.direction === 'desc' && "text-secondary opacity-100")} />
                     </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-navy/5">
            {paginatedData.map((row, i) => (
              <tr key={i} className="hover:bg-brand-background transition-colors group">
                {columns.map(col => {
                  let val = row[col];
                  let isAmount = col === 'Amount' || col === 'Price' || col === 'Revenue' || col === 'Stock Value';
                  return (
                    <td key={col} className={cn("p-4 text-xs tracking-wider", isAmount ? "font-serif italic font-bold" : "font-medium")}>
                       {isAmount && val !== undefined ? `₹${Number(val).toLocaleString()}` : String(val !== undefined && val !== null ? val : "N/A")}
                    </td>
                  );
                })}
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="py-20 text-center text-[10px] font-bold uppercase tracking-widest text-brand-navy/30 italic">No operational data found for current filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4 border-t border-brand-navy/5">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-6 py-2 border border-brand-navy/10 text-[9px] font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-brand-background transition-colors"
          >
            Prev Set
          </button>
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-navy/50">Page {currentPage} of {totalPages}</span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-6 py-2 border border-brand-navy/10 text-[9px] font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-brand-background transition-colors"
          >
            Next Set
          </button>
        </div>
      )}
    </div>
  );
}
