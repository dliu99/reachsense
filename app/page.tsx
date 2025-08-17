"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import AgentActionsSidebar from "@/components/agent-actions"
import { Building2, User, Calendar, DollarSign } from "lucide-react"

interface Deal {
  id: string
  company: string
  dealTitle: string
  clientName: string
  status: "prospect" | "lead" | "client"
  lastContact: string
  value: number
  description: string
  email: string
  phone: string
}
const mockDeals: Deal[] = [
  {
    id: "1",
    company: "TechCorp Solutions",
    dealTitle: "Enterprise Software License",
    clientName: "Sarah Johnson",
    status: "prospect",
    lastContact: "2025-08-15",
    value: 50000,
    description: "Potential enterprise software licensing deal for 500+ employees",
    email: "sarah.johnson@techcorp.com",
    phone: "+1 (555) 123-4567",
  },
  {
    id: "2",
    company: "Global Industries",
    dealTitle: "Consulting Services",
    clientName: "Michael Chen",
    status: "lead",
    lastContact: "2025-08-14",
    value: 75000,
    description: "6-month consulting engagement for digital transformation",
    email: "m.chen@globalind.com",
    phone: "+1 (555) 987-6543",
  },
  {
    id: "3",
    company: "StartupXYZ",
    dealTitle: "SaaS Subscription",
    clientName: "Emily Rodriguez",
    status: "client",
    lastContact: "2025-08-13",
    value: 25000,
    description: "Annual SaaS subscription with premium support",
    email: "emily@startupxyz.com",
    phone: "+1 (555) 456-7890",
  },
  {
    id: "4",
    company: "MegaCorp Inc",
    dealTitle: "Custom Development",
    clientName: "David Wilson",
    status: "lead",
    lastContact: "2025-08-12",
    value: 120000,
    description: "Custom application development project",
    email: "d.wilson@megacorp.com",
    phone: "+1 (555) 321-0987",
  },
  {
    id: "5",
    company: "Local Business Co",
    dealTitle: "Website Redesign",
    clientName: "Lisa Thompson",
    status: "prospect",
    lastContact: "2025-08-11",
    value: 15000,
    description: "Complete website redesign and SEO optimization",
    email: "lisa@localbiz.com",
    phone: "+1 (555) 654-3210",
  },
]

