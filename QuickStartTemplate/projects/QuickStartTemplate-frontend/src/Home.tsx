// Home.tsx
// Main landing UI: shows navbar, hero text, and feature cards.
// This file only handles layout and modals — safe place to customize design.

import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { AiOutlineWallet, AiOutlineSend, AiOutlineStar, AiOutlineDeploymentUnit } from 'react-icons/ai'
import { BsArrowUpRightCircle, BsWallet2 } from 'react-icons/bs'

// Frontend modals
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import NFTmint from './components/NFTmint'
import Tokenmint from './components/Tokenmint'

// Smart contract demo modal (backend app calls)
import AppCalls from './components/AppCalls'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openPaymentModal, setOpenPaymentModal] = useState<boolean>(false)
  const [openMintModal, setOpenMintModal] = useState<boolean>(false)
  const [openTokenModal, setOpenTokenModal] = useState<boolean>(false)
  const [openAppCallsModal, setOpenAppCallsModal] = useState<boolean>(false)

  const { activeAddress } = useWallet()

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-100 flex flex-col">
      {/* ---------- Decorative Background ---------- */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        {/* radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_-10%,rgba(34,211,238,0.25),transparent_70%)]" />
        {/* grid overlay */}
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,.12)_1px,transparent_1px)] bg-[size:40px_40px]" />
        {/* angled gradient accents */}
        <div className="absolute -top-40 -right-32 h-[420px] w-[420px] rounded-full blur-3xl bg-cyan-500/10" />
        <div className="absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full blur-3xl bg-teal-500/10" />
      </div>

      {/* ---------------- Navbar ---------------- */}
      <nav className="w-full sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/70 bg-neutral-900/90 border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-block h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-400/90 to-teal-500/90 shadow-lg shadow-cyan-500/10" />
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
                IFM NFT Genesis
              </span>{' '}
              <span className="text-gray-300">Minting</span>
            </h1>
          </div>

          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-sm font-semibold text-gray-100 transition focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            onClick={() => setOpenWalletModal(true)}
          >
            <BsWallet2 className="text-lg text-cyan-400" />
            <span>{activeAddress ? 'Wallet Connected' : 'Connect Wallet'}</span>
          </button>
        </div>
      </nav>

      {/* ---------------- Hero Section ---------------- */}
      <header className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-10 sm:pt-16 sm:pb-14">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
              TestNet Demo
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </p>

            <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight">
              <span className="text-white">Mint. Trade. Build.</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
                IFM NFTs on Algorand
              </span>
            </h2>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              A sleek playground for the Invincible Football Manager ecosystem. Connect your wallet,
              mint NFTs with IPFS metadata, spin up tokens, and experiment with smart contract calls —
              all in one polished Web3 interface.
            </p>

            <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => setOpenWalletModal(true)}
                className="group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm sm:text-base font-semibold text-neutral-900 bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 transition shadow-lg shadow-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              >
                <AiOutlineWallet className="text-lg sm:text-xl" />
                {activeAddress ? 'Manage Wallet' : 'Connect Wallet'}
              </button>

              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm sm:text-base font-semibold text-gray-200 bg-neutral-800/70 hover:bg-neutral-700 border border-neutral-700 transition focus:outline-none focus:ring-2 focus:ring-neutral-600/40"
              >
                Explore Features
                <BsArrowUpRightCircle className="text-lg sm:text-xl text-gray-300" />
              </a>
            </div>

            {/* subtle trust strip */}
            <div className="mt-8 sm:mt-10 flex items-center justify-center gap-6 text-xs text-gray-400">
              <span>IPFS Metadata</span>
              <span className="h-1 w-1 rounded-full bg-neutral-700" />
              <span>Algorand TestNet</span>
              <span className="h-1 w-1 rounded-full bg-neutral-700" />
              <span>Developer Demo</span>
            </div>
          </div>
        </div>
      </header>

      {/* ---------------- Features Grid ---------------- */}
      <main id="features" className="flex-1 px-4 sm:px-6 pb-14">
        <div className="mx-auto max-w-6xl">
          {/* Section heading */}
          <div className="mb-6 sm:mb-8 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-white">Core Building Blocks</h3>
            <p className="mt-2 text-sm sm:text-base text-gray-400">
              Everything you need to test the IFM NFT flow — from basic transactions to minting and contracts.
            </p>
          </div>

          {activeAddress ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7">
              {/* Send Payment */}
              <div className="group p-6 bg-neutral-900/70 rounded-2xl border border-neutral-800 hover:border-cyan-500/40 transition shadow-[0_0_0_1px_rgba(0,0,0,0.2)] hover:shadow-cyan-500/10">
                <AiOutlineSend className="text-4xl mb-3 text-cyan-300 group-hover:scale-105 transition-transform" />
                <h4 className="text-lg font-semibold mb-2">Send Payment</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Try sending 1 ALGO to any address on TestNet. Learn the basics of wallet transactions.
                </p>
                <button
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-900 font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                  onClick={() => setOpenPaymentModal(true)}
                >
                  Open
                </button>
              </div>

              {/* Mint NFT */}
              <div className="group p-6 bg-neutral-900/70 rounded-2xl border border-neutral-800 hover:border-pink-500/40 transition shadow-[0_0_0_1px_rgba(0,0,0,0.2)] hover:shadow-pink-500/10">
                <AiOutlineStar className="text-4xl mb-3 text-pink-300 group-hover:scale-105 transition-transform" />
                <h4 className="text-lg font-semibold mb-2">Mint NFT</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Upload an image and mint it as an NFT on Algorand, with IPFS metadata stored via Pinata.
                </p>
                <button
                  className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-semibold transition focus:outline-none focus:ring-2 focus:ring-pink-400/40"
                  onClick={() => setOpenMintModal(true)}
                >
                  Open
                </button>
              </div>

              {/* Create Token */}
              <div className="group p-6 bg-neutral-900/70 rounded-2xl border border-neutral-800 hover:border-purple-500/40 transition shadow-[0_0_0_1px_rgba(0,0,0,0.2)] hover:shadow-purple-500/10">
                <BsArrowUpRightCircle className="text-4xl mb-3 text-purple-300 group-hover:scale-105 transition-transform" />
                <h4 className="text-lg font-semibold mb-2">Create Token (ASA)</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Spin up your own Algorand Standard Asset (ASA) in seconds. Perfect for testing token creation.
                </p>
                <button
                  className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-semibold transition focus:outline-none focus:ring-2 focus:ring-purple-400/40"
                  onClick={() => setOpenTokenModal(true)}
                >
                  Open
                </button>
              </div>

              {/* Contract Interactions */}
              <div className="group p-6 bg-neutral-900/70 rounded-2xl border border-neutral-800 hover:border-amber-500/40 transition shadow-[0_0_0_1px_rgba(0,0,0,0.2)] hover:shadow-amber-500/10">
                <AiOutlineDeploymentUnit className="text-4xl mb-3 text-amber-300 group-hover:scale-105 transition-transform" />
                <h4 className="text-lg font-semibold mb-2">Contract Interactions</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Interact with a simple Algorand smart contract to see how stateful dApps work on-chain.
                </p>
                <button
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-900 font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                  onClick={() => setOpenAppCallsModal(true)}
                >
                  Open
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 mt-10">
              <p className="text-base">⚡ Connect your wallet to unlock the demo features below.</p>
              <button
                onClick={() => setOpenWalletModal(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-neutral-900 bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 transition shadow-lg shadow-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              >
                <AiOutlineWallet className="text-lg" />
                Connect Wallet
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ---------------- Footer (lightweight) ---------------- */}
      <footer className="border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
          <span>© {new Date().getFullYear()} Aruku Interactive — IFM Demo</span>
          <div className="flex items-center gap-4">
            <a href="#features" className="hover:text-gray-200">Features</a>
            <button
              onClick={() => setOpenWalletModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-gray-200"
            >
              <BsWallet2 className="text-base text-cyan-300" />
              {activeAddress ? 'Wallet Connected' : 'Connect'}
            </button>
          </div>
        </div>
      </footer>

      {/* ---------------- Modals ---------------- */}
      <ConnectWallet openModal={openWalletModal} closeModal={() => setOpenWalletModal(false)} />
      <Transact openModal={openPaymentModal} setModalState={setOpenPaymentModal} />
      <NFTmint openModal={openMintModal} setModalState={setOpenMintModal} />
      <Tokenmint openModal={openTokenModal} setModalState={setOpenTokenModal} />
      <AppCalls openModal={openAppCallsModal} setModalState={setOpenAppCallsModal} />
    </div>
  )
}

export default Home
