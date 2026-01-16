"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
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
        <DialogContent className="max-w-3xl ">
          <DialogHeader>
            <h2 className="text-xl font-bold mb-2">
              Order Details — {selectedOrder?.orderId}
            </h2>
            <div className="flex justify-between items-center">
              <Badge
                className={`font-bold flex w-fit items-center gap-1 py-1 ${
                  selectedOrder?.status === "Pending"
                    ? "bg-yellow-500 text-black"
                    : selectedOrder?.status === "Accepted"
                    ? "bg-green-700 text-white"
                    : "bg-red-700 text-white"
                }`}
              >
                {selectedOrder?.status === "Pending" && <Clock size={16} />}
                {selectedOrder?.status === "Accepted" && (
                  <CheckCircle size={16} />
                )}
                {selectedOrder?.status === "Cancelled" && <XCircle size={16} />}
                {selectedOrder?.status === "Refunded" && <TicketX size={16} />}
                {selectedOrder?.status}
              </Badge>
              <button
                onClick={() => updateOrderStatus("Pending")}
                disabled={actionLoading || selectedOrder?.status === "Pending"}
                className="font-bold text-blue-500 disabled:opacity-50 cursor-pointer"
              >
                {actionLoading && actionType === "Pending" ? (
                  <span className="flex gap-2 items-center justify-center">
                    <Spinner /> Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ClockFading size={16} className="font-bold" /> Set Pending
                    Again
                  </span>
                )}
              </button>
            </div>
          </DialogHeader>

          {/* ORDER ITEMS */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Order Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Photos</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedOrder?.orderItems.map((item: any) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>৳ {item.unitPrice}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.photos}</TableCell>
                    <TableCell>৳ {item.totalProductPrice}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* PAYMENT INFO */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Payment Details</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Method</TableHead>
                  <TableHead>A/C No</TableHead>
                  <TableHead>Trx ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedOrder?.paymentDetails.map((pd: any) => (
                  <TableRow key={pd._id}>
                    <TableCell>{pd.method}</TableCell>
                    <TableCell>{pd.accNo}</TableCell>
                    <TableCell>{pd.trxId}</TableCell>
                    <TableCell>৳ {pd.amount}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-700 text-white">Paid</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* SUMMARY */}
          <div className="mt-6 text-sm space-y-1">
            <p>Subtotal: ৳ {selectedOrder?.subTotal}</p>
            <p>Discount: ৳ {selectedOrder?.discountedAmount}</p>
            <p className="font-bold text-lg">
              Final: ৳ {selectedOrder?.finalPrice}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-between items-center">
            <button
              disabled={actionLoading || selectedOrder?.status !== "Pending"}
              onClick={() => updateOrderStatus("Refunded")}
              className="text-red-600 font-bold disabled:opacity-50 cursor-pointer"
            >
              {actionLoading && actionType === "Refunded" ? (
                <span className="flex gap-2 items-center">
                  <Spinner /> Processing...
                </span>
              ) : (
                <span className="flex gap-2 items-center">
                  <RefreshCcw /> Refund
                </span>
              )}
            </button>

            <div className="flex justify-end gap-3">
              <button
                disabled={actionLoading || selectedOrder?.status !== "Pending"}
                onClick={() => updateOrderStatus("Cancelled")}
                className="px-4 py-2 rounded-md text-white bg-red-700 hover:bg-red-800 disabled:opacity-50 cursor-pointer"
              >
                {actionLoading && actionType === "Cancelled" ? (
                  <span className="flex gap-2 items-center">
                    <Spinner /> Processing...
                  </span>
                ) : (
                  <span className="flex gap-2 items-center">
                    <XCircle /> Cancel Order
                  </span>
                )}
              </button>

              <button
                disabled={actionLoading || selectedOrder?.status !== "Pending"}
                onClick={() => updateOrderStatus("Accepted")}
                className="px-4 py-2 rounded-md text-white bg-green-700 hover:bg-green-800 disabled:opacity-50 cursor-pointer"
              >
                {actionLoading && actionType === "Accepted" ? (
                  <span className="flex gap-2 items-center">
                    <Spinner /> Processing...
                  </span>
                ) : (
                  <span className="flex gap-2 items-center">
                    <CheckCircle /> Accept
                  </span>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
