import Link from "next/link";

export default function page() {
  return (
    <div className="text-[5rem]">
      <Link href="profile/wishlist" className="pr-[5rem]">
        Wishlist
      </Link>
      <Link href="profile/orders">Orders</Link>
    </div>
  );
}
