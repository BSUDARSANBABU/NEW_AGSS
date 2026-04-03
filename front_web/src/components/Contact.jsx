import React from 'react'
import '../styles/Contact.css'
import { Header } from './Header'

function Contact() {
    return (
        <div className="contact-page">
            <Header activeTab="contact" />
            <main className="min-h-screen technical-grid">
                {/* Hero Section */}
                <header className="pt-24 pb-16 px-6 text-center max-w-[1440px] mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed/30 rounded-full mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-on-primary-fixed-variant font-label">Status: All Systems Operational</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface mb-6 font-headline">
                        Connect with our <br /><span className="text-primary">Engineering Team</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-on-surface-variant text-lg leading-relaxed font-body">
                        Our clinical architecture experts are standing by. Standard response time for technical queries is &lt; 2 hours for Enterprise partners and &lt; 24 hours for Developer tier.
                    </p>
                </header>

                {/* Contact Form Section */}
                <section className="max-w-[1440px] mx-auto px-10 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Decor / Visual Side */}
                    <div className="hidden lg:block lg:col-span-4 self-center">
                        <div className="relative">
                            <div className="absolute -top-12 -left-12 w-24 h-24 bg-primary-fixed/20 rounded-full blur-3xl"></div>
                            <div className="border-l-2 border-primary-fixed pl-8 py-12">
                                <h3 className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-6 font-label">Architectural Principles</h3>
                                <ul className="space-y-8">
                                    <li className="group">
                                        <div className="text-on-surface font-bold text-sm mb-1">Precision First</div>
                                        <p className="text-on-surface-variant text-xs leading-relaxed">Our engineers treat every bug report like an architectural flaw.</p>
                                    </li>
                                    <li className="group">
                                        <div className="text-on-surface font-bold text-sm mb-1">Direct Access</div>
                                        <p className="text-on-surface-variant text-xs leading-relaxed">No gatekeepers. Speak directly to the developers building the core.</p>
                                    </li>
                                    <li className="group">
                                        <div className="text-on-surface font-bold text-sm mb-1">Global Logic</div>
                                        <p className="text-on-surface-variant text-xs leading-relaxed">Three redundant global headquarters for 24/7 technical continuity.</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Main Form Card */}
                    <div className="lg:col-span-8">
                        <div className="glass-morphism rounded-xl p-8 md:p-12 shadow-2xl shadow-primary-fixed/5">
                            <form className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant ml-1 font-label">Full Name</label>
                                        <input className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-fixed/30 focus:border-primary outline-none transition-all placeholder:text-outline/40" placeholder="Dr. Julian Vane" type="text" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant ml-1 font-label">Professional Email</label>
                                        <input className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-fixed/30 focus:border-primary outline-none transition-all placeholder:text-outline/40" placeholder="j.vane@research.devhub.com" type="email" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant ml-1 font-label">Subject of Inquiry</label>
                                    <div className="relative">
                                        <select className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-fixed/30 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                            <option>API Authentication &amp; Security Protocols</option>
                                            <option>Scale Architecture Consultation</option>
                                            <option>Production Incident Support</option>
                                            <option>General Engineering Feedback</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-4 top-3.5 pointer-events-none text-on-surface-variant">expand_more</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant ml-1 font-label">Message</label>
                                    <textarea className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-fixed/30 focus:border-primary outline-none transition-all placeholder:text-outline/40 resize-none" placeholder="Describe the technical parameters of your request..." rows="5"></textarea>
                                </div>
                                <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <p className="text-[11px] text-on-surface-variant font-body max-w-sm">
                                        By sending this message, you agree to our <span className="text-primary font-bold">Priority SLA</span> terms for technical communication.
                                    </p>
                                    <button className="w-full md:w-auto px-10 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-container transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3">
                                        Send Message
                                        <span className="material-symbols-outlined text-sm">send</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                {/* Contact Grid Section */}
                <section className="max-w-[1440px] mx-auto px-10 py-24 bg-surface-container-low">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Direct API Support */}
                        <div className="flex flex-col items-start p-2">
                            <div className="w-12 h-12 bg-surface-container-lowest flex items-center justify-center rounded-xl mb-6 shadow-sm">
                                <span className="material-symbols-outlined text-primary">terminal</span>
                            </div>
                            <h4 className="text-lg font-bold text-on-surface mb-3 tracking-tight font-headline">Direct API Support</h4>
                            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                                Real-time troubleshooting for endpoint integration and data parsing architectures.
                            </p>
                            <a className="text-primary font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-2 group" href="#">
                                dev.support@devhub.io
                                <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </a>
                        </div>

                        {/* Global Headquarters */}
                        <div className="flex flex-col items-start p-2">
                            <div className="w-12 h-12 bg-surface-container-lowest flex items-center justify-center rounded-xl mb-6 shadow-sm">
                                <span className="material-symbols-outlined text-primary">public</span>
                            </div>
                            <h4 className="text-lg font-bold text-on-surface mb-3 tracking-tight font-headline">Global Headquarters</h4>
                            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                                404 Precision Way, Suite 800<br />San Francisco, CA 94103
                            </p>
                            <a className="text-primary font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-2 group" href="#">
                                View on Map
                                <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">map</span>
                            </a>
                        </div>

                        {/* Technical Hot-Line */}
                        <div className="flex flex-col items-start p-2">
                            <div className="w-12 h-12 bg-surface-container-lowest flex items-center justify-center rounded-xl mb-6 shadow-sm">
                                <span className="material-symbols-outlined text-primary">headset_mic</span>
                            </div>
                            <h4 className="text-lg font-bold text-on-surface mb-3 tracking-tight font-headline">Technical Hot-Line</h4>
                            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                                Direct audio channel for high-priority architectural emergencies and live debugging.
                            </p>
                            <a className="text-primary font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-2 group" href="#">
                                +1 (888) 404-DEVH
                                <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">call</span>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Visual Anchor Section */}
                <section className="h-[400px] w-full overflow-hidden relative">
                    <img
                        alt="Data Infrastructure"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6zqtlw1yE40qm2oJb3hfdP69XOAT6NUATlz1xSRbNYqZJh9AwO9QZPvTyizzWwKk6HhI7HRugqueQBeAhtXhGXQLbIOD0nrttMdxOn54FsACZMcxvoCcCz0AcYBe5VyWsFbKhF7EDFg7h-COU6JPaBDYeLHTyPUK3jGcX4VKpWK-VOV1N7W5gShNVe7ex5b11eaA_rdx1aFC2ME5SNWg1jz5LzH8ZTTuTtprzIGyYfgJNLMmjqc4ErOXoBmUD_nfSj9-8tBrTDx0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center px-10">
                            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-on-primary-fixed font-label mb-4">Precision Engineering</div>
                            <h2 className="text-3xl font-bold text-white tracking-tight font-headline">Reliability by Design</h2>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer Implementation */}
            <footer className="w-full bg-[#f3f3f4] dark:bg-slate-900 mt-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-10 py-16 max-w-[1440px] mx-auto">
                    <div className="col-span-1 md:col-span-1">
                        <div className="text-lg font-bold text-[#1a1c1c] dark:text-white mb-4">DevHub</div>
                        <p className="text-[#3e494b] dark:text-slate-400 font-['Plus_Jakarta_Sans'] text-sm leading-relaxed mb-6">
                            Architecting the future of technical documentation and engineering collaboration.
                        </p>
                    </div>
                    <div className="flex flex-col space-y-3">
                        <h5 className="text-[#00606b] dark:text-[#a2effd] font-bold text-xs uppercase tracking-widest mb-2">Legal</h5>
                        <a className="text-[#3e494b] dark:text-slate-400 hover:text-[#00606b] dark:hover:text-[#a2effd] underline decoration-2 underline-offset-4 transition-all duration-200 text-sm" href="#">Privacy Policy</a>
                        <a className="text-[#3e494b] dark:text-slate-400 hover:text-[#00606b] dark:hover:text-[#a2effd] underline decoration-2 underline-offset-4 transition-all duration-200 text-sm" href="#">Terms of Service</a>
                    </div>
                    <div className="flex flex-col space-y-3">
                        <h5 className="text-[#00606b] dark:text-[#a2effd] font-bold text-xs uppercase tracking-widest mb-2">System</h5>
                        <a className="text-[#3e494b] dark:text-slate-400 hover:text-[#00606b] dark:hover:text-[#a2effd] underline decoration-2 underline-offset-4 transition-all duration-200 text-sm" href="#">System Status</a>
                        <a className="text-[#3e494b] dark:text-slate-400 hover:text-[#00606b] dark:hover:text-[#a2effd] underline decoration-2 underline-offset-4 transition-all duration-200 text-sm" href="#">Security</a>
                    </div>
                    <div className="flex flex-col space-y-3">
                        <h5 className="text-[#00606b] dark:text-[#a2effd] font-bold text-xs uppercase tracking-widest mb-2">Contact</h5>
                        <a className="text-[#3e494b] dark:text-slate-400 hover:text-[#00606b] dark:hover:text-[#a2effd] underline decoration-2 underline-offset-4 transition-all duration-200 text-sm" href="#">Support</a>
                        <a className="text-[#3e494b] dark:text-slate-400 hover:text-[#00606b] dark:hover:text-[#a2effd] underline decoration-2 underline-offset-4 transition-all duration-200 text-sm" href="#">Documentation</a>
                    </div>
                </div>
                <div className="px-10 py-6 border-t border-outline-variant/10 max-w-[1440px] mx-auto">
                    <p className="text-[#3e494b] dark:text-slate-400 font-['Plus_Jakarta_Sans'] text-xs text-center md:text-left">
                        © 2024 DevHub Technical Systems. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Contact