const statusConfig = {
  prospect: { label: "Prospect", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  lead: { label: "Lead", color: "bg-blue-100 text-blue-800 border-blue-200" },
  client: { label: "Client", color: "bg-green-100 text-green-800 border-green-200" },
}

export default function CRMPipeline() {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [deals] = useState<Deal[]>(mockDeals)

  // Action panel states
  const [emailSubtype, setEmailSubtype] = useState<"schedule" | "followup" | "custom" | null>(null)
  const [emailSubject, setEmailSubject] = useState<string>("")
  const [emailBody, setEmailBody] = useState<string>("")
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  const [callSubtype, setCallSubtype] = useState<"schedule" | "followup" | "custom" | null>(null)
  const [callStatus, setCallStatus] = useState<"idle" | "in-progress" | "completed">("idle")
  const [callTranscript, setCallTranscript] = useState<string | null>(null)

  const [reportStatus, setReportStatus] = useState<"idle" | "in-progress" | "completed">("idle")
  const [reportUrl, setReportUrl] = useState<string | null>(null)

  // Notes used as context for actions
  const [notes, setNotes] = useState<string>("")

  // When switching deals, hide any open action panels in the workbench
  useEffect(() => {
    if (!selectedDeal) return
    // clear any open action panels while preserving per-deal notes
    setEmailSubtype(null)
    setEmailSubject("")
    setEmailBody("")
    setIsSendingEmail(false)
    setCallSubtype(null)
    setCallStatus("idle")
    setCallTranscript(null)
    setReportStatus("idle")
    setReportUrl(null)
  }, [selectedDeal])

  // Load notes for selected deal from localStorage
  useEffect(() => {
    if (!selectedDeal) return
    try {
      const stored = window.localStorage.getItem(`deal_notes_${selectedDeal.id}`)
      setNotes(stored ?? "")
    } catch (_) {}
  }, [selectedDeal])

  // Persist notes for selected deal
  useEffect(() => {
    if (!selectedDeal) return
    try {
      window.localStorage.setItem(`deal_notes_${selectedDeal.id}`, notes)
    } catch (_) {}
  }, [notes, selectedDeal])

  const handleAction = async (
    action: "email" | "call" | "report",
    deal: Deal,
    subtype?: "schedule" | "followup" | "custom"
  ) => {
    if (!deal) return
    if (action === "email") {
      // Clear other actions
      setCallSubtype(null)
      setCallStatus("idle")
      setCallTranscript(null)
      setReportStatus("idle")
      setReportUrl(null)
      setEmailSubtype(subtype ?? "custom")
      setEmailSubject("")
      setEmailBody("")
      setIsSendingEmail(true)
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "draft",
          subtype,
          dealId: deal.id,
          notes,
          clientName: deal.clientName,
          company: deal.company,
          dealTitle: deal.dealTitle,
          lastContact: deal.lastContact,
        }),
      })
      const data = await res.json()
      setEmailSubject(data.subject ?? "")
      setEmailBody(data.body ?? "")
      setIsSendingEmail(false)
    }
    if (action === "call") {
      // Clear other actions
      setEmailSubtype(null)
      setEmailSubject("")
      setEmailBody("")
      setReportStatus("idle")
      setReportUrl(null)
      setCallSubtype(subtype ?? "custom")
      setCallStatus("in-progress")
      setCallTranscript(null)
      await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "start", subtype, dealId: deal.id, notes }),
      })
    }
    if (action === "report") {
      // Clear other actions
      setEmailSubtype(null)
      setEmailSubject("")
      setEmailBody("")
      setCallSubtype(null)
      setCallStatus("idle")
      setCallTranscript(null)
      setReportStatus("in-progress")
      setReportUrl(null)
      const res = await fetch("/api/report", { method: "POST" })
      const data = await res.json()
      setReportStatus("completed")
      setReportUrl(data.url ?? null)
    }
  }

  const sendEmail = async () => {
    if (!selectedDeal || (!emailSubject && !emailBody)) return
    setIsSendingEmail(true)
    await fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "send",
        subtype: emailSubtype,
        dealId: selectedDeal.id,
        subject: emailSubject,
        body: emailBody,
        notes,
        clientName: selectedDeal.clientName,
        company: selectedDeal.company,
        dealTitle: selectedDeal.dealTitle,
        lastContact: selectedDeal.lastContact,
      }),
    })
    setIsSendingEmail(false)
  }

  const completeCall = async () => {
    const res = await fetch("/api/call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "complete" }),
    })
    const data = await res.json()
    setCallStatus("completed")
    setCallTranscript(data.transcript ?? "")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <>
      <AppSidebar deals={deals} onDealSelect={setSelectedDeal} selectedDeal={selectedDeal} />
      <SidebarInset>
        <div className="min-h-screen bg-background">
          <div className="border-b px-6 py-4 flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Manage your deals and client relationships</p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">Pipeline Board</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="max-h-[60vh] overflow-y-auto">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-background">
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 w-10"></th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Deal Title</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Company</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Client</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Value</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Contact</th>
                      </tr>
                      </thead>
                      <tbody>
                      {deals.map((deal) => (
                        <tr
                          key={deal.id}
                          className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => setSelectedDeal(deal)}
                        >
                          <td className="py-3 px-4 align-top">
                            <input
                              type="radio"
                              name="selectedDeal"
                              aria-label="Select deal"
                              checked={selectedDeal?.id === deal.id}
                              onChange={() => setSelectedDeal(deal)}
                              className="h-4 w-4 accent-primary"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <button
                                  className="text-left font-medium text-foreground hover:text-primary transition-colors"
                                  onClick={() => setSelectedDeal(deal)}
                                >
                                  {deal.dealTitle}
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>{deal.dealTitle}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Company</label>
                                      <p className="text-sm text-foreground">{deal.company}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Client</label>
                                      <p className="text-sm text-foreground">{deal.clientName}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Value</label>
                                      <p className="text-sm font-semibold text-foreground">
                                        {formatCurrency(deal.value)}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Last Contact</label>
                                      <p className="text-sm text-foreground">{formatDate(deal.lastContact)}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                                    <Badge
                                      className={`text-xs mt-1 ${statusConfig[deal.status].color}`}
                                      variant="outline"
                                    >
                                      {statusConfig[deal.status].label}
                                    </Badge>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                                    <p className="text-sm text-foreground mt-1">{deal.description}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                                      <p className="text-sm text-foreground">{deal.email}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                      <p className="text-sm text-foreground">{deal.phone}</p>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 text-sm text-foreground">
                              <Building2 className="h-3 w-3 text-muted-foreground" />
                              {deal.company}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 text-sm text-foreground">
                              <User className="h-3 w-3 text-muted-foreground" />
                              {deal.clientName}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={`text-xs ${statusConfig[deal.status].color}`} variant="outline">
                              {statusConfig[deal.status].label}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 font-medium text-foreground">
                              <DollarSign className="h-3 w-3" />
                              {formatCurrency(deal.value)}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {formatDate(deal.lastContact)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
            <AgentActionsSidebar
              selectedDeal={selectedDeal}
              onAction={(action, deal, subtype) => handleAction(action, deal, subtype)}
            />
          </div>
          <div className="px-6 pb-8 space-y-6">
            {selectedDeal && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Agent Workbench</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Notes Section */}
                  <div className="space-y-3">
                    <div className="font-medium">Notes</div>
                    <textarea
                      className="w-full h-40 rounded-md border bg-background p-3 text-sm font-mono"
                      placeholder="Add context for email and calls..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Tab") {
                          e.preventDefault()
                          const target = e.currentTarget
                          const start = target.selectionStart ?? notes.length
                          const end = target.selectionEnd ?? notes.length
                          const updated = notes.slice(0, start) + "\t" + notes.slice(end)
                          setNotes(updated)
                          requestAnimationFrame(() => {
                            try {
                              target.selectionStart = target.selectionEnd = start + 1
                            } catch (_) {}
                          })
                        }
                      }}
                    />
                    <div className="text-xs text-muted-foreground">Auto-saved per deal</div>
                  </div>

                  {/* Email Section */}
                  {emailSubtype && (
                    <div className="space-y-3">
                      <div className="font-medium">Email Draft ({emailSubtype})</div>
                      {isSendingEmail && (
                        <div className="text-sm text-muted-foreground">Generating email with AI...</div>
                      )}
                      <input
                        className="w-full rounded-md border bg-background p-2 text-sm"
                        placeholder="Subject"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                      />
                      <textarea
                        className="w-full h-40 rounded-md border bg-background p-3 text-sm"
                        placeholder="Email body"
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button disabled={isSendingEmail} onClick={sendEmail}>
                          {isSendingEmail ? "Sending..." : "Send Email"}
                        </Button>
                        <Button variant="secondary" onClick={() => { setEmailSubtype(null); setEmailSubject(""); setEmailBody("") }}>Cancel</Button>
                      </div>
                    </div>
                  )}

                  {/* Call Section */}
                  {callSubtype && (
                    <div className="space-y-3">
                      <div className="font-medium">Call ({callSubtype})</div>
                      {callStatus === "in-progress" && (
                        <div className="text-sm text-muted-foreground">Call in progress...</div>
                      )}
                      {callStatus === "completed" && (
                        <div>
                          <div className="text-sm font-medium mb-1">Call Transcript</div>
                          <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-3 rounded-md">{callTranscript}</pre>
                        </div>
                      )}
                      <div className="flex gap-2">
                        {callStatus === "in-progress" ? (
                          <Button onClick={completeCall}>Complete Call</Button>
                        ) : (
                          <Button variant="secondary" onClick={() => { setCallSubtype(null); setCallStatus("idle"); setCallTranscript(null) }}>Clear</Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Report Section */}
                  {(reportStatus === "in-progress" || reportStatus === "completed") && (
                    <div className="space-y-3">
                      <div className="font-medium">Report</div>
                      {reportStatus === "in-progress" && (
                        <div className="text-sm text-muted-foreground">Report PDF in progress...</div>
                      )}
                      {reportStatus === "completed" && (
                        <div className="text-sm">
                          Report complete. {reportUrl ? <a className="underline" href={reportUrl} target="_blank" rel="noopener noreferrer">Download</a> : null}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes are managed in the sidebar */}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </SidebarInset>
    </>
  )
}
