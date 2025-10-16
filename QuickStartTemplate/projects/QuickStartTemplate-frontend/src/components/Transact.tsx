// Transact.tsx
// Simple payment component: send 1 ALGO or 1 USDC from connected wallet → receiver address.
// Uses Algokit + wallet connector. Designed for TestNet demos.

import { algo, AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { AiOutlineLoading3Quarters, AiOutlineSend } from 'react-icons/ai'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface TransactInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const Transact = ({ openModal, setModalState }: TransactInterface) => {
  const LORA = 'https://lora.algokit.io/testnet'

  // UI state
  const [loading, setLoading] = useState<boolean>(false)
  const [receiverAddress, setReceiverAddress] = useState<string>('')
  const [assetType, setAssetType] = useState<'ALGO' | 'USDC' | 'USDT' | 'ELEVEN'>('ALGO') // toggle between ALGO, USDC, USDT, Eleven
  const [amount, setAmount] = useState<string>('1') // new state for amount input

  // Algorand client setup (TestNet by default from env)
  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({ algodConfig })

  // Wallet + notifications
  const { enqueueSnackbar } = useSnackbar()
  const { transactionSigner, activeAddress } = useWallet()

  // Asset constants (TestNet ASA)
  const assetInfo = {
    USDC: { assetId: 10458941n, decimals: 6 },
    USDT: { assetId: 312769, decimals: 6 }, // USDT TestNet assetId (update if needed)
    ELEVEN: { assetId: 74786421n, decimals: 0 }, // Eleven token assetId and decimals (update decimals if needed)
  }

  // ------------------------------
  // Handle sending payment
  // ------------------------------
  const handleSubmit = async () => {
    setLoading(true)

    // Guard: wallet must be connected
    if (!transactionSigner || !activeAddress) {
      enqueueSnackbar('Please connect wallet first', { variant: 'warning' })
      setLoading(false)
      return
    }

    // Validate amount
    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      enqueueSnackbar('Please enter a valid amount greater than 0', { variant: 'warning' })
      setLoading(false)
      return
    }

    try {
      enqueueSnackbar(`Sending ${parsedAmount} ${assetType} transaction...`, { variant: 'info' })

      // Fetch balance for activeAddress
      let balanceSufficient = false
      // getInformation expects a string address
      const acct = await algorand.account.getInformation(activeAddress)
      if (assetType === 'ALGO') {
        // 'amount' is microAlgos
        const algoBalance = 'amount' in acct ? Number((acct as any).amount) / 1e6 : 0
        balanceSufficient = algoBalance >= parsedAmount
        if (!balanceSufficient) {
          enqueueSnackbar('Insufficient ALGO balance', { variant: 'error' })
          setLoading(false)
          return
        }
      } else {
        // 'assets' is an array of holdings
        const assets = 'assets' in acct ? (acct as any).assets : []
        const info = assetInfo[assetType as keyof typeof assetInfo]
        const holding = assets?.find((a: any) => a['asset-id'] === Number(info.assetId))
        const balance = holding ? Number(holding.amount) / 10 ** info.decimals : 0
        balanceSufficient = balance >= parsedAmount
        if (!balanceSufficient) {
          enqueueSnackbar(`Insufficient ${assetType} balance`, { variant: 'error' })
          setLoading(false)
          return
        }
      }

      // Transaction
      let txResult: any
      let msg: string

      if (assetType === 'ALGO') {
        txResult = await algorand.send.payment({
          signer: transactionSigner,
          sender: activeAddress,
          receiver: receiverAddress,
          amount: algo(parsedAmount),
        })
        msg = `✅ ${parsedAmount} ALGO sent!`
      } else {
        const info = assetInfo[assetType as keyof typeof assetInfo]
        const assetAmount = BigInt(Math.floor(parsedAmount * 10 ** info.decimals))
        txResult = await algorand.send.assetTransfer({
          signer: transactionSigner,
          sender: activeAddress,
          receiver: receiverAddress,
          assetId: info.assetId,
          amount: assetAmount,
        })
        msg = `✅ ${parsedAmount} ${assetType} sent!`
      }

      const txId = txResult?.txIds?.[0]

      enqueueSnackbar(`${msg} TxID: ${txId}`, {
        variant: 'success',
        action: () =>
          txId ? (
            <a
              href={`${LORA}/transaction/${txId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline', marginLeft: 8 }}
            >
              View on Lora ↗
            </a>
          ) : null,
      })

      // Reset form
      setReceiverAddress('')
      setAmount('1')
    } catch (e) {
      console.error(e)
      enqueueSnackbar(`Failed to send ${assetType}`, { variant: 'error' })
    }

    setLoading(false)
  }

  // ------------------------------
  // Modal UI
  // ------------------------------
  return (
    <dialog id="transact_modal" className={`modal modal-bottom sm:modal-middle backdrop-blur-sm ${openModal ? 'modal-open' : ''}`}>
      <div className="modal-box bg-neutral-800 text-gray-100 rounded-2xl shadow-xl border border-neutral-700 p-6">
        <h3 className="flex items-center gap-3 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500 mb-6">
          <AiOutlineSend className="text-3xl" />
          Send a Payment
        </h3>

        {/* Receiver Address input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-400">Receiver's Address</span>
          </label>
          <input
            type="text"
            data-test-id="receiver-address"
            className="input input-bordered w-full bg-neutral-700 text-gray-100 border-neutral-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            placeholder="e.g., KPLX..."
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
          />
          {/* Address length check for Algorand (58 chars) */}
          <div className="flex justify-between items-center text-xs mt-2">
            <span className="text-gray-500">
              Address:{' '}
              <span className={`font-mono ${receiverAddress.length === 58 ? 'text-green-400' : 'text-red-400'}`}>
                {receiverAddress.length}/58
              </span>
            </span>
          </div>
        </div>

        {/* Amount input */}
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text text-gray-400">Amount to Send ({assetType})</span>
          </label>
          <input
            type="number"
            min="0.000001"
            step="any"
            data-test-id="amount-input"
            className="input input-bordered w-full bg-neutral-700 text-gray-100 border-neutral-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            placeholder={`e.g., 1.5`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Toggle ALGO, USDC, USDT, ELEVEN */}
        <div className="flex justify-center gap-4 mt-4">
          {['ALGO', 'USDC', 'USDT', 'ELEVEN'].map((type) => (
            <button
              key={type}
              type="button"
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                assetType === type ? 'bg-cyan-600 text-white' : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
              }`}
              onClick={() => setAssetType(type as typeof assetType)}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="modal-action mt-6 flex flex-col-reverse sm:flex-row-reverse gap-3">
          <button
            data-test-id="send"
            type="button"
            className={`
              btn w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white rounded-xl border-none font-semibold transition-all duration-300 transform active:scale-95
              ${receiverAddress.length === 58 && parseFloat(amount) > 0 ? '' : 'btn-disabled opacity-50 cursor-not-allowed'}
            `}
            onClick={handleSubmit}
            disabled={loading || receiverAddress.length !== 58 || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <AiOutlineLoading3Quarters style={{ animation: 'spin 1s linear infinite' }} />
                Sending...
              </span>
            ) : (
              `Send ${amount} ${assetType}`
            )}
          </button>
          <button
            type="button"
            className="btn w-full sm:w-auto bg-neutral-700 hover:bg-neutral-600 border-none text-gray-300 rounded-xl"
            onClick={() => setModalState(false)}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default Transact
