import axiosInstance from './axiosConfig';
import { withFallback, DUMMY_CERTIFICATES } from './dummyData';

export const generateCertificate = async (courseId) =>
  withFallback(
    async () => (await axiosInstance.post(`/certificate/generate/${courseId}`)).data,
    () => ({
      certId: `cert${Date.now()}`,
      studentName: JSON.parse(localStorage.getItem('user') || '{}').name || 'Student',
      courseName: 'AI Readiness Program',
      issuedDate: new Date().toISOString(),
      score: 92,
      certificateNumber: `ZV-2025-${Math.floor(Math.random() * 9000 + 1000)}`,
    })
  );

export const downloadCertificate = async (certId) =>
  withFallback(
    async () =>
      (await axiosInstance.get(`/certificate/download/${certId}`, { responseType: 'blob' })).data,
    () => new Blob(['Certificate placeholder — demo mode'], { type: 'text/plain' })
  );

export const getMyCertificates = async () =>
  withFallback(
    async () => (await axiosInstance.get('/certificate/my')).data,
    () => DUMMY_CERTIFICATES
  );

export const getCertificateDetails = async (certId) =>
  withFallback(
    async () => (await axiosInstance.get(`/certificate/${certId}`)).data,
    () => DUMMY_CERTIFICATES.find((c) => c.id === certId) || DUMMY_CERTIFICATES[0]
  );
