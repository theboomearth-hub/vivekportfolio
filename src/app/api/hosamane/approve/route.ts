import { issueApproval } from "@/lib/hosamane/approval";
import type { ApprovalAction } from "@/lib/hosamane/types";

const ACTIONS: ApprovalAction[] = ["send_owner_message", "schedule_visits", "share_shortlist", "report_listing"];

/**
 * Called only when the person taps an approve button. This is the one place that signs approvals;
 * the planner never imports issueApproval.
 */
export async function POST(req: Request) {
  const { action, payload } = (await req.json()) as { action: ApprovalAction; payload: unknown };
  if (!ACTIONS.includes(action)) return Response.json({ error: "Unknown action" }, { status: 400 });
  return Response.json({ token: issueApproval(action, payload) });
}
