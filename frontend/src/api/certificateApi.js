import axiosInstance from './axiosConfig';

export const generateCertificate = async (courseId) => {
  const response = await axiosInstance.post(`/certificate/generate/${courseId}`);
  return response.data;
};

export const downloadCertificate = async (certId) => {
  const response = await axiosInstance.get(`/certificate/download/${certId}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const getMyCertificates = async () => {
  const response = await axiosInstance.get('/certificate/my');
  return response.data;
};

export const getCertificateDetails = async (certId) => {
  const response = await axiosInstance.get(`/certificate/${certId}`);
  return response.data;
};
