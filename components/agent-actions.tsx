"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, FileText, Search, Building2, User, DollarSign, Calendar } from "lucide-react"

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

const statusConfig = {
  prospect: { label: "Prospect", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  lead: { label: "Lead", color: "bg-blue-100 text-blue-800 border-blue-200" },
  client: { label: "Client", color: "bg-green-100 text-green-800 border-green-200" },
} as const

export function AgentActionsSidebar({
  selectedDeal,
  onAction,
}: {
  selectedDeal: Deal | null
  onAction: (action: "email" | "call" | "report" | "research", deal: Deal) => void
}) {
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
    <div className="lg:sticky lg:top-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Agent Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedDeal ? (
            <div className="text-sm text-muted-foreground">Select a deal to see available actions.</div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">{selectedDeal.dealTitle}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-3 w-3" />
                  {selectedDeal.company}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-3 w-3" />
                  {selectedDeal.clientName}
                </div>
                <div className="flex items-center justify-between">
                  <Badge className={`text-xs ${statusConfig[selectedDeal.status].color}`} variant="outline">
                    {statusConfig[selectedDeal.status].label}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <DollarSign className="h-3 w-3" />
                    {formatCurrency(selectedDeal.value)}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Last contact: {formatDate(selectedDeal.lastContact)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  onClick={() => onAction("email", selectedDeal)}
                  className="justify-start"
                >
                  <Mail className="h-4 w-4 mr-2" /> Email
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => onAction("call", selectedDeal)}
                  className="justify-start"
                >
                  <Phone className="h-4 w-4 mr-2" /> Call
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => onAction("report", selectedDeal)}
                  className="justify-start"
                >
                  <FileText className="h-4 w-4 mr-2" /> Report
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => onAction("research", selectedDeal)}
                  className="justify-start"
                >
                  <Search className="h-4 w-4 mr-2" /> Research
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AgentActionsSidebar


