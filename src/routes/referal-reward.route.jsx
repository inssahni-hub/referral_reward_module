// routes/EventRoutes.jsx

import { Routes, Route } from "react-router-dom";

import CheckAuth from "../components/common/check-auth";
import ProtectedRoute from "../components/common/ProtectedRoute";


// Partner

import Partners from "../pages/partners/Partners";

import PartnerDetails from "../pages/partners/PartnerDetails";

// referal && Promoter

import RewardCenter from "../pages/rewards/RewardCenter.jsx";
import ReferralPromoterCenter from "../pages/referrals/ReferralPromoterCenter.jsx";








export default function EventRoutes() {
  return (
    <Routes>
      <Route
        path="/admin"
        element={<CheckAuth />}
      >
        {/* ======================================================
            EVENTS
        ====================================================== */}

       

        <Route path="partners" element={<ProtectedRoute permissions={["event.view",]} ><Partners /></ProtectedRoute> }/>
        <Route path="partner/:partnerId" element={ <ProtectedRoute permissions={[ "event.view", ]} > <PartnerDetails /></ProtectedRoute> }/>
        <Route path="rewards" element={<RewardCenter />} />
        <Route path="referal-promoter-center" element={<ReferralPromoterCenter />} />

       

      </Route>
     
    </Routes>
  );
}