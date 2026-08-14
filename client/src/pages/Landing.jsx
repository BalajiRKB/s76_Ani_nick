import React from 'react';
import { motion } from 'framer-motion';
import { Github, Instagram, Linkedin, Sparkles, Layers3, BadgeInfo, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroFramesBackground from '../components/HeroFramesBackground';

export const Landing = () => {
  const heroStats = [
    { label: 'Community submissions', value: '1000+' },
    { label: 'Anime pairings', value: '290 frames' },
    { label: 'Fast explore flow', value: '1 click' },
  ];

  const featureCards = [
    {
      icon: Sparkles,
      title: 'Weirdly memorable',
      text: 'Find the funniest, most unexpected nickname ideas from anime fans who lean all the way into the joke.',
    },
    {
      icon: Layers3,
      title: 'Built for browsing',
      text: 'Jump between submissions, compare character names, and vote on the ones that deserve to trend.',
    },
    {
      icon: BadgeInfo,
      title: 'Easy to submit',
      text: 'Use guided anime and character suggestions so every nickname lands with clean context.',
    },
  ];

  return (
    <div className="overflow-x-hidden bg-[#171742] text-white">
      <section className="relative min-h-screen overflow-hidden">
        <HeroFramesBackground />

        <div className="relative z-20 mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-14 pt-5 md:px-10">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img src="/AniNick.png" alt="AniNick" className="h-10 w-auto sm:h-12" />
            </Link>

            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-sm font-semibold text-orange-300 backdrop-blur-md sm:gap-5 sm:px-5">
              <Link to="/login" className="transition-colors hover:text-white">
                Login
              </Link>
              <Link to="/signup" className="transition-colors hover:text-white">
                Signup
              </Link>
            </div>
          </div>

          <div className="flex flex-1 items-center py-10 md:py-16">
            <div className="grid w-full items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-orange-200">
                  <Sparkles size={14} />
                  Community-driven anime nickname archive
                </span>

                <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.92] text-white sm:text-6xl lg:text-7xl">
                  Discover anime nicknames through a living frame-sequence hero.
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-8 text-gray-200 sm:text-lg">
                  AniNick turns fandom jokes, character lore, and community voting into one sharp home for the weirdest and most memorable anime nicknames.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/explore"
                    className="inline-flex items-center gap-2 rounded-full bg-[#FF7B00] px-6 py-3 font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-[#d66a00]"
                  >
                    Explore Nicknames
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/create"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-6 py-3 font-bold text-white backdrop-blur-md transition-colors hover:border-white/30 hover:bg-black/45"
                  >
                    Submit Yours
                  </Link>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {heroStats.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-md">
                      <p className="text-2xl font-black text-[#FF7B00]">{item.value}</p>
                      <p className="mt-1 text-sm text-gray-300">{item.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.75, ease: 'easeOut', delay: 0.1 }}
                className="relative"
              >
                <div className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle,_rgba(255,123,0,0.22),_transparent_62%)] blur-2xl" />
                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/35 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,123,0,0.16),transparent_35%,rgba(34,211,238,0.08)_100%)]" />
                  <div className="relative space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-gray-400">What makes it fun</p>
                      <h2 className="mt-2 text-2xl font-bold text-white">Built for browsing, voting, and sharing.</h2>
                      <p className="mt-3 text-sm leading-7 text-gray-300">
                        The new hero stays out of the way and lets the frame sequence carry the mood while the page tells users exactly what to do next.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {featureCards.map((card) => {
                        const Icon = card.icon;

                        return (
                          <div key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <Icon className="text-[#FF7B00]" size={20} />
                            <h3 className="mt-3 text-lg font-bold text-white">{card.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-gray-300">{card.text}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-10">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-black/35 p-8 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.35em] text-orange-300">About AniNick</p>
            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">What is AniNick?</h2>
            <p className="mt-5 text-base leading-8 text-gray-300">
              AniNick is a community-driven platform where anime fans can discover, vote on, and share the weirdest nicknames found in anime series. From hilarious fan-made names to quirky character titles, it keeps the fandom energy front and center.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Discover', 'Find nicknames tied to characters and shows you already love.'],
              ['Vote', 'Lift the funniest entries and surface the ones worth remembering.'],
              ['Submit', 'Add your own nickname with guided anime and character suggestions.'],
              ['Explore', 'Move through community picks without a heavy or cluttered layout.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <p className="text-xl font-bold text-[#FF7B00]">{title}</p>
                <p className="mt-2 text-sm leading-7 text-gray-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-10">
        <div className="rounded-[2rem] border border-white/10 bg-black/35 px-6 py-10 text-center backdrop-blur-xl md:px-10 md:py-14">
          <h2 className="text-4xl font-black text-white sm:text-5xl">
            Ready To <span className="text-[#FF7B00]">Dive In</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-gray-300 sm:text-lg">
            Join AniNick today and start discovering the weirdest anime nicknames, or submit one that deserves to be remembered.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-[#FF7B00] px-6 py-3 font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-[#d66a00]"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-6 py-3 font-bold text-white backdrop-blur-md transition-colors hover:border-white/30 hover:bg-black/45"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black/70 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:px-10">
          <div className="flex gap-5">
            <a href="https://www.instagram.com/balaji_2k7" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-pink-500">
              <Instagram size={30} />
            </a>
            <a href="https://www.linkedin.com/in/balaji-r-640349315/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-blue-500">
              <Linkedin size={30} />
            </a>
            <a href="https://www.github.com/balaji-r-2007" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-blue-300">
              <Github size={30} />
            </a>
          </div>

          <div className="flex flex-col gap-3 text-sm text-gray-300 sm:flex-row sm:items-center sm:justify-between">
            <p>By Balaji R</p>
            <p>Anime nicknames, remixed with community energy.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
