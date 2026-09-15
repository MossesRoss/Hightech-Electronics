import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import {
  Phone,
  MapPin,
  ShieldCheck,
  Clock,
  Zap,
  ChevronRight,
  Star,
  CheckCircle2,
  X,
  MessageSquareQuote
} from 'lucide-react';

const COMPANY_NAME = "HITECH ELECTRONICS AND APPLIANCES";
const PRIMARY_PHONE = "+91 72000 12162";
const WHATSAPP_NUMBER = "917200012162";
const RADIUS_KM = 5;

const SERVICES = [
  { id: 'ac', name: 'AC Repair & Service', image: '/assets/services/ac.jpg' },
  { id: 'tv', name: 'LED / LCD TV Repair', image: '/assets/services/tv.jpg' },
  { id: 'wm', name: 'Washing Machine', image: '/assets/services/wm.jpg' },
  { id: 'fridge', name: 'Refrigerator', image: '/assets/services/fridge.jpg' },
  { id: 'micro', name: 'Microwave Oven', image: '/assets/services/micro.jpg' },
  { id: 'ro', name: 'Water Purifier (RO)', image: '/assets/services/ro.jpg' },
  { id: 'geyser', name: 'Water Heater / Geyser', image: '/assets/services/geyser.jpg' },
  { id: 'electrical', name: 'Electrical Works', image: '/assets/services/electrical.jpg' },
];

const LOCATIONS = [
  "Madukarai", "Eachanari", "Malumichampatti", "Othakalmandapam",
  "Chettipalayam", "Podanur", "Vellalur", "Singanallur",
  "Ondipudur", "Ramanathapuram", "Ukkadam", "Selvapuram",
  "Kuniyamuthur", "Kovaipudur", "Bhodipalayam", "Seerapalayam",
  "Kinathukadavu", "Sundarapuram", "Saramedu"
];

