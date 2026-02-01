"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function TopBar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const menuItems = [
        { name: "文檔與 AI", href: "/documents", icon: "documents" },
        { name: "方案與報價", href: "/plans", icon: "plans" },
    ];

    const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

    return (
        <header className="w-full bg-white border-b border-slate-200">
            <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo / Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2v20M2 12h20" />
                            </svg>
                        </div>
                        <div className="hidden sm:block">

                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    group flex items-center gap-2 px-4 py-2 rounded-lg 
                                    font-medium text-sm transition-all
                                    ${isActive(item.href)
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }
                                `}
                            >
                                {/* Icon */}
                                <div className={`
                                    w-5 h-5 flex items-center justify-center
                                    ${isActive(item.href) ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}
                                `}>
                                    {item.icon === 'plans' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                        </svg>
                                    )}
                                    {item.icon === 'documents' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 22V4c0-.5.2-1 .6-1.4C5 2.2 5.5 2 6 2h12c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4v18c0 .5-.2 1-.6 1.4-.4.4-.9.6-1.4.6H6c-.5 0-1-.2-1.4-.6-.4-.4-.6-.9-.6-1.4Z" /><path d="M14 2v4c0 .5.2 1 .6 1.4.4.4.9.6 1.4.6h4" />
                                        </svg>
                                    )}
                                </div>

                                <span>{item.name}</span>

                                {/* Active Indicator */}
                                {isActive(item.href) && (
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Status Badge - Desktop */}
                    <div className="hidden lg:flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-500">
                                Phase 0: 現況盤點
                            </p>
                            <p className="text-xs text-slate-400 font-medium">
                                v1.0.0-pilot
                            </p>
                        </div>
                        <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                            進行中
                        </span>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-slate-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {mobileMenuOpen ? (
                                <path d="M18 6 6 18M6 6l12 12" />
                            ) : (
                                <>
                                    <line x1="4" x2="20" y1="12" y2="12" />
                                    <line x1="4" x2="20" y1="6" y2="6" />
                                    <line x1="4" x2="20" y1="18" y2="18" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <nav className="md:hidden py-4 border-t border-slate-200">
                        <div className="space-y-1">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg 
                                        font-medium text-sm transition-all
                                        ${isActive(item.href)
                                            ? 'bg-slate-900 text-white'
                                            : 'text-slate-600 hover:bg-slate-50'
                                        }
                                    `}
                                >
                                    <div className={`
                                        w-5 h-5 flex items-center justify-center
                                        ${isActive(item.href) ? 'text-white' : 'text-slate-400'}
                                    `}>
                                        {item.icon === 'plans' && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                            </svg>
                                        )}
                                        {item.icon === 'documents' && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4 22V4c0-.5.2-1 .6-1.4C5 2.2 5.5 2 6 2h12c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4v18c0 .5-.2 1-.6 1.4-.4.4-.9.6-1.4.6H6c-.5 0-1-.2-1.4-.6-.4-.4-.6-.9-.6-1.4Z" /><path d="M14 2v4c0 .5.2 1 .6 1.4.4.4.9.6 1.4.6h4" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="flex-1">{item.name}</span>
                                    {isActive(item.href) && (
                                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Status */}
                        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    專案狀態
                                </p>
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                                    進行中
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium">
                                Phase 0: 現況盤點與邊界設定
                            </p>
                            <p className="text-xs text-slate-400 font-medium mt-1">
                                v1.0.0-pilot
                            </p>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}