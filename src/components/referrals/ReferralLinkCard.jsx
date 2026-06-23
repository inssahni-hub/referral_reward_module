import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Calendar, Mail, Tag, ArrowUpRight } from 'lucide-react';

export default function ReferralLinkCard({ program = {}, onToggleActivity }) {
  const [copied, setCopied] = useState(false);

  const {
    referralCode = '',
    promoterEmail = '',
    eventName = '',
    eventSlug='',
    eventId = '',
    discountType = 'percentage',
    discountValue = 0,
    discountMode = 'per_ticket',
    commissionType = 'percentage',
    commissionValue = 0,
    isActive = true
  } = program;

  // Generate Referral Checkout URL linked to this exact event
  const VITE_WEBSITE = import.meta.env.VITE_WEBSITE;
  const referralUrl = `${VITE_WEBSITE}/booking/event/${eventSlug}?referralCode=${referralCode}&eventId=${eventId}`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-[#E5E2DE] p-6 rounded-sm shadow-none transition-all hover:border-[#1C1C1C] flex flex-col justify-between" id={`referral-card-${referralCode}`}>
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#A09E9B] font-bold block mb-1.5 truncate max-w-[180px]">
              {eventName}
            </span>
            <h3 className="text-base font-bold text-[#1C1C1C] tracking-tight flex items-center gap-1.5 font-mono uppercase">
              <Tag className="w-3.5 h-3.5 text-[#706E6B]" />
              {referralCode}
            </h3>
          </div>
          <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-sm ${
            isActive ? 'bg-[#E5F2E1] text-[#2D5A27] border border-[#2D5A27]/10' : 'bg-[#E5E2DE] text-[#706E6B]'
          }`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Info Rows */}
        <div className="space-y-2 mt-4 text-xs text-[#706E6B]">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-[#A09E9B] shrink-0" />
            <span className="truncate">Promoter: <span className="font-semibold text-[#1C1C1C]">{promoterEmail}</span></span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 bg-[#F7F5F2] p-3 rounded-sm border border-[#E5E2DE]">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-[#A09E9B] font-bold">Buyer Save</div>
              <div className="font-bold text-[#2D5A27] mt-0.5 text-sm">
                {discountType === 'percentage' ? `${discountValue}%` : `$${discountValue}`}
                <span className="text-[9px] text-[#706E6B] font-medium ml-1">
                  ({discountMode === 'per_ticket' ? 'ticket' : 'flat'})
                </span>
              </div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-[#A09E9B] font-bold">Promoter Comm</div>
              <div className="font-bold text-[#A34E24] mt-0.5 text-sm">
                {commissionType === 'percentage' ? `${commissionValue}%` : `$${commissionValue}`}
                <span className="text-[9px] text-[#706E6B] font-medium ml-1">
                  ({commissionType === 'percentage' ? 'paid' : 'flat'})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 pt-3 border-t border-[#F0EEEB] flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 text-[10px] uppercase tracking-wider py-2 px-3 border border-[#E5E2DE] bg-[#F7F5F2] hover:bg-white text-[#1C1C1C] font-bold rounded-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#2D5A27]" />
              <span className="text-[#2D5A27]">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#706E6B]" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        <a
          href={referralUrl} target='_blank'
          className="p-2 border border-[#E5E2DE] text-[#1C1C1C] hover:bg-[#F7F5F2] rounded-sm transition-colors cursor-pointer"
          title="Simulate Event Purchase Checkout"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
