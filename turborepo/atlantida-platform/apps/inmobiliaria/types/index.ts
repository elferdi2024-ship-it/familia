export interface Lead {
    id: string;
    propertyId: string;
    propertyTitle: string;
    agentId: string;
    leadName: string;
    leadEmail: string;
    leadMessage: string;
    createdAt: unknown;
    status: "new" | "contacted" | "closed" | "interested" | "visit_scheduled" | "lost";
    contactType?: "contact" | "visit";
    visitDate?: string;
    visitTime?: string;
}

export type { Property } from "@/lib/data"
