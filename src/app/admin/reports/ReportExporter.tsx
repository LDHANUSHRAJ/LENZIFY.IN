import { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel, AlignmentType, WidthType, BorderStyle } from "docx";
import { saveAs } from "file-saver";
import { Download, FileSpreadsheet, FileText, FileBadge } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReportExporter({ data, activeTab }: { data: any[], activeTab: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, activeTab.toUpperCase());
    XLSX.writeFile(wb, `Lenzify_Report_${activeTab}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF("landscape");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(`LENZIFY ${activeTab.toUpperCase()} PROTOCOL`, 14, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated exactly: ${new Date().toLocaleString()}`, 14, 28);
    
    if (data.length === 0) {
      doc.text("NO DATA AVAILABLE", 14, 40);
      doc.save(`Lenzify_Report_${activeTab}.pdf`);
      return;
    }

    const columns = Object.keys(data[0]);
    const rows = data.map(obj => columns.map(col => String(obj[col])));

    autoTable(doc, {
      startY: 35,
      head: [columns],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [40, 40, 40], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`Lenzify_Report_${activeTab}.pdf`);
  };

  const exportWord = async () => {
    if (data.length === 0) return;
    const columns = Object.keys(data[0]);

    const createCell = (text: string, isHeader: boolean = false) => new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text, bold: isHeader, font: "Inter", size: 16 })], alignment: AlignmentType.CENTER })],
      shading: isHeader ? { fill: "F5F5F5" } : undefined,
      margins: { top: 100, bottom: 100, left: 100, right: 100 }
    });

    const tableRows = [
      new TableRow({ children: columns.map(c => createCell(c, true)) }),
      ...data.map(item => new TableRow({ children: columns.map(c => createCell(String(item[c]))) }))
    ];

    const table = new Table({
      rows: tableRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
      }
    });

    const doc = new Document({
      creator: "Lenzify Internal Systems",
      sections: [{
        properties: {},
        children: [
          new Paragraph({ text: `LENZIFY ${activeTab.toUpperCase()} INTELLIGENCE`, heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: `Generated: ${new Date().toLocaleString()}\n` }),
          table
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Lenzify_Report_${activeTab}.docx`);
  };

  return (
    <div className="relative">
       <button 
         onClick={() => setIsOpen(!isOpen)}
         className={cn(
           "px-8 py-3.5 border border-brand-navy text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4 transition-all duration-500",
           isOpen ? "bg-brand-navy text-white shadow-2xl" : "bg-white text-brand-navy hover:bg-brand-navy hover:text-white"
         )}
       >
          <Download size={16} />
          Compile Export
       </button>

       {isOpen && (
         <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-brand-navy/10 shadow-2xl z-50 flex flex-col p-2 space-y-1 animate-in fade-in slide-in-from-top-2">
            <button onClick={() => { exportExcel(); setIsOpen(false); }} className="w-full flex items-center gap-4 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#107C41] hover:bg-[#107C41]/10 transition-colors">
               <FileSpreadsheet size={16} /> Data Matrix (.xlsx)
            </button>
            <button onClick={() => { exportPDF(); setIsOpen(false); }} className="w-full flex items-center gap-4 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#E3242B] hover:bg-[#E3242B]/10 transition-colors">
               <FileText size={16} /> Static Report (.pdf)
            </button>
            <button onClick={() => { exportWord(); setIsOpen(false); }} className="w-full flex items-center gap-4 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#185ABD] hover:bg-[#185ABD]/10 transition-colors">
               <FileBadge size={16} /> Briefing (.docx)
            </button>
         </div>
       )}
    </div>
  );
}
