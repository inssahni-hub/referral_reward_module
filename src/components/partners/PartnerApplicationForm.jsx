import React, { useState } from 'react';
import { Send, FileCheck2, Info, RefreshCw } from 'lucide-react';

export default function PartnerApplicationForm({ onSubmitApplication }) {
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [taxInfo, setTaxInfo] = useState('');
  const [description, setDescription] = useState('');
  
  // social links
  const [twitter, setTwitter] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const [documentURL, setDocumentURL] = useState('https://example.com/docs/tax_registration.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleApply = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!companyName || !contactPerson || !email || !phone || !taxInfo) {
      setErrorMsg('All vital fields marked with * must be fully answered.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitApplication({
        companyName,
        contactPerson,
        email,
        phone,
        website,
        taxInfo,
        description,
        socialLinks: {
          twitter,
          facebook,
          instagram,
          linkedin
        },
        documents: [documentURL]
      });

      setSuccessMsg('Your application has been received successfully! Our board of directors will audit your tax inputs and credit coefficients shortly.');
      
      // Clear values
      setCompanyName('');
      setContactPerson('');
      setEmail('');
      setPhone('');
      setWebsite('');
      setTaxInfo('');
      setDescription('');
      setTwitter('');
      setFacebook('');
      setInstagram('');
      setLinkedin('');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.message || 'Onboard dispatch failed. Check network integrity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="partner_application_card" className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden max-w-4xl mx-auto">
      <div className="hidden bg-gradient-to-r from-slate-900 to-slate-950 px-8 py-7 text-white flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-sans">Ticketing Partner Onboarding</h2>
          <p className="text-blue-200 text-xs mt-0.5">Register your production house or event agency to participate in booking fee shares.</p>
        </div>
        <FileCheck2 className="w-10 h-10 text-blue-400" />
      </div>

      <form onSubmit={handleApply} className="p-8 space-y-6">
        {/* Core details */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest border-b border-slate-50 pb-2 mb-4">Enterprise Firmography</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Company Name *</label>
              <input
                id="apply_company_name"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Paramount Events Arena"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl focus:outline-none placeholder-slate-300 font-semibold text-slate-700"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Primary Contact Representative *</label>
              <input
                id="apply_contact_person"
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Michael Scott"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl focus:outline-none placeholder-slate-300 font-semibold text-slate-700"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Business email address *</label>
              <input
                id="apply_email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. partnerships@paramount.com"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl focus:outline-none placeholder-slate-300 font-semibold text-slate-700"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number *</label>
              <input
                id="apply_phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 (555) 555-0199"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl focus:outline-none placeholder-slate-300 font-semibold text-slate-700"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Corporate Website</label>
              <input
                id="apply_website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="e.g. https://paramount.com"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl focus:outline-none placeholder-slate-300 font-semibold text-slate-700"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tax Identification Code (EIN/VAT) *</label>
              <input
                id="apply_tax_info"
                type="text"
                value={taxInfo}
                onChange={(e) => setTaxInfo(e.target.value)}
                placeholder="e.g. EIN-11-223344"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl focus:outline-none placeholder-slate-300 font-semibold text-slate-700"
                required
              />
            </div>
          </div>
        </div>

        {/* Social channels */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest border-b border-slate-50 pb-2 mb-4">Promotional Channels (Social Indexes)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Twitter / X handle</label>
              <input
                id="apply_social_twitter"
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="@Xhandle"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Facebook Page URL</label>
              <input
                id="apply_social_facebook"
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/brand"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl focus:outline-none text-slate-700"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Instagram Handle</label>
              <input
                id="apply_social_instagram"
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@instagram"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">LinkedIn Profile</label>
              <input
                id="apply_social_linkedin"
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/company/brand"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl focus:outline-none text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Business Context */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Business Description</label>
            <textarea
              id="apply_description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State your main event catalogs, volume records, and organizational focus."
              rows="3"
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl focus:outline-none text-slate-700 font-semibold"
            ></textarea>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Uploaded Tax & Registration Certificates URL</label>
            <input
              id="apply_docs"
              type="text"
              value={documentURL}
              onChange={(e) => setDocumentURL(e.target.value)}
              placeholder="Cloud storage file link containing state licenses"
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl focus:outline-none font-mono text-slate-500"
            />
          </div>
        </div>

        {/* Status Messaging */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-xs font-semibold flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Submit triggers */}
        <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
          <p className="text-[10px] text-slate-400 max-w-sm">
            Applying connects you into our general revenue clearing cycles, issuing dynamic wallets instantly upon approval.
          </p>
          <button
            id="btn_submit_application"
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-6 py-3 bg-blue-600 hover:bg-slate-900 text-white hover:text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:bg-slate-100 disabled:text-slate-400"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Submitting Application...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Partnership Registration</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
