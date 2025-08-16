"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
    lastContact: "2024-01-15",
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
    lastContact: "2024-01-12",
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
    lastContact: "2024-01-10",
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
    lastContact: "2024-01-08",
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
    lastContact: "2024-01-05",
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

  const handleAction = (action: string, deal: Deal) => {
    console.log(`[v0] ${action} action triggered for deal:`, deal.dealTitle)
    // In a real app, these would trigger actual actions
    switch (action) {
      case "email":
        window.open(`mailto:${deal.email}?subject=Regarding ${deal.dealTitle}`)
        break
      case "call":
        window.open(`tel:${deal.phone}`)
        break
      case "report":
        console.log("[v0] Generating report for:", deal.company)
        break
      case "research":
        console.log("[v0] Conducting research on:", deal.company)
        break
    }
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
              <h1 className="text-3xl font-bold text-foreground">CRM Pipeline</h1>
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
            <AgentActionsSidebar selectedDeal={selectedDeal} onAction={(action, deal) => handleAction(action, deal)} />
          </div>
        </div>
      </SidebarInset>
    </>
  )
}
