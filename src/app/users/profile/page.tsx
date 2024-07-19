import Link from "next/link";

export default function ProfilePage() {
    return (
        <div>
            <div>
                <Link href="/users/profile/orders">My orders</Link>
            </div>
            <div>
                <Link href="/users/profile/addresses">Manage addresses</Link>
            </div>
        </div>
    )
}