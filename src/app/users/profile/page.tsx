import Link from "next/link";

export default function ProfilePage() {
    return (
        <div>
            <div>
                <Link href="/users/profile/orders">Orders</Link>
            </div>
            <div>
                <Link href="/users/profile/addresses">Addresses</Link>
            </div>
        </div>
    )
}