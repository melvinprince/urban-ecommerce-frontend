"use client";

import useCheckoutStore from "@/store/checkoutStore";

export default function OrderItems({ cartItems, buyNowProduct, subtotal }) {
  const { coupon } = useCheckoutStore();

  // Calculate base total
  const baseTotal = buyNowProduct
    ? (buyNowProduct.discountPrice ?? buyNowProduct.price) *
      buyNowProduct.quantity
    : subtotal;

  // Apply discount if any
  const discount = coupon?.discount || 0;
  const newTotal = baseTotal - discount;

  return (
    <section className="border p-4 rounded space-y-2">
      <h2 className="font-semibold mb-4">Order Summary</h2>

      {buyNowProduct ? (
        <div className="border p-2 rounded">
          <div className="font-medium">{buyNowProduct.title}</div>
          <div className="text-sm text-gray-600">
            {buyNowProduct.size && <>Size: {buyNowProduct.size} • </>}
            {buyNowProduct.color && <>Color: {buyNowProduct.color} • </>}
            Qty: {buyNowProduct.quantity}
          </div>
          <div className="font-bold text-green-700 mt-1">
            {(buyNowProduct.discountPrice ?? buyNowProduct.price).toFixed(2)}{" "}
            QAR
          </div>
        </div>
      ) : (
        cartItems.map((item) => (
          <div key={item._id} className="border p-2 rounded">
            <div className="font-medium">{item.product.title}</div>
            <div className="text-sm text-gray-600">
              {item.size && <>Size: {item.size} • </>}
              {item.color && <>Color: {item.color} • </>}
              Qty: {item.quantity}
            </div>
            <div className="font-bold text-green-700 mt-1">
              {(item.product.discountPrice ?? item.product.price).toFixed(2)}{" "}
              QAR
            </div>
          </div>
        ))
      )}

      {/* Subtotal */}
      <div className="flex justify-between font-semibold mt-4 pt-2 border-t">
        <span>Subtotal:</span>
        <span>{baseTotal.toFixed(2)} QAR</span>
      </div>

      {/* Discount, if applied */}
      {coupon && (
        <div className="flex justify-between text-green-700">
          <span>Discount ({coupon.code}):</span>
          <span>- {discount.toFixed(2)} QAR</span>
        </div>
      )}

      {/* New Total */}
      {coupon && (
        <div className="flex justify-between font-bold">
          <span>Total after discount:</span>
          <span>{newTotal.toFixed(2)} QAR</span>
        </div>
      )}
    </section>
  );
}
