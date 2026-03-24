import React, { useState } from 'react'
import { 
  Upload, 
  ArrowRight, 
  CheckCircle2, 
  FileSpreadsheet, 
  AlertCircle,
  TrendingUp,
  X,
  Database
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/utils'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'

interface ImportWizardProps {
  onClose: () => void
  onImport: (data: any[]) => void
  type: 'stands' | 'buyers'
}

const REQUIRED_FIELDS = {
  stands: ['stand_number', 'size_sqm', 'price_usd', 'status'],
  buyers: ['full_name', 'email', 'id_number']
}

export const ImportWizard: React.FC<ImportWizardProps> = ({ onClose, onImport, type }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [fileData, setFileData] = useState<any[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const bstr = event.target?.result
      const wb = XLSX.read(bstr, { type: 'binary' })
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 })
      
      const fileHeaders = data[0] as string[]
      const fileRows = data.slice(1) as any[]
      
      setHeaders(fileHeaders)
      setFileData(fileRows)
      
      // Auto-mapping attempt
      const initialMapping: Record<string, string> = {}
      REQUIRED_FIELDS[type].forEach(field => {
        const match = fileHeaders.find(h => h.toLowerCase().includes(field.replace('_', '')))
        if (match) initialMapping[field] = match
      })
      setMapping(initialMapping)
      setStep(2)
    }
    reader.readAsBinaryString(file)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-bg-base/80 backdrop-blur-md">
      <div className="premium-card max-w-4xl w-full bg-bg-surface p-0 flex flex-col h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-bg-elevated/20">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Database className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-xl font-display font-bold">Import {type === 'stands' ? 'Stands' : 'Buyers'}</h2>
                    <p className="text-xs text-text-muted">Step {step} of 3: {step === 1 ? 'Upload' : step === 2 ? 'Mapping' : 'Preview'}</p>
                </div>
            </div>
            <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
            {step === 1 && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                    <label className="w-full max-w-lg border-2 border-dashed border-border rounded-2xl p-12 hover:border-primary/50 transition-all cursor-pointer group">
                        <Upload className="w-12 h-12 text-text-muted mx-auto mb-4 group-hover:text-primary group-hover:scale-110 transition-all" />
                        <h3 className="text-lg font-display font-bold mb-2">Upload Excel or CSV</h3>
                        <p className="text-sm text-text-secondary max-w-xs mx-auto mb-6">Drag and drop your file here, or click to browse. Supports .xlsx, .xls, and .csv</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-bg-elevated rounded-lg text-xs font-bold text-text-primary">
                            <FileSpreadsheet className="w-4 h-4 text-success" />
                            Sample_Template.xlsx
                        </div>
                        <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} />
                    </label>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-8 animate-fade-in-up">
                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex gap-3">
                        <AlertCircle className="w-5 h-5 text-primary" />
                        <p className="text-xs text-text-secondary leading-relaxed">
                            We've attempted to automatically map your columns. Please review and ensure every <span className="text-text-primary font-bold underline">Required Field</span> is correctly matched to a header from your file.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {REQUIRED_FIELDS[type].map(field => (
                            <div key={field} className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold uppercase tracking-widest text-text-primary">{field.replace('_', ' ')} *</label>
                                    <span className="text-[10px] text-primary font-bold">REQUIRED</span>
                                </div>
                                <select 
                                    className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    value={mapping[field] || ''}
                                    onChange={(e) => setMapping({...mapping, [field]: e.target.value})}
                                >
                                    <option value="">Select Header</option>
                                    {headers.map(h => <option key={h} value={h}>{h}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6 animate-fade-in-up">
                    <div className="grid grid-cols-3 gap-6">
                        {[
                            { label: 'Total Rows', value: fileData.length, icon: Database, color: 'text-primary' },
                            { label: 'Valid Records', value: fileData.length, icon: CheckCircle2, color: 'text-success' },
                            { label: 'Errors', value: 0, icon: AlertCircle, color: 'text-danger' },
                        ].map(stat => (
                            <div key={stat.label} className="bg-bg-elevated/50 border border-border p-4 rounded-xl">
                                <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">{stat.label}</p>
                                <p className={cn("text-2xl font-display font-bold", stat.color)}>{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="border border-border rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                             <thead className="bg-bg-elevated uppercase font-bold">
                                 <tr>
                                     {REQUIRED_FIELDS[type].map(f => <th key={f} className="px-4 py-3">{f}</th>)}
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-border">
                                {fileData.slice(0, 5).map((row, i) => (
                                    <tr key={i} className="hover:bg-bg-elevated/30">
                                        {REQUIRED_FIELDS[type].map(f => {
                                             const colIndex = headers.indexOf(mapping[f])
                                             return <td key={f} className="px-4 py-3 font-mono opacity-80">{row[colIndex]}</td>
                                        })}
                                    </tr>
                                ))}
                             </tbody>
                        </table>
                        {fileData.length > 5 && (
                            <div className="p-3 text-center bg-bg-elevated/20 text-text-muted">
                                + {fileData.length - 5} more records
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-bg-elevated/20 flex justify-between">
            <Button variant="ghost" onClick={onClose} disabled={step === 1}>Cancel</Button>
            <div className="flex gap-3">
                {step > 1 && (
                    <Button variant="outline" onClick={() => setStep(step === 3 ? 2 : 1)}>Back</Button>
                )}
                {step === 2 && (
                    <Button onClick={() => setStep(3)} disabled={Object.keys(mapping).length < REQUIRED_FIELDS[type].length}>
                        Validate & Preview
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                )}
                {step === 3 && (
                    <Button onClick={() => onImport(fileData.map(row => {
                        const obj: any = {}
                        REQUIRED_FIELDS[type].forEach(f => {
                            obj[f] = row[headers.indexOf(mapping[f])]
                        })
                        return obj
                    }))}>
                        Commit Import
                        <TrendingUp className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
      </div>
    </div>
  )
}
