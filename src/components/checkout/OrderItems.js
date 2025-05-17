"use client";
export default function OrderItems({ cartItems, buyNowProduct, subtotal }) {
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
      <div className="flex justify-between font-semibold mt-4 pt-2 border-t">
        <span>Subtotal:</span>
        <span>
          {buyNowProduct
            ? (
                (buyNowProduct.discountPrice ?? buyNowProduct.price) *
                buyNowProduct.quantity
              ).toFixed(2)
            : subtotal.toFixed(2)}{" "}
          QAR
        </span>
      </div>
    </section>
  );
}
