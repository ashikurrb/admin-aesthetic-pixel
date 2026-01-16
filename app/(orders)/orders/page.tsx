"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import dayjs from "dayjs";
import {
  ArrowDownAz,
  CheckCircle,
  Clock,
  ClockFading,
  ClockFadingIcon,
  Eye,
  RefreshCcw,
  Search,
  TicketX,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface PaymentDetail {
  method: string;
  trxId: string;
  accNo: string;
  amount: number;
  _id?: string;
}

export default function Orders() {
  const [loading, setLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [searchOrder, setSearchOrder] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [actionType, setActionType] = useState<
    "Accepted" | "Cancelled" | "Pending" | "Refunded" | null
  >(null);

  //get logged in user orders
  const getAllOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/order/all-orders`
      );
      setOrders(data.orders);
      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      setLoading(false);
    }
  };

  //filter orders search
  const filteredOrders = useMemo(() => {
    const query = searchOrder.toLowerCase().trim();

    if (!query) return orders;

    return orders.filter((o) => {
      return (
        o.orderId?.toLowerCase().includes(query) ||
        o.paymentDetails?.some(
          (pd: PaymentDetail) =>
            pd.trxId?.toLowerCase().includes(query) ||
            pd.accNo?.toLowerCase().includes(query) ||
            pd.method?.toLowerCase().includes(query)
        )
      );
    });
  }, [orders, searchOrder]);

  const updateOrderStatus = async (
    status: "Accepted" | "Cancelled" | "Pending" | "Refunded"
  ) => {
    if (!selectedOrder) return;

    try {
      setActionLoading(true);
      setActionType(status);

      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/order/update-order-status/${selectedOrder._id}`,
        { status }
      );

      toast.success(`Order ${status}`);

      setOrders((prev) =>
        prev.map((o) => (o._id === selectedOrder._id ? { ...o, status } : o))
      );

      setSelectedOrder((prev: any) => ({ ...prev, status }));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
      setActionType(null);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  return (
    <div className="lg:px-8 w-full pb-10">
      <h1 className="text-4xl font-bold">Orders</h1>
      <div className="flex justify-end items-center mb-4">
        {/* Search wrapper */}
        <div className="relative max-w-sm w-full">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <Input
            type="text"
            className="h-12 pl-10 border-gray-400 border-2"
            placeholder="Search orders..."
            value={searchOrder}
            onChange={(e) => setSearchOrder(e.target.value)}
          />
        </div>
      </div>

      <div className="relative w-full max-w-[90vw] md:max-w-full max-h-[90vh] overflow-auto rounded-md">
        <Table>
          <TableHeader className="sticky top-0 z-50 bg-gray-700">
            <TableRow className="whitespace-nowrap hover:bg-transparent">
              <TableHead className="text-white">#</TableHead>
              <TableHead className="text-white">Order ID</TableHead>
              <TableHead className="text-white">Placed On</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Client</TableHead>
              <TableHead className="text-white">Method</TableHead>
              <TableHead className="text-white">Amount</TableHead>
              <TableHead className="text-white">A/C No</TableHead>
              <TableHead className="text-white">Trx ID</TableHead>
              <TableHead className="text-white">View</TableHead>
            </TableRow>
          </TableHeader>
          {loading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={10} className="text-center py-10">
                  <div className="flex items-center justify-center gap-2 text-gray-300 text-md">
                    <Spinner /> Loading orders...
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center py-10 text-gray-400"
                  >
                    <h3 className="text-lg font-semibold">No orders found</h3>
                    <br />
                    <Button
                      variant="secondary"
                      className="cursor-pointer rounded-lg border-gray-300"
                      onClick={() => setSearchOrder("")}
                    >
                      Clear
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order, index) => (
                  <TableRow
                    key={order._id}
                    className="border-b border-gray-800"
                  >
                    <TableCell className="font-medium whitespace-nowrap">
                      {index + 1}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {order.orderId}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span>
                          {dayjs(order.createdAt).format("DD-MMM-YYYY")}
                        </span>
                        <span className="text-xs text-gray-400">
                          {dayjs(order.createdAt).format("hh:mm a")}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      <Badge
                        className={`font-bold flex w-fit items-center gap-1 py-1 ${
                          order.status === "Pending"
                            ? "bg-yellow-500 text-black"
                            : order.status === "Accepted"
                            ? "bg-green-700 text-white"
                            : "bg-red-700 text-white"
                        }`}
                      >
                        {order.status === "Pending" && <Clock size={16} />}
                        {order.status === "Accepted" && (
                          <CheckCircle size={16} />
                        )}
                        {order.status === "Cancelled" && <XCircle size={16} />}
                        {order.status === "Refunded" && <TicketX size={16} />}
                        {order.status}
                      </Badge>
                    </TableCell>

                    <TableCell>Client</TableCell>
                    <TableCell>
                      {order.paymentDetails
                        .map((pd: PaymentDetail) => pd.method)
                        .join(", ")}
                    </TableCell>

                    <TableCell>৳ {order.finalPrice}</TableCell>

                    <TableCell>
                      {order.paymentDetails
                        .map((pd: PaymentDetail) => pd.accNo)
                        .join(", ")}
                    </TableCell>

                    <TableCell>
                      {order.paymentDetails
                        .map((pd: PaymentDetail) => pd.trxId)
                        .join(", ")}
                    </TableCell>

                    <TableCell>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setOpen(true);
                        }}
                        className="dark:text-white dark:hover:bg-red-600 dark:bg-[#27272A80] bg-gray-300 hover:bg-gray-400 rounded-md dark:border-2 border-[#222223]
  transition-colors cursor-pointer duration-200 px-3 py-2"
                      >
                        <Eye size={18} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          )}
        </Table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden bg-white dark:bg-zinc-950">
          <DialogHeader className="p-6 border-b bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    Order #{selectedOrder?.orderId}
                  </h2>
                  <Badge
                    variant="outline"
                    className={`px-2.5 py-0.5 text-xs font-semibold border ${
                      selectedOrder?.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800"
                        : selectedOrder?.status === "Accepted"
                        ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                        : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                    }`}
                  >
                    {selectedOrder?.status === "Pending" && (
                      <Clock size={12} className="mr-1.5" />
                    )}
                    {selectedOrder?.status === "Accepted" && (
                      <CheckCircle size={12} className="mr-1.5" />
                    )}
                    {(selectedOrder?.status === "Cancelled" ||
                      selectedOrder?.status === "Refunded") && (
                      <XCircle size={12} className="mr-1.5" />
                    )}
                    {selectedOrder?.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  Placed on{" "}
                  {dayjs(selectedOrder?.date).format("DD MMM YYYY, hh:mm A")}
                </p>
              </div>

              <button
                onClick={() => updateOrderStatus("Pending")}
                disabled={actionLoading || selectedOrder?.status === "Pending"}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {actionLoading && actionType === "Pending" ? (
                  <Spinner className="size-12" />
                ) : (
                  <ClockFading size={14} />
                )}
                Set as Pending
              </button>
            </div>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 bg-zinc-50/30 dark:bg-zinc-900/10">
            <div className="md:col-span-2 p-6 border-r space-y-6 bg-background">
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  Order Items
                  <span className="text-xs font-normal text-muted-foreground ml-auto">
                    {selectedOrder?.orderItems.length} items
                  </span>
                </h3>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader className="bg-zinc-50 dark:bg-zinc-900">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="h-10 text-xs font-medium">
                          #
                        </TableHead>
                        <TableHead className="h-10 text-xs font-medium">
                          Product
                        </TableHead>
                        <TableHead className="h-10 text-xs font-medium text-right">
                          Price
                        </TableHead>
                        <TableHead className="h-10 text-xs font-medium text-right">
                          Qty
                        </TableHead>
                        <TableHead className="h-10 text-xs font-medium text-right">
                          Photos
                        </TableHead>
                        <TableHead className="h-10 text-xs font-medium text-right">
                          Total
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder?.orderItems.map(
                        (item: any, index: number) => (
                          <TableRow key={item._id} className="text-sm">
                            <TableCell className="py-3">{index + 1}</TableCell>
                            <TableCell className="py-3">
                              <div className="font-medium text-foreground">
                                {item.name}
                              </div>
                            </TableCell>
                            <TableCell className="text-right py-3 font-mono text-muted-foreground">
                              ৳{item.unitPrice}
                            </TableCell>
                            <TableCell className="text-right py-3 font-mono">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-right py-3 font-mono">
                              {item.photos}
                            </TableCell>
                            <TableCell className="text-right py-3 font-medium font-mono">
                              ৳{item.totalProductPrice}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="pt-4 border-t text-xs text-muted-foreground">
                Last Updated by
                <span className="font-medium text-foreground">
                  {selectedOrder?.createdBy?.name}
                </span>{" "}
                on{" "}
                {dayjs(selectedOrder?.updatedAt).format("DD MMM YYYY, hh:mm A")}
              </div>
            </div>

            <div className="md:col-span-1 p-6 space-y-8 bg-zinc-50/50 dark:bg-zinc-900/20">
              {/* Payment Section */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-foreground">
                  Payment Details
                </h3>
                <div className="space-y-3">
                  {selectedOrder?.paymentDetails.map((pd: any) => (
                    <div
                      key={pd._id}
                      className="bg-background border rounded-lg p-3 text-sm shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-foreground">
                          {pd.method}
                        </span>
                        <Badge
                          variant="secondary"
                          className="h-5 px-1.5 text-[10px] bg-green-100 text-green-700 hover:bg-green-100 border-transparent"
                        >
                          Paid
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>A/C:</span>{" "}
                          <span className="font-mono text-foreground">
                            {pd.accNo}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Trx:</span>{" "}
                          <span className="font-mono text-foreground">
                            {pd.trxId}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Summary Section */}
              <div className="bg-background rounded-lg border p-4 space-y-3 shadow-sm">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-mono">
                      ৳{selectedOrder?.subTotal}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Discount</span>
                    <span className="font-mono text-red-500">
                      - ৳{selectedOrder?.discountedAmount}
                    </span>
                  </div>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-bold text-sm">Total</span>
                  <span className="font-bold text-lg font-mono">
                    ৳{selectedOrder?.finalPrice}
                  </span>
                </div>
              </div>

              {/* ACTIONS SECTION */}
              <div className="space-y-3 pt-2">
                <button
                  disabled={
                    actionLoading || selectedOrder?.status !== "Pending"
                  }
                  onClick={() => updateOrderStatus("Accepted")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {actionLoading && actionType === "Accepted" ? (
                    <Spinner />
                  ) : (
                    <CheckCircle size={16} />
                  )}
                  Accept Order
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={
                      actionLoading || selectedOrder?.status !== "Pending"
                    }
                    onClick={() => updateOrderStatus("Refunded")}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium border border-zinc-200 bg-white hover:bg-zinc-50 hover:text-red-600 text-zinc-700 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading && actionType === "Refunded" ? (
                      <Spinner />
                    ) : (
                      <RefreshCcw size={14} />
                    )}
                    Refund
                  </button>
                  <button
                    disabled={
                      actionLoading || selectedOrder?.status !== "Pending"
                    }
                    onClick={() => updateOrderStatus("Cancelled")}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium border border-zinc-200 bg-white hover:bg-red-50 hover:text-red-600 text-zinc-700 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading && actionType === "Cancelled" ? (
                      <Spinner />
                    ) : (
                      <XCircle size={14} />
                    )}
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
