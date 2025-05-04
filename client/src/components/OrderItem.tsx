import { useState } from "react";
import { OrderWithItems } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface OrderItemProps {
  order: OrderWithItems;
}

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  const [status, setStatus] = useState(order.status);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const formatOrderDate = (date: Date) => {
    const orderDate = new Date(date);
    const hours = orderDate.getHours();
    const minutes = orderDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${formattedHours}:${formattedMinutes} ${ampm} today`;
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'packing':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_for_delivery':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'packing':
        return '🛍️';
      case 'out_for_delivery':
        return '🚚';
      case 'delivered':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'packing':
        return 'Packing';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const updateOrderMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('PATCH', `/api/orders/${order.id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: 'Order Updated',
        description: `Order #${order.id} has been updated to ${formatStatus(status)}`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update order status',
        variant: 'destructive',
      });
    }
  });

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold">Order #{order.id}</h3>
        <span className={`${getStatusBadgeColor(order.status)} text-xs px-2 py-1 rounded-full`}>
          {formatStatus(order.status)} {getStatusEmoji(order.status)}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">
        Placed at: {formatOrderDate(order.createdAt)}
      </p>
      
      <div className="space-y-1 mb-3">
        {order.items.map((item, index) => (
          <p key={index}>
            - {item.quantity}x {item.product.name}
          </p>
        ))}
      </div>
      
      <p className="text-sm font-medium">Delivery to: {order.address}</p>
      <p className="text-sm font-medium">Phone: {order.phone}</p>
      
      <div className="mt-3 pt-3 border-t flex justify-between">
        <Select 
          value={status} 
          onValueChange={setStatus}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="packing">Packing</SelectItem>
            <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          className="bg-secondary text-white" 
          onClick={() => updateOrderMutation.mutate()}
          disabled={status === order.status || updateOrderMutation.isPending}
        >
          Update
        </Button>
      </div>
    </div>
  );
};

export default OrderItem;
