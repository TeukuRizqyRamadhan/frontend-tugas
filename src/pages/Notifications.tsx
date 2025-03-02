const notifications = [
    { id: 1, message: "Tugas baru: Makalah Teknologi", time: "2 jam yang lalu" },
    { id: 2, message: "Tugas baru: Video Presentasi", time: "1 hari yang lalu" },
];

export default function Notifications() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">Notifikasi</h1>
            <ul className="mt-4">
                {notifications.map((notif) => (
                    <li key={notif.id} className="p-4 border rounded-lg mb-2 bg-white">
                        <p>{notif.message}</p>
                        <span className="text-gray-500 text-sm">{notif.time}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
