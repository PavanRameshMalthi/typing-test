export const certificateGenerator = {
  drawCertificate(canvas, name, wpm, accuracy, difficulty, dateStr) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width;  // 1200
    const h = canvas.height; // 840

    // 1. Draw Background (elegant off-white parchment look)
    ctx.fillStyle = "#faf8f5";
    ctx.fillRect(0, 0, w, h);

    // Draw a subtle watermark background pattern (diagonal lines or circular arcs)
    ctx.strokeStyle = "rgba(191, 163, 111, 0.03)";
    ctx.lineWidth = 2;
    for (let i = -w; i < w; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
    }

    // 2. Draw Borders
    // Outer Gold Border
    const goldGrad = ctx.createLinearGradient(0, 0, w, h);
    goldGrad.addColorStop(0, "#d4af37");   // Gold metallic
    goldGrad.addColorStop(0.5, "#f3e5ab"); // Pale gold
    goldGrad.addColorStop(1, "#aa7c11");   // Dark gold

    ctx.strokeStyle = goldGrad;
    ctx.lineWidth = 10;
    ctx.strokeRect(30, 30, w - 60, h - 60);

    // Inner Thin Border
    ctx.strokeStyle = "#c5a059";
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, w - 90, h - 90);

    // Corner Ornaments
    this.drawCornerDecorations(ctx, w, h);

    // 3. Typography & Texts
    // Certificate Title
    ctx.fillStyle = "#1e293b"; // Slate-800
    ctx.textAlign = "center";
    
    ctx.setFont = (fontStr) => { ctx.font = fontStr; };
    
    ctx.font = "bold 44px 'Georgia', 'Times New Roman', serif";
    ctx.fillText("CERTIFICATE OF ACHIEVEMENT", w / 2, 140);

    ctx.font = "italic 20px 'Georgia', 'Times New Roman', serif";
    ctx.fillStyle = "#64748b"; // Slate-500
    ctx.fillText("This is proudly presented to", w / 2, 200);

    // Recipient Name
    ctx.font = "bold 52px 'Georgia', 'Times New Roman', serif";
    ctx.fillStyle = "#aa7c11"; // Gold Accent
    const cleanName = name.trim() || "Keyboard Champion";
    ctx.fillText(cleanName, w / 2, 280);

    // Name Underline
    ctx.beginPath();
    ctx.moveTo(w / 2 - 200, 305);
    ctx.lineTo(w / 2 + 200, 305);
    ctx.strokeStyle = "#c5a059";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Achievement statement
    ctx.font = "18px 'Arial', sans-serif";
    ctx.fillStyle = "#334155"; // Slate-700
    ctx.fillText(
      "for demonstrating outstanding keyboarding proficiency and speed in the Typing Speed Assessment.",
      w / 2,
      350
    );

    // 4. Draw Stats Card/Table
    const cardX = 200;
    const cardY = 400;
    const cardW = 800;
    const cardH = 150;
    
    ctx.fillStyle = "rgba(197, 160, 89, 0.05)"; // light gold tint
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.strokeStyle = "rgba(197, 160, 89, 0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(cardX, cardY, cardW, cardH);

    // Draw Grid Columns
    const cols = [
      { label: "TYPING SPEED", val: `${wpm} WPM` },
      { label: "ACCURACY", val: `${accuracy}%` },
      { label: "DIFFICULTY", val: difficulty.toUpperCase() },
      { label: "DATE", val: dateStr.split(",")[0] }
    ];

    const colWidth = cardW / 4;
    cols.forEach((col, idx) => {
      const xPos = cardX + idx * colWidth + colWidth / 2;
      
      // Label
      ctx.font = "bold 13px 'Arial', sans-serif";
      ctx.fillStyle = "#64748b"; // Slate-500
      ctx.fillText(col.label, xPos, cardY + 45);

      // Value
      ctx.font = "bold 32px 'Georgia', serif";
      ctx.fillStyle = "#1e293b"; // Slate-800
      ctx.fillText(col.val, xPos, cardY + 105);

      // Divider line (except last)
      if (idx < 3) {
        ctx.beginPath();
        ctx.moveTo(cardX + (idx + 1) * colWidth, cardY + 25);
        ctx.lineTo(cardX + (idx + 1) * colWidth, cardY + 125);
        ctx.strokeStyle = "rgba(197, 160, 89, 0.2)";
        ctx.stroke();
      }
    });

    // 5. Signatures and Seal
    // Signature lines
    const sigY = 690;
    const sigLineW = 200;
    
    // Left (Date)
    ctx.beginPath();
    ctx.moveTo(180, sigY);
    ctx.lineTo(180 + sigLineW, sigY);
    ctx.strokeStyle = "#94a3b8"; // Slate-400
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    ctx.font = "14px 'Arial', sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("Date of Issue", 180 + sigLineW / 2, sigY + 25);
    ctx.font = "bold 15px 'Georgia', serif";
    ctx.fillStyle = "#334155";
    ctx.fillText(dateStr.split(",")[0], 180 + sigLineW / 2, sigY - 15);

    // Right (Signature)
    ctx.beginPath();
    ctx.moveTo(820, sigY);
    ctx.lineTo(820 + sigLineW, sigY);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    ctx.font = "14px 'Arial', sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("Authorized Signature", 820 + sigLineW / 2, sigY + 25);

    // Draw Cursive mock signature
    ctx.font = "italic 32px 'Georgia', 'Brush Script MT', cursive";
    ctx.fillStyle = "#1e40af"; // Blue ink
    ctx.fillText("TypePlay Platform", 820 + sigLineW / 2, sigY - 15);

    // 6. Draw Circular Seal (Middle)
    const sealX = w / 2;
    const sealY = 670;
    const sealRadius = 55;

    // Outer spiked wheel
    ctx.fillStyle = goldGrad;
    ctx.beginPath();
    const spikes = 40;
    for (let i = 0; i < spikes; i++) {
      const angle = (i * Math.PI * 2) / spikes;
      const r = i % 2 === 0 ? sealRadius : sealRadius - 6;
      const sx = sealX + Math.cos(angle) * r;
      const sy = sealY + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.closePath();
    ctx.fill();

    // Inner gold circle
    ctx.fillStyle = "#d4af37";
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealRadius - 10, 0, Math.PI * 2);
    ctx.fill();

    // Inner white circle
    ctx.fillStyle = "#faf8f5";
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealRadius - 13, 0, Math.PI * 2);
    ctx.fill();

    // Seal text
    ctx.fillStyle = "#aa7c11";
    ctx.font = "bold 9px 'Arial', sans-serif";
    ctx.fillText("OFFICIAL SEAL", sealX, sealY - 12);
    
    // Ribbon shapes
    ctx.fillStyle = "#991b1b"; // Dark red ribbon
    // Ribbon left
    ctx.beginPath();
    ctx.moveTo(sealX - 25, sealY + sealRadius - 10);
    ctx.lineTo(sealX - 45, sealY + sealRadius + 40);
    ctx.lineTo(sealX - 25, sealY + sealRadius + 30);
    ctx.lineTo(sealX - 5, sealY + sealRadius - 10);
    ctx.closePath();
    ctx.fill();
    
    // Ribbon right
    ctx.beginPath();
    ctx.moveTo(sealX + 5, sealY + sealRadius - 10);
    ctx.lineTo(sealX + 25, sealY + sealRadius + 30);
    ctx.lineTo(sealX + 45, sealY + sealRadius + 40);
    ctx.lineTo(sealX + 25, sealY + sealRadius - 10);
    ctx.closePath();
    ctx.fill();

    // Re-draw outer spiked circle details if ribbon overlaps
    ctx.fillStyle = goldGrad;
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealRadius - 16, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#aa7c11";
    ctx.font = "bold 13px 'Georgia', serif";
    ctx.fillText("★ CERTIFIED ★", sealX, sealY + 8);
    ctx.font = "bold 8px 'Arial', sans-serif";
    ctx.fillText("KEYBOARD MASTER", sealX, sealY + 24);
  },

  drawCornerDecorations(ctx, w, h) {
    const size = 50;
    const offset = 45;
    
    ctx.strokeStyle = "#c5a059";
    ctx.lineWidth = 3;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(offset, offset + size);
    ctx.lineTo(offset, offset);
    ctx.lineTo(offset + size, offset);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(offset + 15, offset + 15, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#c5a059";
    ctx.fill();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(w - offset, offset + size);
    ctx.lineTo(w - offset, offset);
    ctx.lineTo(w - offset - size, offset);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(w - offset - 15, offset + 15, 10, 0, Math.PI * 2);
    ctx.fill();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(offset, h - offset - size);
    ctx.lineTo(offset, h - offset);
    ctx.lineTo(offset + size, h - offset);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(offset + 15, h - offset - 15, 10, 0, Math.PI * 2);
    ctx.fill();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(w - offset, h - offset - size);
    ctx.lineTo(w - offset, h - offset);
    ctx.lineTo(w - offset - size, h - offset);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(w - offset - 15, h - offset - 15, 10, 0, Math.PI * 2);
    ctx.fill();
  },

  downloadPDF(canvas, name) {
    const jsPDF = window.jspdf ? window.jspdf.jsPDF : null;
    if (!jsPDF) {
      alert("PDF library is not loaded. Check internet connection.");
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height]
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    doc.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
    
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, "_") || "Keyboard_Champion";
    doc.save(`typing_certificate_${cleanName}.pdf`);
  }
};
