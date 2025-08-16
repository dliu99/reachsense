"use client"

import { Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

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
}

interface AppSidebarProps {
  deals: Deal[]
  onDealSelect: (deal: Deal) => void
  selectedDeal?: Deal | null
}

export function AppSidebar({ deals, onDealSelect, selectedDeal }: AppSidebarProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">Deal Overview</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Active Deals</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {deals.map((deal) => (
                <SidebarMenuItem key={deal.id}>
                  <SidebarMenuButton
                    onClick={() => onDealSelect(deal)}
                    isActive={selectedDeal?.id === deal.id}
                    className="flex flex-col items-start gap-1 p-3 h-auto"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium text-sm truncate">{deal.dealTitle}</span>
                    </div>
                    <div className="flex items-center gap-2 w-full pl-6">
                      <span className="text-xs text-muted-foreground truncate">{deal.company}</span>
                    </div>
                    <div className="flex items-center justify-between w-full pl-6">
                      <Badge className={`text-xs ${statusConfig[deal.status].color}`} variant="outline">
                        {statusConfig[deal.status].label}
                      </Badge>
                      <span className="text-xs font-medium">{formatCurrency(deal.value)}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
