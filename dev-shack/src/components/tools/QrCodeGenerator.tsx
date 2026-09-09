'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { ToolHeader } from '../ui/ToolHeader';
import { ToolDefinition } from '@/types/tools';
import { Download, Wifi, Link, Mail, User, FileText, QrCode as QrIcon } from 'lucide-react';
import { CopyButton } from '../ui/CopyButton';

interface Props {
  tool: ToolDefinition;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function QrCodeGenerator({ tool, isFavorite, onToggleFavorite }: Props) {
  const [contentType, setContentType] = useState<'url' | 'text' | 'wifi' | 'email' | 'vcard'>('url');
  const [urlInput, setUrlInput] = useState('https://devshack.io');
  const [textInput, setTextInput] = useState('Welcome to DevShack!');
  
  // WiFi
  const [wifiSsid, setWifiSsid] = useState('Office_5G');
  const [wifiPass, setWifiPass] = useState('SuperSecretPass123');
  const [wifiAuth, setWifiAuth] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // Email
  const [emailTo, setEmailTo] = useState('hello@devshack.io');
  const [emailSubject, setEmailSubject] = useState('DevShack Feedback');
  const [emailBody, setEmailBody] = useState('Hey team, love the dev toolkit!');

  // vCard
  const [vcardName, setVcardName] = useState('Alex Morgan');
  const [vcardPhone, setVcardPhone] = useState('+1 (555) 234-5678');
  const [vcardEmail, setVcardEmail] = useState('alex@devshack.io');
  const [vcardOrg, setVcardOrg] = useState('DevShack Tech');

  // Styles
  const [fgColor, setFgColor] = useState('#10b981');
  const [bgColor, setBgColor] = useState('#09090b');
  const [eccLevel, setEccLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Compute payload string
  let rawPayload = '';
  if (contentType === 'url') {
    rawPayload = urlInput;
  } else if (contentType === 'text') {
    rawPayload = textInput;
  } else if (contentType === 'wifi') {
    rawPayload = `WIFI:T:${wifiAuth};S:${wifiSsid};P:${wifiPass};;`;
  } else if (contentType === 'email') {
    rawPayload = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  } else if (contentType === 'vcard') {
    rawPayload = `BEGIN:VCARD\nVERSION:3.0\nN:${vcardName}\nORG:${vcardOrg}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`;
  }

  // Generate QR Code data URL asynchronously
  useEffect(() => {
    let active = true;
    if (!rawPayload.trim()) {
      return;
    }
    QRCode.toDataURL(rawPayload, {
      width: 320,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel: eccLevel,
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {
        if (active) setQrDataUrl('');
      });
    return () => {
      active = false;
    };
  }, [rawPayload, fgColor, bgColor, eccLevel]);

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qrcode-${contentType}-${Date.now()}.png`;
    a.click();
  };

  return (
    <div id="qr-code-generator-tool" className="flex flex-col h-full">
      <ToolHeader
        tool={tool}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        copyText={rawPayload}
        extraActions={
          <button
            type="button"
            id="download-qr-btn"
            onClick={handleDownloadPng}
            disabled={!qrDataUrl}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>
        }
      />

      {/* Content Type Selector */}
      <div className="flex flex-wrap items-center gap-2 p-2 mb-4 bg-zinc-900/90 border border-zinc-800 rounded-xl">
        {[
          { id: 'url', label: 'URL / Link', icon: Link },
          { id: 'text', label: 'Plain Text', icon: FileText },
          { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
          { id: 'email', label: 'Email Prompt', icon: Mail },
          { id: 'vcard', label: 'vCard Contact', icon: User },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = contentType === item.id;
          return (
            <button
              key={item.id}
              type="button"
              id={`qr-tab-${item.id}`}
              onClick={() => setContentType(item.id as typeof contentType)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Inputs + Live QR Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left Inputs Column */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
            {contentType === 'url' && (
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  Target Website URL
                </label>
                <input
                  type="text"
                  id="qr-url-input"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs md:text-sm font-mono text-zinc-200 focus:outline-none focus:border-zinc-700"
                />
              </div>
            )}

            {contentType === 'text' && (
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  Plain Text Content
                </label>
                <textarea
                  id="qr-text-input"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type any message, serial number, or note..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs md:text-sm font-mono text-zinc-200 focus:outline-none focus:border-zinc-700 min-h-[120px]"
                />
              </div>
            )}

            {contentType === 'wifi' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Wi-Fi Network Name (SSID)
                  </label>
                  <input
                    type="text"
                    id="wifi-ssid-input"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="SSID"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Wi-Fi Password
                  </label>
                  <input
                    type="text"
                    id="wifi-pass-input"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Security Encryption
                  </label>
                  <div className="flex items-center bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs">
                    {(['WPA', 'WEP', 'nopass'] as const).map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setWifiAuth(a)}
                        className={`flex-1 py-1 rounded font-medium ${
                          wifiAuth === a ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {a === 'nopass' ? 'Open (No Pass)' : a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {contentType === 'email' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Recipient Email</label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Subject line"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Email Body</label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Pre-populated message..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none min-h-[70px]"
                  />
                </div>
              </div>
            )}

            {contentType === 'vcard' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={vcardName}
                    onChange={(e) => setVcardName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Organization / Company</label>
                  <input
                    type="text"
                    value={vcardOrg}
                    onChange={(e) => setVcardOrg(e.target.value)}
                    placeholder="Company name"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={vcardPhone}
                    onChange={(e) => setVcardPhone(e.target.value)}
                    placeholder="+1 555-0100"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Email</label>
                  <input
                    type="email"
                    value={vcardEmail}
                    onChange={(e) => setVcardEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Color & ECC Styling Controls */}
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Foreground Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-8 h-8 rounded border border-zinc-700 cursor-pointer bg-transparent"
                />
                <span className="font-mono text-xs text-zinc-300">{fgColor}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded border border-zinc-700 cursor-pointer bg-transparent"
                />
                <span className="font-mono text-xs text-zinc-300">{bgColor}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Error Correction</label>
              <div className="flex items-center bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs">
                {(['L', 'M', 'Q', 'H'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEccLevel(lvl)}
                    className={`flex-1 py-1 rounded font-mono ${
                      eccLevel === lvl ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right QR Preview Column */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-zinc-950 border border-zinc-800 rounded-2xl">
          <div className="text-xs font-semibold text-zinc-400 mb-4 flex items-center gap-1.5">
            <QrIcon className="w-4 h-4 text-emerald-400" />
            <span>High-Res QR Code Preview</span>
          </div>

          {qrDataUrl ? (
            <div
              className="p-4 rounded-2xl shadow-xl border border-zinc-800/80 transition-all flex items-center justify-center"
              style={{ backgroundColor: bgColor }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="Generated QR Code"
                className="w-56 h-56 object-contain rounded"
              />
            </div>
          ) : (
            <div className="w-56 h-56 flex items-center justify-center border border-dashed border-zinc-800 rounded-2xl text-zinc-500 text-xs">
              Generating QR...
            </div>
          )}

          <div className="mt-5 w-full">
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
              <span>Encoded Raw Payload</span>
              <CopyButton text={rawPayload} size="sm" variant="ghost" />
            </div>
            <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800 font-mono text-[11px] text-zinc-400 break-all max-h-20 overflow-y-auto">
              {rawPayload || '(empty)'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
