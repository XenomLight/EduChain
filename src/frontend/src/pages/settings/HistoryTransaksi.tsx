import SettingsLayout from "@/components/SettingsLayout";

export default function HistoryTransaksi() {
  const transactions = [
    {
      id: 1,
      date: "2025-08-15",
      description: "Course Payment - Web Development",
      amount: "- 50$ USD",
      status: "Success",
    },
    {
      id: 2,
      date: "2025-08-12",
      description: "Reward Claim - UI/UX Design",
      amount: "+ 20$ USD",
      status: "Pending",
    },
  ];

  return (
    <div className="w-full">
    <SettingsLayout >
      <main className="rounded-2xl border border-gray-800 p-5  container mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold mb-6">Transaction History</h1>

        <div className="overflow-x-auto rounded-2xl border border-gray-800 shadow-md">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-black/70">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-t border-gray-800 hover:bg-white/5 transition"
                >
                  <td className="px-6 py-4">{tx.date}</td>
                  <td className="px-6 py-4">{tx.description}</td>
                  <td
                    className={`px-6 py-4 font-medium ${
                      tx.amount.startsWith("-")
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {tx.amount}
                  </td>
                  <td
                    className={`px-6 py-4 ${
                      tx.status === "Success"
                        ? "text-green-400"
                        : tx.status === "Pending"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {tx.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </SettingsLayout>
    </div>
  );
}