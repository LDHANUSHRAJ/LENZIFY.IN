import { createClient } from "@/lib/supabase/server";
import { Package, Truck, CheckCircle2, ChevronLeft, Clock, AlertCircle, Eye, MapPin, CreditCard } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Try to find in orders first
  const { data: standardOrder } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*)), order_tracking(*)")
    .eq("id", id)
    .single();

  // If not, try lens_replacement_orders
  let order = standardOrder;
  let isReplacement = false;

  if (!order) {
    const { data: replacementOrder } = await supabase
      .from("lens_replacement_orders")
      .select("*, order_tracking(*)")
      .eq("id", id)
      .single();
    if (replacementOrder) {
      order = replacementOrder;
      isReplacement = true;
    }
  }

  if (!order) {
    return (
      <div className="bg-[#F8F9FC] min-h-screen pt-28 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl border border-[#ECECEC] shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-12 text-center max-w-md w-full">
          <AlertCircle size={40} className="mx-auto text-[#ECECEC] mb-4" />
          <h1 className="text-xl font-semibold text-[#111111] mb-2">Order Not Found</h1>
          <p className="text-[#666666] text-sm mb-6">
            The requested order could not be found. It may be invalid or belong to a different account.
          </p>
          <Link href="/orders" className="inline-block bg-[#03173D] text-white rounded-full px-6 py-3 font-semibold hover:bg-[#004AAD] transition-all text-sm">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const steps = isReplacement ? [
    { key: "Order Placed", label: "Order Placed", icon: Package },
    { key: "Pickup Scheduled", label: "Pickup Scheduled", icon: Clock },
    { key: "Picked Up", label: "Frame Picked Up", icon: Truck },
    { key: "Processing", label: "In Lab", icon: Eye },
    { key: "Ready", label: "Quality Check", icon: CheckCircle2 },
    { key: "Out for Delivery", label: "Out for Delivery", icon: Truck },
    { key: "Delivered", label: "Delivered", icon: CheckCircle2 },
  ] : [
    { key: "pending", label: "Order Placed", icon: Package },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
    { key: "processing", label: "Processing", icon: Clock },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.status);
  const activeStep = currentStepIndex !== -1 ? currentStepIndex : 0;

  const statusBadge = (status: string) => {
    if (status === "delivered")
      return "bg-green-50 text-green-700 border border-green-200";
    if (status === "processing" || status === "confirmed" || status === "shipped")
      return "bg-blue-50 text-[#004AAD] border border-blue-200";
    return "bg-amber-50 text-amber-700 border border-amber-200";
  };

  return (
    <div className="bg-[#F8F9FC] min-h-screen pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 space-y-6">
        {/* Back link */}
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-[#004AAD] text-sm font-semibold hover:underline"
        >
          <ChevronLeft size={16} /> Back to Orders
        </Link>

        {/* Order Header Card */}
        <div className="bg-white rounded-3xl border border-[#ECECEC] shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#004AAD] mb-1">Order</p>
              <h1 className="text-2xl font-[var(--font-hero)] italic text-[#111111]">
                #{order.id.slice(0, 12).toUpperCase()}
              </h1>
              <p className="text-[#666666] text-sm mt-1">
                Placed on{" "}
                {new Date(order.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <span className={cn("text-sm font-semibold px-4 py-2 rounded-full capitalize self-start", statusBadge(order.status))}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-3xl border border-[#ECECEC] shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#004AAD] mb-8">Order Progress</p>

          {/* Horizontal timeline on md+, vertical on mobile */}
          <div className="hidden md:flex justify-between items-start relative">
            {/* Track line */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#ECECEC] z-0" />
            <div
              className="absolute top-4 left-0 h-0.5 bg-[#03173D] z-0 transition-all duration-700"
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, i) => {
              const isCompleted = i < activeStep;
              const isCurrent = i === activeStep;
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex flex-col items-center gap-3 z-10 flex-1">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                      isCurrent
                        ? "border-[#03173D] bg-white shadow-[0_0_0_4px_rgba(3,23,61,0.1)]"
                        : isCompleted
                        ? "border-[#03173D] bg-[#03173D]"
                        : "border-[#ECECEC] bg-white"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={14} className="text-white" />
                    ) : isCurrent ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#03173D]" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-[#ECECEC]" />
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-xs font-semibold text-center leading-tight max-w-[80px]",
                      isCurrent ? "text-[#03173D]" : isCompleted ? "text-[#111111]" : "text-[#ECECEC]"
                    )}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Vertical timeline (mobile) */}
          <div className="md:hidden space-y-0">
            {steps.map((step, i) => {
              const isCompleted = i < activeStep;
              const isCurrent = i === activeStep;
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                        isCurrent
                          ? "border-[#03173D] bg-white"
                          : isCompleted
                          ? "border-[#03173D] bg-[#03173D]"
                          : "border-[#ECECEC] bg-white"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={14} className="text-white" />
                      ) : (
                        <div className={cn("w-2 h-2 rounded-full", isCurrent ? "bg-[#03173D]" : "bg-[#ECECEC]")} />
                      )}
                    </div>
                    {i < steps.length - 1 && (
                      <div className={cn("w-0.5 flex-1 min-h-[24px] my-1", isCompleted ? "bg-[#03173D]" : "bg-[#ECECEC]")} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className={cn("text-sm font-semibold", isCurrent ? "text-[#03173D]" : isCompleted ? "text-[#111111]" : "text-[#666666]")}>
                      {step.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Items */}
        {!isReplacement && order.order_items?.length > 0 && (
          <div className="bg-white rounded-3xl border border-[#ECECEC] shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#004AAD] mb-6">Items Ordered</p>
            <div className="space-y-4">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#F8F9FC] border border-[#ECECEC] rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                    <img
                      src={item.products?.product_images?.[0]?.image_url || "/placeholder.jpg"}
                      className="w-full h-full object-contain"
                      alt={item.products?.name}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#111111] truncate">{item.products?.name}</p>
                    <p className="text-[#666666] text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-[#111111] flex-shrink-0">₹{(item.price || 0).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tracking Events */}
        {order.order_tracking?.length > 0 && (
          <div className="bg-white rounded-3xl border border-[#ECECEC] shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#004AAD] mb-6">Shipment Updates</p>
            <div className="space-y-4">
              {order.order_tracking.map((track: any) => (
                <div key={track.id} className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-[#F8F9FC] border border-[#ECECEC] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Truck size={16} className="text-[#004AAD]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111111] text-sm">{track.checkpoint_location}</p>
                    <p className="text-[#666666] text-xs mt-0.5">
                      {new Date(track.created_at).toLocaleString("en-IN")}
                    </p>
                    {track.status_description && (
                      <p className="text-[#666666] text-sm mt-1">{track.status_description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Carrier info */}
            <div className="mt-6 pt-6 border-t border-[#ECECEC] flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#666666] mb-1">Carrier</p>
                <p className="font-semibold text-[#111111]">
                  {order.order_tracking[order.order_tracking.length - 1]?.courier_name || "Standard Network"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#666666] mb-1">Tracking ID</p>
                <p className="font-mono font-semibold text-[#111111]">
                  {order.order_tracking[order.order_tracking.length - 1]?.tracking_id || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Summary Card */}
        <div className="bg-white rounded-3xl border border-[#ECECEC] shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#004AAD] mb-6">Order Summary</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            {order.shipping_address && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} className="text-[#004AAD]" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#666666]">Shipping Address</p>
                </div>
                <div className="bg-[#F8F9FC] rounded-xl border border-[#E8EAF2] p-4 text-sm text-[#111111] leading-relaxed">
                  {typeof order.shipping_address === "object" ? (
                    <>
                      <p className="font-semibold">{order.shipping_address.name}</p>
                      <p className="text-[#666666]">{order.shipping_address.address}</p>
                      <p className="text-[#666666]">
                        {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                      </p>
                      <p className="text-[#666666]">{order.shipping_address.phone}</p>
                    </>
                  ) : (
                    <p className="text-[#666666]">{order.shipping_address}</p>
                  )}
                </div>
              </div>
            )}

            {/* Payment & Total */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CreditCard size={14} className="text-[#004AAD]" />
                <p className="text-xs font-semibold uppercase tracking-widest text-[#666666]">Payment</p>
              </div>
              <div className="bg-[#F8F9FC] rounded-xl border border-[#E8EAF2] p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#666666]">Method</span>
                  <span className="font-semibold text-[#111111] capitalize">
                    {order.payment_method || "Online Payment"}
                  </span>
                </div>
                <div className="border-t border-[#ECECEC] pt-3 flex justify-between">
                  <span className="font-semibold text-[#111111]">Total</span>
                  <span className="font-bold text-[#111111] text-lg">
                    ₹{(order.total_price || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
