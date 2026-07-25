import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminClientsPage() {
  const supabase = createAdminClient();

  const [{ data: usersData, error: usersError }, { data: profiles }, { data: orderRows }] =
    await Promise.all([
      supabase.auth.admin.listUsers({ perPage: 200 }),
      supabase
        .from("profiles")
        .select("id, first_name, last_name, phone, role, created_at"),
      supabase.from("orders").select("user_id").not("user_id", "is", null),
    ]);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  const orderCountMap = new Map<string, number>();
  for (const row of orderRows ?? []) {
    if (!row.user_id) continue;
    orderCountMap.set(row.user_id, (orderCountMap.get(row.user_id) ?? 0) + 1);
  }

  const clients = (usersData?.users ?? [])
    .map((user) => {
      const profile = profileMap.get(user.id);
      return {
        id: user.id,
        email: user.email ?? "—",
        name: [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "—",
        phone: profile?.phone ?? "—",
        role: profile?.role ?? "customer",
        createdAt: user.created_at,
        orderCount: orderCountMap.get(user.id) ?? 0,
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
      <h1 className="font-serif text-3xl text-ink">Clients</h1>

      {usersError ? (
        <p className="mt-8 font-sans text-sm text-red-700">
          Impossible de charger les clients : {usersError.message}
        </p>
      ) : null}

      <div className="mt-8 overflow-x-auto border border-border bg-cream">
        <table className="w-full min-w-[640px] border-collapse font-sans text-sm">
          <thead>
            <tr className="border-b border-border bg-cream-2 text-left text-charcoal/60">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Téléphone</th>
              <th className="px-4 py-3">Commandes</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3">Inscrit le</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3 text-ink">{client.name}</td>
                <td className="px-4 py-3 text-charcoal/70">{client.email}</td>
                <td className="px-4 py-3 text-charcoal/70">{client.phone}</td>
                <td className="px-4 py-3">{client.orderCount}</td>
                <td className="px-4 py-3 capitalize text-charcoal/70">{client.role}</td>
                <td className="px-4 py-3 text-charcoal/70">
                  {new Date(client.createdAt).toLocaleDateString("fr-FR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {clients.length === 0 ? (
          <p className="px-4 py-8 font-sans text-sm text-charcoal/60">
            Aucun client inscrit pour l&rsquo;instant.
          </p>
        ) : null}
      </div>
    </main>
  );
}
