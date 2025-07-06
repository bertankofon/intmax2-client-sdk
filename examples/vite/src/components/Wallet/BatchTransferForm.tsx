import React, { useState, useEffect } from 'react'
import { IntMaxClient, TokenBalance } from 'intmax2-client-sdk'
import { formatUnits } from 'viem'
import { LoadingSpinner } from '../../components/Common/LoadingSpinner'
import { ErrorMessage } from '../../components/Common/ErrorMessage'
import { PLACEHOLDER_INTMAX_ADDRESS } from '../../lib/constants'
import { getTokenDecimals } from '../../lib/utils'

interface BatchTransferFormProps {
  client: IntMaxClient
}

interface TransferItem {
  id: string
  recipient: string
  amount: string
  tokenIndex: string
}

interface Fee {
  token_index: number
  amount: string
}

interface TransferFeeData {
  beneficiary?: string
  fee?: Fee
  collateral_fee?: Fee
}

export const BatchTransferForm: React.FC<BatchTransferFormProps> = ({ client }) => {
  const [transfers, setTransfers] = useState<TransferItem[]>([
    { id: '1', recipient: '', amount: '', tokenIndex: '' }
  ])
  const [balances, setBalances] = useState<TokenBalance[]>([])
  const [transferFee, setTransferFee] = useState<TransferFeeData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchBalances()
    fetchTransferFee()
  }, [client])

  const fetchBalances = async () => {
    try {
      const { balances: newBalances } = await client.fetchTokenBalances()
      setBalances(newBalances.filter(b => b.amount > 0))
    } catch (err) {
      console.error('Failed to fetch balances:', err)
    }
  }

  const fetchTransferFee = async () => {
    try {
      const feeData = await client.getTransferFee()
      setTransferFee(feeData)
    } catch (err) {
      console.error('Failed to fetch transfer fee:', err)
    }
  }

  const addTransfer = () => {
    const newId = (transfers.length + 1).toString()
    setTransfers([...transfers, { id: newId, recipient: '', amount: '', tokenIndex: '' }])
  }

  const removeTransfer = (id: string) => {
    if (transfers.length > 1) {
      setTransfers(transfers.filter(t => t.id !== id))
    }
  }

  const updateTransfer = (id: string, field: keyof TransferItem, value: string) => {
    setTransfers(transfers.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ))
    setError(null)
    setSuccess(null)
  }

  const getTokenByIndex = (tokenIndex: string) => {
    if (!tokenIndex) return null
    return balances.find(b => b.token.tokenIndex === Number(tokenIndex))
  }

  const calculateTotalCosts = () => {
    const tokenTotals: { [tokenIndex: string]: number } = {}
    
    transfers.forEach(transfer => {
      if (transfer.amount && transfer.tokenIndex) {
        const amount = parseFloat(transfer.amount)
        if (!isNaN(amount)) {
          tokenTotals[transfer.tokenIndex] = (tokenTotals[transfer.tokenIndex] || 0) + amount
        }
      }
    })

    return tokenTotals
  }

  const validateTransfers = () => {
    for (const transfer of transfers) {
      if (!transfer.recipient || !transfer.amount || !transfer.tokenIndex) {
        return 'All fields are required for each transfer'
      }
      
      const amount = parseFloat(transfer.amount)
      if (isNaN(amount) || amount <= 0) {
        return 'All amounts must be positive numbers'
      }
    }

    // Check if we have enough balance for each token
    const tokenTotals = calculateTotalCosts()
    for (const [tokenIndex, totalAmount] of Object.entries(tokenTotals)) {
      const tokenBalance = getTokenByIndex(tokenIndex)
      if (!tokenBalance) {
        return `Token not found for index ${tokenIndex}`
      }
      
      const decimals = getTokenDecimals(tokenBalance.token)
      const availableAmount = parseFloat(formatUnits(tokenBalance.amount, decimals))
      
      if (totalAmount > availableAmount) {
        return `Insufficient balance for ${tokenBalance.token.symbol}: need ${totalAmount}, have ${availableAmount}`
      }
    }

    return null
  }

  const handleBatchTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateTransfers()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      // Prepare transfers array
      const transfersToSend = transfers.map(transfer => {
        const tokenBalance = getTokenByIndex(transfer.tokenIndex)!
        return {
          amount: transfer.amount,
          token: tokenBalance.token,
          address: transfer.recipient,
        }
      })

      console.log('Sending batch transfers:', transfersToSend)

      // Execute batch transfer
      const transferResult = await client.broadcastTransaction(transfersToSend)

      console.log('Batch transfer result:', transferResult)
      
      setSuccess(`Batch transfer successful!\nTx Root: ${transferResult.txTreeRoot}\nTransfer Digests: ${transferResult.transferDigests?.join(', ')}`)
      
      // Reset form and refresh balances
      setTransfers([{ id: '1', recipient: '', amount: '', tokenIndex: '' }])
      await fetchBalances()
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Batch transfer failed'
      setError(errorMessage)
      console.error('Batch transfer error:', err)
    } finally {
      setLoading(false)
    }
  }

  const tokenTotals = calculateTotalCosts()

  return (
    <div className="batch-transfer-form card">
      <div className="card-header">
        <h3>🚀 Batch Transfer</h3>
        <p className="card-subtitle">Send multiple transfers in a single transaction</p>
      </div>
      
      <form onSubmit={handleBatchTransfer} className="form">
        <div className="transfers-container">
          {transfers.map((transfer, index) => (
            <div key={transfer.id} className="transfer-item">
              <div className="transfer-header">
                <h4>Transfer #{index + 1}</h4>
                {transfers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTransfer(transfer.id)}
                    className="btn btn-remove"
                    disabled={loading}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="transfer-fields">
                <div className="form-group">
                  <label htmlFor={`token-${transfer.id}`}>Token</label>
                  <select
                    id={`token-${transfer.id}`}
                    value={transfer.tokenIndex}
                    onChange={(e) => updateTransfer(transfer.id, 'tokenIndex', e.target.value)}
                    className="form-select"
                    disabled={loading}
                  >
                    <option value="">Choose a token...</option>
                    {balances.map((balance) => (
                      <option key={balance.token.tokenIndex} value={balance.token.tokenIndex}>
                        {balance.token.symbol || 'UNKNOWN'} - Balance: {formatUnits(balance.amount, getTokenDecimals(balance.token))}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor={`recipient-${transfer.id}`}>Recipient</label>
                  <input
                    type="text"
                    id={`recipient-${transfer.id}`}
                    value={transfer.recipient}
                    onChange={(e) => updateTransfer(transfer.id, 'recipient', e.target.value)}
                    placeholder={PLACEHOLDER_INTMAX_ADDRESS}
                    className="form-input"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`amount-${transfer.id}`}>Amount</label>
                  <input
                    type="number"
                    id={`amount-${transfer.id}`}
                    value={transfer.amount}
                    onChange={(e) => updateTransfer(transfer.id, 'amount', e.target.value)}
                    placeholder="0.00000000001"
                    step="any"
                    min="0"
                    className="form-input"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={addTransfer}
            className="btn btn-secondary"
            disabled={loading}
          >
            + Add Transfer
          </button>
        </div>

        {Object.keys(tokenTotals).length > 0 && (
          <div className="batch-summary">
            <h4>📊 Batch Summary</h4>
            <div className="summary-items">
              {Object.entries(tokenTotals).map(([tokenIndex, total]) => {
                const token = getTokenByIndex(tokenIndex)
                return (
                  <div key={tokenIndex} className="summary-item">
                    <span>{token?.token.symbol || 'UNKNOWN'}</span>
                    <span className="amount">{total.toFixed(8)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {transferFee?.fee && (
          <div className="transfer-fee-info">
            <h4>💰 Transfer Fee</h4>
            <div className="fee-details">
              <div className="fee-item">
                <span>Fee Amount:</span>
                <span className="fee-value">{transferFee.fee.amount}</span>
              </div>
              <div className="fee-item">
                <span>Fee Token:</span>
                <span className="fee-value">#{transferFee.fee.token_index}</span>
              </div>
            </div>
          </div>
        )}

        {error && <ErrorMessage message={error} />}
        {success && (
          <div className="success-message">
            <p>✅ {success}</p>
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading || transfers.length === 0}
          className="btn btn-primary btn-full"
        >
          {loading ? <LoadingSpinner size="small" /> : `Send ${transfers.length} Transfer${transfers.length > 1 ? 's' : ''}`}
        </button>
      </form>
    </div>
  )
} 