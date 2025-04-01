import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="e-Logbook | Efficient Record Management">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white">
                {/* Navigation */}
                <header className="w-full border-b border-gray-200 bg-white px-6 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="mx-auto flex max-w-7xl items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {/* e-Logbook Logo SVG - simplified version */}
                            <svg className="h-10 w-10" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M110 40 L290 40 L290 160 L110 160 C100 160 90 150 90 140 L90 60 C90 50 100 40 110 40 Z" fill="#3490dc" />
                                <path d="M110 40 L280 40 L280 155 L110 155 C103 155 95 148 95 140 L95 60 C95 52 103 45 110 45 Z" fill="#ffffff" />
                                <path d="M120 50 L260 50 L260 145 L120 145 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                                <circle cx="150" cy="100" r="25" fill="#3490dc" />
                                <path d="M140 100 L160 100 L160 110 C160 115 155 120 150 120 C145 120 140 115 140 110 Z" fill="#ffffff" />
                            </svg>
                            <span className="text-xl font-semibold text-gray-800 dark:text-white">e-Logbook</span>
                        </div>
                        <nav className="flex items-center gap-6">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-medium text-gray-700 transition hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="w-full py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
                            <div className="flex-1 space-y-6">
                                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
                                    Efficient Record Management at Your Fingertips
                                </h1>
                                <p className="text-xl text-gray-600 dark:text-gray-300">
                                    e-Logbook is a web-based application that allows record officers to efficiently manage and track records with ease.
                                </p>
                                <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                                    <Link
                                        href={route('register')}
                                        className="rounded-md bg-blue-600 px-8 py-3 text-center text-lg font-semibold text-white shadow-md transition hover:bg-blue-700"
                                    >
                                        Get Started
                                    </Link>
                                    <a
                                        href="#features"
                                        className="rounded-md border border-blue-600 px-8 py-3 text-center text-lg font-semibold text-blue-600 transition hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-gray-800"
                                    >
                                        Learn More
                                    </a>
                                </div>
                            </div>
                            <div className="w-full max-w-md lg:max-w-lg">
                                {/* Full e-Logbook SVG Logo */}
                                <svg className="h-auto w-full" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="400" height="200" rx="20" fill="#f8f9fa" />
                                    <path d="M110 40 L290 40 L290 160 L110 160 C100 160 90 150 90 140 L90 60 C90 50 100 40 110 40 Z" fill="#3490dc" />
                                    <path d="M110 40 L280 40 L280 155 L110 155 C103 155 95 148 95 140 L95 60 C95 52 103 45 110 45 Z" fill="#ffffff" />
                                    <path d="M120 50 L260 50 L260 145 L120 145 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                                    <path d="M130 60 L250 60" stroke="#e2e8f0" strokeWidth="1" />
                                    <path d="M130 70 L250 70" stroke="#e2e8f0" strokeWidth="1" />
                                    <path d="M130 80 L250 80" stroke="#e2e8f0" strokeWidth="1" />
                                    <path d="M130 90 L200 90" stroke="#e2e8f0" strokeWidth="1" />
                                    <path d="M130 100 L250 100" stroke="#e2e8f0" strokeWidth="1" />
                                    <path d="M130 110 L250 110" stroke="#e2e8f0" strokeWidth="1" />
                                    <path d="M130 120 L250 120" stroke="#e2e8f0" strokeWidth="1" />
                                    <path d="M130 130 L200 130" stroke="#e2e8f0" strokeWidth="1" />
                                    <circle cx="150" cy="100" r="25" fill="#3490dc" />
                                    <path d="M140 100 L160 100 L160 110 C160 115 155 120 150 120 C145 120 140 115 140 110 Z" fill="#ffffff" />
                                    <text x="200" y="180" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" textAnchor="middle" fill="#2d3748">e-Logbook</text>
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="w-full bg-white py-16 dark:bg-gray-800">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">Key Features</h2>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                                Everything you need to manage records efficiently and securely.
                            </p>
                        </div>
                        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Feature 1 */}
                            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-700">
                                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                </div>
                                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">Efficient Record Tracking</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Track and manage all your records in one centralized location with powerful search and filtering capabilities.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-700">
                                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                    </svg>
                                </div>
                                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">Customizable Templates</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Create and customize templates to standardize record entries and ensure consistency across your organization.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-700">
                                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                </div>
                                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">Comprehensive Reporting</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Generate detailed reports and analytics to gain insights into your record management processes.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full bg-blue-600 py-16 text-white">
                    <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Transform Your Record Management?</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-xl text-blue-100">
                            Join thousands of record officers who have improved their efficiency with e-Logbook.
                        </p>
                        <div className="mt-10 flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                            <Link
                                href={route('register')}
                                className="rounded-md bg-white px-8 py-3 text-lg font-semibold text-blue-600 shadow-md transition hover:bg-gray-100"
                            >
                                Get Started Free
                            </Link>
                            <a
                                href="#"
                                className="rounded-md border border-white bg-blue-700 px-8 py-3 text-lg font-semibold text-white transition hover:bg-blue-800"
                            >
                                Schedule Demo
                            </a>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="w-full bg-gray-900 py-12 text-white">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid gap-8 md:grid-cols-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">e-Logbook</h3>
                                <p className="text-gray-400">Efficient record management solution for organizations of all sizes.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                                <ul className="space-y-2">
                                    <li><a href="#" className="text-gray-400 hover:text-white transition">Home</a></li>
                                    <li><a href="#features" className="text-gray-400 hover:text-white transition">Features</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition">Offices</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Support</h3>
                                <ul className="space-y-2">
                                    <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition">FAQ</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
                                <div className="flex space-x-4">
                                    <a href="#" className="text-gray-400 hover:text-white transition">
                                        <span className="sr-only">Facebook</span>
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                                        </svg>
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-white transition">
                                        <span className="sr-only">Twitter</span>
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                        </svg>
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-white transition">
                                        <span className="sr-only">LinkedIn</span>
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-400">&copy; {new Date().getFullYear()} e-Logbook. All rights reserved.</p>
                            <div className="flex space-x-6 mt-4 md:mt-0">
                                <a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a>
                                <a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a>
                                <a href="#" className="text-gray-400 hover:text-white transition">Cookies</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
