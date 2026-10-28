import QRCode from 'qrcode';
import Swal from 'sweetalert2';

/**
 * Generates QR Code Data URL (PNG)
 */
export async function generateQrDataUrl(text: string, width = 250): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width,
      margin: 1,
      color: {
        dark: '#064e3b',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('Failed to generate QR Code:', err);
    return '';
  }
}

/**
 * Downloads document as Microsoft Word (.doc)
 */
export function exportHtmlToWord(
  htmlContent: string,
  title: string
): void {
  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
      <style>
        @page Section1 {
          size: 210mm 297mm;
          mso-page-orientation: portrait;
          margin: 20mm 20mm 20mm 25mm;
        }
        div.Section1 { page: Section1; }
        body {
          font-family: 'Times New Roman', serif;
          font-size: 11pt;
          line-height: 1.4;
          color: #000;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        table.signature-table, table.signature-table td, table.signature-table tr {
          border: none !important;
        }
        .official-kop-divider {
          border-top: 2.5px solid #000;
          border-bottom: 1px solid #000;
          height: 3px;
          margin-top: 8px;
          margin-bottom: 18px;
        }
      </style>
    </head>
    <body>
      <div class="Section1">
        ${htmlContent}
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', wordHtml], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeFilename = title.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_') + '.doc';
  a.download = safeFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  Swal.fire({
    title: 'File Word Berhasil Diunduh!',
    text: `Dokumen disimpan sebagai ${safeFilename}`,
    icon: 'success',
    timer: 2000,
    showConfirmButton: false
  });
}

// Backward-compatible alias
export const downloadAsWordDoc = (title: string, htmlContent: string) => exportHtmlToWord(htmlContent, title);

/**
 * Prints content from an element ID
 */
export function printElementById(elementId: string): void {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Cetak Dokumen Resmi - SD Islam Imama</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 1.5cm 1.5cm 1.5cm 2cm;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #000;
            margin: 0;
            padding: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          table.signature-table, table.signature-table td, table.signature-table tr {
            border: none !important;
          }
          .official-kop-divider {
            border-top: 2.5px solid #000;
            border-bottom: 1px solid #000;
            height: 3px;
            margin-top: 8px;
            margin-bottom: 18px;
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
        <script>
          window.onload = function() {
            window.focus();
            window.print();
            setTimeout(function() { window.close(); }, 1000);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

// Backward-compatible alias
export const printLetterDocument = printElementById;

/**
 * Prints raw HTML content in a new window
 */
export function printHtmlContent(htmlContent: string): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Cetak Surat Resmi - SD Islam Imama</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 1.5cm 1.5cm 1.5cm 2cm;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #000;
            margin: 0;
            padding: 15px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          table.signature-table, table.signature-table td, table.signature-table tr {
            border: none !important;
          }
          .official-kop-divider {
            border-top: 2.5px solid #000;
            border-bottom: 1px solid #000;
            height: 3px;
            margin-top: 8px;
            margin-bottom: 18px;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
        <script>
          window.onload = function() {
            window.focus();
            window.print();
            setTimeout(function() { window.close(); }, 1000);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Copies text to clipboard with alert
 */
export async function copyToClipboard(text: string, title = 'Tersalin!'): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    Swal.fire({
      title,
      text: 'Teks berhasil disalin ke clipboard.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  } catch (e) {
    console.error('Copy failed:', e);
  }
}
