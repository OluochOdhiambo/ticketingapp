import { useEffect, useState } from 'react';
import { Users, AlertCircle } from 'lucide-react';
import { BASE_API_URL } from '../utils/apiUrl';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 6;

function mapCustomerFromApi(customer) {
    return {
        id: customer.id,
        code: customer.code,
        firstname: customer.firstName ?? customer.firstname ?? '',
        lastname: customer.lastName ?? customer.lastname ?? '',
        email: customer.email ?? '',
        phoneNumber: customer.phoneNumber ?? '',
    };
}

async function fetchCustomers({ pageNumber = 1, pageSize = PAGE_SIZE } = {}) {
    const params = new URLSearchParams({
        PageNumber: String(pageNumber),
        PageSize: String(pageSize),
    });

    const res = await fetch(`${BASE_API_URL}/api/Customer?${params}`);
    if (!res.ok) throw new Error('Failed to load customers');

    const data = await res.json();
    console.log('GET /api/Customer response', data);

    return {
        items: (data.items ?? []).map(mapCustomerFromApi),
        totalCount: data.totalCount ?? 0,
        pageNumber: data.pageNumber ?? pageNumber,
        pageSize: data.pageSize ?? pageSize,
        error: null,
    };
}

function SkeletonRows() {
    return Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <tr key={i} className="border-b border-slate-100 last:border-0">
            {Array.from({ length: 4 }).map((__, j) => (
                <td key={j} className="px-4 py-3">
                    <div className="h-4 w-full max-w-[12rem] rounded bg-slate-200 animate-pulse-soft" />
                </td>
            ))}
        </tr>
    ));
}

export default function CustomersPage() {
    const [page, setPage] = useState(1);

    // Single state object — one setData call handles everything
    const [data, setData] = useState({
        items: [],
        totalCount: 0,
        pageNumber: 0,
        pageSize: PAGE_SIZE,
        error: null,
    });

    // Derived — no separate state needed
    const loading = data.pageNumber !== page;

    useEffect(() => {
        let active = true;

        fetchCustomers({ pageNumber: page, pageSize: PAGE_SIZE })
            .then((res) => {
                if (active) setData(res);
            })
            .catch((err) => {
                if (active) setData((prev) => ({
                    ...prev,
                    pageNumber: page,  // stops loading
                    error: err.message ?? 'Failed to load customers.',
                }));
            });

        return () => {
            active = false;
        };
    }, [page]);

    return (
        <div>
            <div className="mb-6 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                    <Users className="h-5 w-5" />
                </span>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Customers</h1>
                    <p className="text-sm text-slate-500">Registered ticket buyers.</p>
                </div>
            </div>

            {data.error && (
                <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{data.error}</span>
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                                <th className="px-4 py-3 font-medium">Code</th>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Email</th>
                                <th className="px-4 py-3 font-medium">Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <SkeletonRows />
                            ) : data.items.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                                        No customers found.
                                    </td>
                                </tr>
                            ) : (
                                data.items.map((c) => (
                                    <tr key={c.id} className="border-b border-slate-100 last:border-0">
                                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.code}</td>
                                        <td className="px-4 py-3 font-medium text-slate-900">
                                            {c.firstname} {c.lastname}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{c.email}</td>
                                        <td className="px-4 py-3 text-slate-600">{c.phoneNumber}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {!loading && data.totalCount > PAGE_SIZE && (
                <Pagination
                    pageNumber={page}
                    pageSize={data.pageSize || PAGE_SIZE}
                    totalCount={data.totalCount}
                    onChange={setPage}
                    disabled={loading}
                />
            )}
        </div>
    );
}