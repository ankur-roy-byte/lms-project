import React from 'react';
import { Download, Award } from 'lucide-react';
import { format } from 'date-fns';
import * as certificateApi from '../api/certificateApi';
import { useToast } from './Toast';

const CertificateCard = ({ certificate, onDownload }) => {
  const { success, error } = useToast();

  const handleDownload = async () => {
    try {
      const blob = await certificateApi.downloadCertificate(certificate.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificate_${certificate.courseName}_${certificate.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      success('Certificate downloaded successfully');
    } catch (err) {
      error('Failed to download certificate');
      console.error(err);
    }
  };

  const issuedDate = new Date(certificate.issuedAt);

  return (
    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Certificate Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-5 h-5" />
          <span className="font-semibold">Certificate of Completion</span>
        </div>
        <h3 className="text-lg font-bold">{certificate.courseName}</h3>
      </div>

      {/* Certificate Content */}
      <div className="p-6">
        <div className="space-y-3 mb-6">
          <div>
            <label className="text-xs font-medium text-gray-600 uppercase">Issued To</label>
            <p className="text-gray-900 font-semibold">{certificate.userName}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 uppercase">Date Issued</label>
            <p className="text-gray-900">
              {format(issuedDate, 'MMMM dd, yyyy')}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 uppercase">Certificate Number</label>
            <p className="text-gray-900 font-mono text-sm">{certificate.id}</p>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default CertificateCard;
