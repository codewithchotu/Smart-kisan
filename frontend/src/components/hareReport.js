import React from 'react';
import { Download, Share2, Printer, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { WhatsappShareButton, TwitterShareButton } from 'react-share';
import toast from 'react-hot-toast';

const ShareReport = ({ reportData }) => {
  const downloadPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) {
      toast.error('Report content not found');
      return;
    }
    
    toast.loading('Generating PDF...');
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('smart-kisan-report.pdf');
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const shareText = `Smart Kisan Report: ${reportData.summary}`;
  const shareUrl = window.location.href;

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <button onClick={downloadPDF} className="btn-secondary flex items-center gap-2">
        <Download size={16} /> Download PDF
      </button>
      
      <WhatsappShareButton url={shareUrl} title={shareText}>
        <button className="btn-secondary flex items-center gap-2 bg-green-100 hover:bg-green-200">
          <Share2 size={16} /> Share on WhatsApp
        </button>
      </WhatsappShareButton>
      
      <TwitterShareButton url={shareUrl} title={shareText}>
        <button className="btn-secondary flex items-center gap-2 bg-blue-100 hover:bg-blue-200">
          <Share2 size={16} /> Share on Twitter
        </button>
      </TwitterShareButton>
      
      <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2">
        <Printer size={16} /> Print
      </button>
    </div>
  );
};

export default ShareReport;