const REVIEWS = [
  { id: 1, name: "Kishor Kumar", rating: 5, date: "2 years ago", text: "Excellent service, reasonable charges, attended the service on time, following up on service." },
  { id: 2, name: "ANANDA MURUGESH", rating: 5, date: "2 years ago", text: "Excellent service, Extremely Professional behaviour." },
  { id: 3, name: "Praveen kumar.s", rating: 4, date: "2 years ago", text: "Good service and response." }
];

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [reviewsModalOpen, setReviewsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [locationVerified, setLocationVerified] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const trackConversion = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-17976277001/memdCMX_v4ccEInw4PtC'
      });
    }
  };

  const openBooking = (service) => {
    setSelectedService(service);
    setBookingModalOpen(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Track conversion immediately
    trackConversion();

    // Open WhatsApp synchronously to prevent popup blockers
    const text = `Hi, I am ${bookingData.name}. I need an emergency ${selectedService?.name || 'repair'} service at ${bookingData.address}. Coimbatore.`;
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');

    // Fire and forget Firebase tracking
    try {
      addDoc(collection(db, "leads"), {
        ...bookingData,
        service: selectedService?.name || "General Inquiry",
        timestamp: serverTimestamp(),
        source: window.location.hostname
      });
    } catch (error) {
      console.error("Database Error:", error);
    }

    setIsSubmitting(false);
    setBookingModalOpen(false);
    setBookingData({ name: '', phone: '', address: '' });
  };

  const handleWhatsAppRedirect = () => {
    trackConversion();
    const text = selectedService
      ? `Hi, I need an emergency ${selectedService.name} service in Coimbatore.`
      : `Hi, I need an emergency repair service in Coimbatore.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePincodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setPinCode(val);
    setLocationError('');
    setLocationVerified(false);

    if (val.length === 6) {
      if (val.startsWith('641') || val.startsWith('642')) {
        setLocationVerified(true);
        setTimeout(() => setBookingModalOpen(true), 800);
      } else {
        setLocationError(`SERVICE DENIED: Outside ${RADIUS_KM}km zone.`);
      }
    }
  };

  const verifyLocationSubmit = (e) => {
    e.preventDefault();
    if (pinCode.length < 6) return setLocationError("Enter 6-digit pincode.");
    if (!pinCode.startsWith('641') && !pinCode.startsWith('642')) setLocationError(`SERVICE DENIED: Outside ${RADIUS_KM}km zone.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white pb-20 md:pb-0 relative">

      {/* HEADER */}
      <div className="fixed top-0 w-full z-[999]">
        <header className={`w-full transition-all duration-200 bg-slate-950 border-b ${isScrolled ? 'border-emerald-500/20 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] py-3' : 'border-slate-800 py-4 md:py-5'}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-between items-center">
            <div className="flex items-center gap-3 overflow-hidden mr-4 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="text-lg md:text-xl font-black tracking-tighter text-white uppercase truncate">
                  <span className="md:hidden">HITECH REPAIRS</span>
                  <span className="hidden md:inline">{COMPANY_NAME}</span>
                </span>
              </div>
            </div>
            <div className="flex gap-4 items-center flex-shrink-0">
              <a href={`tel:${PRIMARY_PHONE}`} className="hidden md:flex items-center gap-2 font-bold text-slate-300 hover:text-white transition" onClick={trackConversion}>
                <Phone className="w-5 h-5 text-emerald-500" /> {PRIMARY_PHONE}
              </a>
              <button onClick={() => openBooking(null)} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-bold text-sm md:text-base shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all active:scale-95 uppercase">
                BOOK NOW
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-32 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950 -z-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-4 leading-[1.1] text-white">
            Fastest Appliance <span className="text-emerald-400">Repair.</span><br />
            In Coimbatore.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-medium">
            Expert technician fix all major home appliances. Fast, reliable service within {RADIUS_KM}km of Sundarapuram.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => openBooking(null)} className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-base md:text-lg px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] uppercase tracking-wide">
              Request Technician <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={handleWhatsAppRedirect} className="w-full sm:w-auto bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 text-base md:text-lg px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
              WhatsApp Us Fast
            </button>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-slate-800 py-6 text-left">
            <div className="flex items-center gap-3">
              <Clock className="text-emerald-500 w-5 h-5 shrink-0" />
              <div><div className="font-bold text-white">60 Min</div><div className="text-xs text-slate-400">Arrival Time</div></div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-500 w-5 h-5 shrink-0" />
              <div><div className="font-bold text-white">90 Days</div><div className="text-xs text-slate-400">Service Warranty</div></div>
            </div>
            <div onClick={() => setReviewsModalOpen(true)} className="flex items-center gap-3 cursor-pointer group p-2 -m-2 rounded-xl hover:bg-slate-900 transition-colors">
              <Star className="text-emerald-500 w-5 h-5 fill-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-bold text-white flex items-center gap-1">4.2/5 <ChevronRight className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0" /></div>
                <div className="text-xs text-slate-400 group-hover:text-emerald-400 transition-colors">See Reviews</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-emerald-500 w-5 h-5 shrink-0" />
              <div><div className="font-bold text-white">100% Local</div><div className="text-xs text-slate-400">Coimbatore Based</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- DIRECT CATALOG UI --- */}
      <section className="py-20 bg-slate-900 border-t border-slate-800 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-white">
              Select Appliance
            </h2>
            <p className="text-slate-400 text-sm md:text-base">Tap on any service below to dispatch a technician immediately.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {SERVICES.map((srv) => (
              <div
                key={srv.id}
                onClick={() => openBooking(srv)}
                className="group cursor-pointer flex flex-col"
              >
                <div className="w-full aspect-square md:aspect-[4/3] rounded-xl overflow-hidden bg-slate-800 mb-3 border border-slate-700 group-hover:border-emerald-500 transition-colors">
                  <img
                    src={srv.image}
                    alt={srv.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 400 300"><rect width="400" height="300" fill="%230f172a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23334155">ASSET REQUIRED</text></svg>';
                    }}
                  />
                </div>
                <h3 className="text-sm md:text-base font-bold text-slate-300 group-hover:text-emerald-400 transition-colors text-center">
                  {srv.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MAP SECTION --- */}
      <section className="py-16 md:py-20 bg-slate-950 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-slate-900/50 -skew-x-12 -z-10 transform origin-top-left"></div>
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-stretch">

          <div className="w-full lg:w-1/2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 z-10"></div>
            <div className="p-4 md:p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm absolute top-0 w-full z-10">
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-white">
                <MapPin className="text-emerald-500 w-6 h-6 shrink-0" /> {RADIUS_KM}km From Sundarapuram
              </h2>
            </div>
            <div className="flex-1 w-full bg-slate-800 min-h-[400px] relative">
              <iframe src="https://maps.google.com/maps?q=10S%2F12A%2C%20Rangaswamy%20Colony%2C%20Sundarapuram%2C%20Coimbatore%2C%20Tamil%20Nadu%20641024&t=&z=14&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{ border: 0, position: 'absolute', top: 0, left: 0 }} allowFullScreen="" loading="lazy" title="Map"></iframe>
            </div>
          </div>

          <div className="w-full lg:w-1/2 bg-slate-900 border border-slate-800 p-6 md:p-10 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Check Your Area</h2>
            <p className="text-slate-400 mb-6 text-sm md:text-base leading-relaxed">
              We provide quick service in <strong className="text-white">Coimbatore city and up to {RADIUS_KM}km around Sundarapuram</strong>.
            </p>

            {!locationVerified ? (
              <form onSubmit={verifyLocationSubmit} className="flex flex-col gap-3 mb-8">
                <div className="flex gap-2">
                  <input type="text" placeholder="Enter Pincode (e.g. 641024)" className={`flex-1 bg-slate-950 border p-3 text-white focus:outline-none font-mono transition-colors rounded-xl ${locationError ? 'border-red-500' : 'border-slate-700 focus:border-emerald-500'}`} maxLength={6} value={pinCode} onChange={handlePincodeChange} />
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 font-bold uppercase tracking-wide rounded-xl">Check</button>
                </div>
                {locationError && <div className="text-red-400 text-sm font-bold flex items-center gap-2 bg-red-500/10 border border-red-500/20 p-3 rounded-xl animate-in fade-in"><X className="w-5 h-5 shrink-0" /> {locationError}</div>}
              </form>
            ) : (
              <div className="flex items-center gap-3 bg-emerald-500/10 text-emerald-400 p-4 border border-emerald-500/30 rounded-xl animate-in fade-in mb-8">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <div><span className="block font-bold">Location Verified.</span><span className="text-sm">You are in our zone.</span></div>
              </div>
            )}

            <div className="border-t border-slate-800 pt-6">
              <h4 className="font-bold text-slate-300 mb-4 uppercase tracking-wider text-sm">High-Priority Zones:</h4>
              <div className="flex flex-wrap gap-2">
                {LOCATIONS.map(loc => (
                  <span key={loc} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span> {loc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-slate-600" />
            <span className="text-lg font-black tracking-tighter text-slate-600 uppercase">{COMPANY_NAME}</span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-slate-500 text-xs md:text-sm text-center md:text-right">© {new Date().getFullYear()} {COMPANY_NAME}. Based in Sundarapuram, Coimbatore.</p>
            <a href="https://srinicorp.com" target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-2 text-xs text-slate-600 hover:text-slate-400 transition-colors group">
              <span className="uppercase tracking-widest font-semibold text-[10px]">Powered by</span>
              <img src="/assets/logo.png" alt="Srinicorp" className="h-4 opacity-50 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'inline'; }} />
              <span style={{ display: 'none' }} className="font-bold tracking-wider text-slate-500 group-hover:text-emerald-500 transition-colors">SRINICORP.COM</span>
            </a>
          </div>
        </div>
      </footer>

      {/* --- FLOATING CTA BAR (MOBILE) --- */}
      <div className="fixed bottom-0 left-0 w-full md:hidden flex z-[80] shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        <button onClick={handleWhatsAppRedirect} className="w-1/2 bg-[#25D366] text-white font-bold py-4 flex justify-center items-center gap-2 transition-colors active:bg-[#1EBE5D]">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766 0 1.015.265 2.005.77 2.879l-.816 2.982 3.05-.801a5.727 5.727 0 002.764.712h.001c3.181 0 5.767-2.586 5.767-5.766 0-3.18-2.586-5.767-5.767-5.767m3.155 8.169c-.173.486-.988.948-1.378 1.006-.35.053-.836.143-2.428-.518-1.928-.799-3.167-2.761-3.264-2.89-.098-.129-.778-1.036-.778-1.975 0-.94.485-1.403.658-1.583.173-.18.376-.225.503-.225.129 0 .257.001.368.006.115.006.27-.044.422.324.158.384.538 1.316.586 1.411.047.096.079.208.016.336-.063.129-.095.208-.189.324-.095.115-.202.251-.285.35-.088.106-.182.223-.08.399.102.177.454.752.978 1.219.675.602 1.237.79 1.415.885.177.095.281.08.384-.038.106-.118.455-.53.576-.713.123-.183.242-.152.404-.092.164.061 1.036.488 1.213.577.177.088.295.142.338.223.044.08.044.465-.129.951" />
            <path d="M12.031 2C6.495 2 2 6.495 2 12.032c0 1.764.463 3.485 1.341 5.005L2 22l5.097-1.336A9.953 9.953 0 0012.031 22c5.535 0 9.999-4.464 9.999-10.001S17.566 2 12.031 2m0 18.238a8.214 8.214 0 01-4.2-1.155l-.302-.179-3.12.818.835-3.043-.197-.313A8.21 8.21 0 013.763 12.03c0-4.557 3.708-8.265 8.268-8.265 4.557 0 8.265 3.708 8.265 8.265 0 4.556-3.708 8.265-8.265 8.265" />
          </svg>
          WHATSAPP
        </button>
        <a href={`tel:${PRIMARY_PHONE}`} className="w-1/2 bg-slate-900 border-t border-slate-800 text-white font-bold py-4 flex justify-center items-center gap-2 transition-colors active:bg-slate-800" onClick={trackConversion}><Phone className="w-5 h-5 text-emerald-500" /> CALL</a>
      </div>

      {/* --- REVIEWS MODAL --- */}
      {reviewsModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-xl overflow-hidden animate-in fade-in zoom-in duration-200 shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2"><MessageSquareQuote className="w-6 h-6 text-emerald-500" /><h3 className="text-lg font-bold">Verified Reviews</h3></div>
              <button onClick={() => setReviewsModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
              <div className="flex items-center gap-4 border-b border-slate-800 pb-4 mb-4">
                <div className="text-4xl font-black text-white">4.2</div>
                <div>
                  <div className="flex gap-1 mb-1">{[1, 2, 3, 4].map(i => <Star key={i} className="w-4 h-4 text-emerald-500 fill-emerald-500" />)}<Star className="w-4 h-4 text-emerald-500/30 fill-emerald-500/30" /></div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Local Ratings</div>
                </div>
              </div>
              {REVIEWS.map((review) => (
                <div key={review.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <div className="flex justify-between items-start mb-2"><span className="font-bold text-white text-sm">{review.name}</span><span className="text-xs text-slate-500">{review.date}</span></div>
                  <div className="flex gap-1 mb-3">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-700 fill-slate-700'}`} />))}</div>
                  <p className="text-slate-300 text-sm leading-relaxed">"{review.text}"</p>
                </div>
              ))}
              <a href="https://www.sulekha.com/profile/hi-tech-electronics-home-appliances-sundarapuram-coimbatore" target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-center gap-2 w-full bg-slate-950 border border-slate-700 hover:border-emerald-500 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition-all shadow-lg">
                Check Sulekha <ChevronRight className="w-4 h-4 text-emerald-500" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* --- BOOKING MODAL --- */}
      {bookingModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-xl overflow-hidden animate-in fade-in zoom-in duration-200 mt-10 md:mt-0 shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-lg md:text-xl font-bold">Book Your Repair</h3>
              <button onClick={() => setBookingModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-4 md:p-6 max-h-[80vh] overflow-y-auto">
              {selectedService && (
                <div className="mb-6 bg-slate-800/50 p-3 md:p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Selected Service</div>
                    <div className="text-base md:text-lg font-bold text-white">{selectedService.name}</div>
                  </div>
                </div>
              )}
              <form className="space-y-4" onSubmit={handleBookingSubmit}>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-950 border border-slate-700 p-3 text-white focus:outline-none focus:border-emerald-500 rounded-xl"
                    placeholder="e.g. Ramesh"
                    value={bookingData.name}
                    onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    className="w-full bg-slate-950 border border-slate-700 p-3 text-white focus:outline-none focus:border-emerald-500 rounded-xl"
                    placeholder="+91 XXXXX XXXXX"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Address / Pincode</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-950 border border-slate-700 p-3 text-white focus:outline-none focus:border-emerald-500 rounded-xl"
                    placeholder="Sundarapuram, 641024"
                    value={bookingData.address}
                    onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 disabled:cursor-not-allowed text-slate-950 font-black text-base md:text-lg py-3 md:py-4 mt-4 uppercase tracking-wide rounded-xl transition-colors"
                >
                  {isSubmitting ? "Sending..." : "Send Technician Now"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}