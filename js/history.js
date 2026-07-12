import { storage } from "./utils.js";

export const historyManager = {
  records: [],

  init() {
    this.records = storage.get("typingHistory", []);
    // Map old style records without paragraph/difficulty/duration to some defaults
    this.records = this.records.map((r) => ({
      date: r.date || new Date().toLocaleString(),
      wpm: typeof r.wpm === "number" ? r.wpm : 0,
      accuracy: typeof r.accuracy === "number" ? r.accuracy : 0,
      mistakes: typeof r.mistakes === "number" ? r.mistakes : 0,
      difficulty: r.difficulty || "medium",
      duration: r.duration || 60,
      paragraph: r.paragraph || "The quick brown fox jumps over the lazy dog."
    }));
    this.save();
  },

  addRecord(wpm, accuracy, mistakes, duration, difficulty, paragraph) {
    const newRecord = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      date: new Date().toLocaleString(),
      wpm,
      accuracy,
      mistakes,
      duration,
      difficulty,
      paragraph
    };
    this.records.push(newRecord);
    this.save();
    return newRecord;
  },

  deleteRecord(id) {
    this.records = this.records.filter((r) => r.id !== id);
    this.save();
  },

  clearAll() {
    this.records = [];
    this.save();
  },

  save() {
    storage.set("typingHistory", this.records);
  },

  getRecords() {
    return this.records;
  },

  searchAndSort(query = "", sortBy = "date-desc") {
    let filtered = [...this.records];
    
    // Filter by query (search in paragraph text or difficulty)
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (r) => r.paragraph.toLowerCase().includes(q) || r.difficulty.toLowerCase().includes(q)
      );
    }

    // Sort by criteria
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      switch (sortBy) {
        case "date-desc":
          return dateB - dateA;
        case "date-asc":
          return dateA - dateB;
        case "wpm-desc":
          return b.wpm - a.wpm;
        case "wpm-asc":
          return a.wpm - b.wpm;
        case "acc-desc":
          return b.accuracy - a.accuracy;
        case "acc-asc":
          return a.accuracy - b.accuracy;
        default:
          return dateB - dateA;
      }
    });

    return filtered;
  },

  // EXPORTERS
  exportCSV() {
    if (this.records.length === 0) return alert("No history records to export!");
    
    let csv = "Date,WPM,Accuracy (%),Mistakes,Duration (s),Difficulty,Paragraph\n";
    this.records.forEach((r) => {
      // Escape double quotes inside paragraphs
      const p = r.paragraph.replace(/"/g, '""');
      csv += `"${r.date}",${r.wpm},${r.accuracy},${r.mistakes},${r.duration},"${r.difficulty}","${p}"\n`;
    });

    this.downloadFile(csv, "typing_history.csv", "text/csv;charset=utf-8;");
  },

  exportJSON() {
    if (this.records.length === 0) return alert("No history records to export!");
    const json = JSON.stringify(this.records, null, 2);
    this.downloadFile(json, "typing_history.json", "application/json;charset=utf-8;");
  },

  exportPDF() {
    if (this.records.length === 0) return alert("No history records to export!");
    
    const jsPDF = window.jspdf ? window.jspdf.jsPDF : null;
    if (!jsPDF) {
      alert("PDF library is not loaded. Check internet connection.");
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Add styling
    doc.setFillColor(15, 23, 42); // slate-900 background for top banner
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Typing Learning & Gaming", 14, 18);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Personal Typing Test History & Performance Statistics", 14, 28);
    
    // Summary Stats
    const totalTests = this.records.length;
    const avgWpm = Math.round(this.records.reduce((sum, r) => sum + r.wpm, 0) / totalTests);
    const avgAcc = Math.round(this.records.reduce((sum, r) => sum + r.accuracy, 0) / totalTests);
    const bestWpm = Math.max(...this.records.map((r) => r.wpm));

    doc.setFillColor(241, 245, 249); // slate-100 background for summary card
    doc.rect(14, 46, 182, 18, "F");
    
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`Total Tests: ${totalTests}`, 20, 56);
    doc.text(`Avg WPM: ${avgWpm}`, 65, 56);
    doc.text(`Avg Accuracy: ${avgAcc}%`, 115, 56);
    doc.text(`Best WPM: ${bestWpm}`, 160, 56);

    // Table Header
    let y = 78;
    doc.setFillColor(51, 65, 85); // slate-700
    doc.rect(14, y - 6, 182, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Date", 16, y - 1);
    doc.text("WPM", 65, y - 1);
    doc.text("Accuracy", 90, y - 1);
    doc.text("Mistakes", 120, y - 1);
    doc.text("Diff.", 150, y - 1);
    doc.text("Duration", 175, y - 1);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    
    let pageCount = 1;
    
    // Table rows (showing sorted by date descending)
    const sorted = [...this.records].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sorted.forEach((r, index) => {
      y += 8;
      
      // Page break check (A4 is 297mm height)
      if (y > 270) {
        doc.addPage();
        pageCount++;
        y = 30;
        
        // Re-draw table header on new page
        doc.setFillColor(51, 65, 85);
        doc.rect(14, y - 6, 182, 8, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text("Date", 16, y - 1);
        doc.text("WPM", 65, y - 1);
        doc.text("Accuracy", 90, y - 1);
        doc.text("Mistakes", 120, y - 1);
        doc.text("Diff.", 150, y - 1);
        doc.text("Duration", 175, y - 1);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(51, 65, 85);
        y += 8;
      }
      
      // Zebra striping
      if (index % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, y - 6, 182, 8, "F");
      }
      
      // Text rendering
      doc.text(r.date.split(",")[0], 16, y - 1); // just the date part
      doc.text(r.wpm.toString(), 65, y - 1);
      doc.text(`${r.accuracy}%`, 90, y - 1);
      doc.text(r.mistakes.toString(), 120, y - 1);
      doc.text(r.difficulty.toUpperCase(), 150, y - 1);
      doc.text(`${r.duration}s`, 175, y - 1);
    });

    // Page numbers
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Page ${i} of ${pageCount}`, 105, 288, null, null, "center");
    }

    doc.save("typing_performance_report.pdf");
  },

  downloadFile(content, fileName, contentType) {
    const file = new Blob([content], { type: contentType });
    const a = document.createElement("a");
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
};
