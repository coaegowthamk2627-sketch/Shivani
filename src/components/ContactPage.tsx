import { useEffect, useState, type FormEvent } from 'react';
import type { User } from 'firebase/auth';
import { CheckCircle2, LogIn } from 'lucide-react';
import { PORTAL_DISCLAIMER } from '../data/iiserInstitutionsData';
import {
  signInWithGoogle,
  submitContactInquiry,
  subscribeToUserContacts,
  type ContactInquiryRecord,
} from '../lib/firebase';

interface ContactPageProps {
  currentUser: User | null;
  isAuthReady: boolean;
}

export function ContactPage({ currentUser, isAuthReady }: ContactPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Class 11–12 Aspirant');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');
  const [myInquiries, setMyInquiries] = useState<ContactInquiryRecord[]>([]);

  useEffect(() => {
    if (currentUser) {
      setName((prev) => prev || currentUser.displayName || '');
      setEmail((prev) => prev || currentUser.email || '');
      return subscribeToUserContacts(currentUser.uid, setMyInquiries);
    }
    setMyInquiries([]);
    return undefined;
  }, [currentUser]);

  const handleGoogleSignIn = async () => {
    setFeedback('');
    try {
      await signInWithGoogle();
    } catch (error) {
      setStatus('error');
      setFeedback(
        error instanceof Error ? error.message : 'Google Sign-In failed or was cancelled.'
      );
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setStatus('error');
      setFeedback('Please sign in with Google before submitting an inquiry.');
      return;
    }
    if (message.trim().length < 8) {
      setStatus('error');
      setFeedback('Please enter a message of at least 8 characters.');
      return;
    }
    setStatus('submitting');
    setFeedback('');
    try {
      await submitContactInquiry({ name, email, role, message });
      setStatus('success');
      setFeedback(
        'Your inquiry or correction note has been saved to Cloud Firestore. Thank you for helping keep IISER GUIDE accurate.'
      );
      setMessage('');
    } catch (error) {
      setStatus('error');
      setFeedback(
        error instanceof Error
          ? error.message
          : 'Could not submit inquiry. Please verify all fields.'
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-wider text-blue-800 uppercase">
          About, Privacy &amp; Contact
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 font-display">
          About IISER GUIDE &amp; Verification Policy
        </h1>
        <p className="text-base text-slate-700 leading-relaxed">
          IISER GUIDE is an independent educational knowledge portal dedicated to helping Class 9–12 students, parents, researchers, and job seekers navigate India&apos;s seven IISER institutions with verified, transparent data.
        </p>
      </div>

      {/* Mandatory Disclaimer */}
      <section className="bg-amber-50 border border-amber-200 rounded-xl p-6 space-y-2">
        <h2 className="text-lg font-semibold text-amber-950 font-display">
          Official Disclaimer &amp; Non-Affiliation Notice
        </h2>
        <p className="text-sm text-amber-900 leading-relaxed">{PORTAL_DISCLAIMER}</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Form */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
          <h2 className="text-xl font-semibold text-slate-900 font-display">
            Submit a Query or Official Data Correction
          </h2>

          {!isAuthReady ? (
            <p className="text-sm text-slate-600">Checking sign-in status...</p>
          ) : !currentUser ? (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <p className="text-sm text-slate-700 leading-relaxed">
                Sign in with your Google account to submit inquiries or official circular corrections directly to our database and track review status.
              </p>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-blue-900 text-white text-xs font-medium rounded-lg cursor-pointer"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>Sign in with Google to Submit</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="contact-role" className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Role
                </label>
                <select
                  id="contact-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Class 11–12 Aspirant">Class 11–12 Aspirant</option>
                  <option value="Parent / Guardian">Parent / Guardian</option>
                  <option value="IISER Student / Alumni">IISER Student / Alumni</option>
                  <option value="PhD / Faculty Applicant">Ph.D. / Faculty Applicant</option>
                  <option value="Educator / Counsellor">Educator / Counsellor</option>
                </select>
              </div>
              <div>
                <label htmlFor="contact-msg" className="block text-xs font-semibold text-slate-700 mb-1">
                  Message or Data Source Link
                </label>
                <textarea
                  id="contact-msg"
                  rows={4}
                  required
                  minLength={8}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your question or official circular URL for portal updates..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              {feedback && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                    status === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  {status === 'success' && (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <span>{feedback}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="px-5 py-2.5 bg-slate-900 hover:bg-blue-900 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                {status === 'submitting' ? 'Submitting...' : 'Submit Message'}
              </button>
            </form>
          )}

          {currentUser && myInquiries.length > 0 && (
            <div className="pt-5 border-t border-slate-200 space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Your Submitted Inquiries ({myInquiries.length})
              </h3>
              <div className="space-y-2">
                {myInquiries.map((inq) => (
                  <div key={inq.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>{inq.role}</span>
                      <span className="font-medium text-slate-800 capitalize">{inq.status}</span>
                    </div>
                    <p className="text-slate-800">{inq.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Privacy & Editorial Policy */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5 text-sm text-slate-700 h-fit">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 font-display mb-2">
              Privacy Policy
            </h2>
            <p className="leading-relaxed text-xs">
              Interactive tools (Eligibility Checker, Study Planner, Course Finder, Scholarship Finder) run locally in your browser without storing personal academic profiles. Contact form submissions are stored securely in Cloud Firestore and visible only to you and verified portal administrators.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-base font-semibold text-slate-900 font-display mb-2">
              Editorial Accuracy Standards
            </h3>
            <ul className="list-disc pl-4 space-y-1.5 text-xs">
              <li>Primary citations from iiseradmission.in, NIRF, DST, and official IISER sites.</li>
              <li>Explicit distinction between verified govt pay scales and estimated industry ranges.</li>
              <li>Unannounced dates and undisclosed placement metrics are never fabricated.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
