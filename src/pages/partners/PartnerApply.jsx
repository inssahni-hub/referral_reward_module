import React from 'react';
import axios from "@/request/axiosReq";
import PartnerApplicationForm from '../../components/partners/PartnerApplicationForm.jsx';
import { ShieldCheck, ArrowLeft, HeartHandshake } from 'lucide-react';

export default function PartnerApply({ onBackToDashboard }) {
  const handleOnboardApplicationSubmit = async (formData) => {
    try {
      const response = await axios.post('/api/partners/apply', formData);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.error || error.message || "Failed to finalize registration.";
      throw new Error(msg);
    }
  };

  return (
    <PartnerApplicationForm onSubmitApplication={handleOnboardApplicationSubmit} />
  );
}
