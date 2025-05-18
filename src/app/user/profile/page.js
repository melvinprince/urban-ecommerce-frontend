import Link from "next/link";

export default function page() {
  return (
    <div className="text-[5rem] flex flex-col gap-4">
      <Link href="profile/wishlist">Wishlist</Link>
      <Link href="profile/orders">Orders</Link>
      <Link href="profile/addresses">Addresses</Link>
    </div>
  );
}
