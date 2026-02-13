"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import api from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

const AddressCard = ({ title, address }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-1 text-sm">
      <p>{address.street || "-"}</p>
      <p>
        {address.city || "-"}, {address.state || "-"} {address.zip || ""}
      </p>
      <p>{address.country || "-"}</p>
    </CardContent>
  </Card>
);

export default function OrderDetails() {
  const router = useRouter();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        toast.error("Failed to load order");
        router.push("/admin/orders/list");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id, router]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      setOrder((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="flex justify-center py-8"><LoadingSpinner size="lg" /></div>;
  if (!order) return <div className="text-center py-8">Order not found</div>;

  const billingAddress = {
    street: order.customer.billingStreet,
    city: order.customer.billingCity,
    state: order.customer.billingState,
    zip: order.customer.billingZip,
    country: order.customer.billingCountry,
  };

  const shippingAddress = {
    street: order.customer.commercialStreet,
    city: order.customer.commercialCity,
    state: order.customer.commercialState,
    zip: order.customer.commercialZip,
    country: order.customer.commercialCountry,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order #{order.id}</h2>
        <Button variant="outline" onClick={() => router.back()}>
          Back to List
        </Button>
      </div>

      {/* Billing & Shipping Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddressCard title="Billing Address" address={billingAddress} />
        <AddressCard title="Shipping Address" address={shippingAddress} />
      </div>

      {/* Customer Info & Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Name:</strong> {order.customer.fullName}</p>
            <p><strong>Email:</strong> {order.customer.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
            <p>
              <strong>Status:</strong>
              <Select value={order.status} onValueChange={handleStatusChange} disabled={updating}>
                <SelectTrigger className="w-[180px] ml-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </p>
            <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Brand / Model</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price at Order</TableHead>
                <TableHead>Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product.name}</TableCell>
                  <TableCell>
                    {item.product.brand?.name || "-"} / {item.product.model?.name || "-"}
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.priceAtOrder}</TableCell>
                  <TableCell>${(item.quantity * item.priceAtOrder).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}