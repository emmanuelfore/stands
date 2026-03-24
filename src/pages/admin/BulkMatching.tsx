import React, { useState } from 'react'
import { 
  FileSearch, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  ArrowRight,
  Database,
  Search,
  Check
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { usePayments } from '../../hooks/usePayments'
import { matchBankStatement } from '../../utils/fintech'
import { cn, formatCurrency } from '../../lib/utils'
import * as XLSX from 'xlsx'

export const BulkMatching: React.FC = () => {
  const { pendingPayments, verifyPayment } = usePayments()
  const [matches, setMatches] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const bstr = event.target?.result
      const wb = XLSX.read(bstr, { type: 'binary' })
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const data = XLSX.utils.sheet_to_json(ws)
      
      const matchedData = matchBankStatement(data, pendingPayments || [])
      setMatches(matchedData)
    }
    reader.readAsBinaryString(file)
  }

  const handleBulkVerify = async () => {
    setIsProcessing(true)
    const matchedOnly = matches.filter(m => m.matchStatus === 'matched')
    
    for (const match of matchedOnly) {
        await verifyPayment.mutateAsync({ 
            id: match.matchedPaymentId, 
            status: 'verified',
            note: 'Verified via Bulk Bank Statement Match'
        })
    }
    setIsProcessing(false)
    setMatches([])
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Bulk Statement Matcher</h1>
        <p className="text-text-secondary mt-1">Automatically verify PoPs by matching them against bank statements.</p>
      </div>

      {matches.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl bg-bg-elevated/20">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileSearch className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-display font-bold">Upload Bank Statement</h3>
            <p className="text-text-muted mt-2 mb-8 max-w-sm text-center">Upload your CSV or Excel export from the bank to start the matching process.</p>
            <label className="cursor-pointer">
                <Button as="span">
                    <Upload className="w-4 h-4" />
                    Select Statement File
                </Button>
                <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} />
            </label>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <div className="flex gap-4">
                    <div className="bg-success/10 border border-success/20 px-4 py-2 rounded-xl">
                        <p className="text-[10px] text-success font-bold uppercase tracking-widest">Matched</p>
                        <p className="text-xl font-display font-bold text-success">{matches.filter(m => m.matchStatus === 'matched').length}</p>
                    </div>
                    <div className="bg-bg-elevated border border-border px-4 py-2 rounded-xl">
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Unmatched</p>
                        <p className="text-xl font-display font-bold text-text-primary">{matches.filter(m => m.matchStatus === 'unmatched').length}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setMatches([])}>Reset</Button>
                    <Button onClick={handleBulkVerify} isLoading={isProcessing}>
                        <Check className="w-4 h-4" />
                        Verify {matches.filter(m => m.matchStatus === 'matched').length} Matches
                    </Button>
                </div>
            </div>

            <div className="premium-card p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border text-[10px] font-bold uppercase tracking-widest text-text-muted">
                            <th className="px-6 py-4">Statement Reference</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Match Status</th>
                            <th className="px-6 py-4">Matched Buyer</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {matches.map((match, i) => (
                            <tr key={i} className={cn(
                                "transition-colors",
                                match.matchStatus === 'matched' ? "bg-success/5" : "hover:bg-bg-elevated/30"
                            )}>
                                <td className="px-6 py-4 text-xs font-mono opacity-80">{match.reference || match.Reference}</td>
                                <td className="px-6 py-4 text-xs font-bold">{formatCurrency(match.amount || match.Amount, 'USD')}</td>
                                <td className="px-6 py-4">
                                    {match.matchStatus === 'matched' ? (
                                        <div className="flex items-center gap-1.5 text-success">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase">Ready to Verify</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-text-muted">
                                            <AlertCircle className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase">No Match</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    {match.matchedBuyer || <span className="text-text-muted italic opacity-40">N/A</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  )
}
