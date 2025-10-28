'use client';
import { useState } from 'react';
export default function ContactForm(){
  const [status,setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');
  async function handleSubmit(e:any){
    e.preventDefault();
    setStatus('sending');
    const form = new FormData(e.target);
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: form
      });
      if(res.ok) { setStatus('sent'); e.target.reset(); }
      else { setStatus('error'); }
    } catch(err){
      setStatus('error');
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <input type="hidden" name="_subject" value="New message from portfolio contact form" />
      <input type="hidden" name="_replyto" value={process.env.NEXT_PUBLIC_CONTACT_EMAIL} />
      <div>
        <label className="block text-sm">Name</label>
        <input required name="name" className="w-full mt-1 p-2 border rounded bg-white dark:bg-gray-900" />
      </div>
      <div>
        <label className="block text-sm">Email</label>
        <input required name="email" type="email" className="w-full mt-1 p-2 border rounded bg-white dark:bg-gray-900" />
      </div>
      <div>
        <label className="block text-sm">Message</label>
        <textarea required name="message" rows={5} className="w-full mt-1 p-2 border rounded bg-white dark:bg-gray-900" />
      </div>
      <div>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">
          {status==='sending' ? 'Sending...' : 'Send Message'}
        </button>
        {status==='sent' && <p className="mt-2 text-green-500">Message sent — thank you!</p>}
        {status==='error' && <p className="mt-2 text-red-500">Something went wrong. Please try later.</p>}
      </div>
    </form>
  )
}
