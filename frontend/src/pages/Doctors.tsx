import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { api } from '../context/AuthContext';
import { MEDICAL_DEPARTMENTS } from '../utils/departments';

interface DoctorListItem {
  id: number;
  department?: string;
  consultationFee?: number;
  profileImage?: string;
  user?: { firstName: string; lastName: string; email?: string };
}

export default function Doctors() {
  const [department, setDepartment] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['doctors', department],
    queryFn: async () => {
      const params = department ? { department } : {};
      const { data: res } = await api.get<{ success: boolean; data: { doctors: DoctorListItem[] } }>('/doctors', {
        params,
      });
      return res.data?.doctors ?? [];
    },
  });

  const { data: ratingsMap } = useQuery({
    queryKey: ['ratings', data?.map((d) => d.id) ?? []],
    queryFn: async () => {
      if (!data?.length) return {};
      const out: Record<number, { averageRating: number; totalRatings: number }> = {};
      await Promise.all(
        data.map(async (d) => {
          try {
            const { data: r } = await api.get<{ success: boolean; data: { summary: { averageRating: number; totalRatings: number } } }>(
              `/ratings/doctor/${d.id}`
            );
            out[d.id] = r.data?.summary ?? { averageRating: 0, totalRatings: 0 };
          } catch {
            out[d.id] = { averageRating: 0, totalRatings: 0 };
          }
        })
      );
      return out;
    },
    enabled: !!data?.length,
  });

  const doctors = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Find Doctors</h2>
        <div className="flex gap-2">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All departments</option>
            {MEDICAL_DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading doctors...</p>
      ) : doctors.length === 0 ? (
        <div className="rounded-lg bg-white p-8 shadow-sm border border-gray-200 text-center text-gray-500">
          No doctors found.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doc) => {
            const rating = ratingsMap?.[doc.id] ?? { averageRating: 0, totalRatings: 0 };
            const name = doc.user ? `${doc.user.firstName} ${doc.user.lastName}` : 'Doctor';
            return (
              <div
                key={doc.id}
                className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden flex flex-col"
              >
                <div className="p-4 flex items-start gap-4">
                  {doc.profileImage ? (
                    <img
                      src={doc.profileImage.startsWith('http') ? doc.profileImage : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${doc.profileImage}`}
                      alt={name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserCircleIcon className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
                    {doc.department && (
                      <p className="text-sm text-gray-500">{doc.department}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      {rating.totalRatings > 0 ? `★ ${rating.averageRating} (${rating.totalRatings})` : 'No ratings yet'}
                    </p>
                    {doc.consultationFee != null && (
                      <p className="text-sm font-medium text-gray-700 mt-1">Fee: ৳{doc.consultationFee}</p>
                    )}
                  </div>
                </div>
                <div className="p-4 border-t border-gray-100 mt-auto">
                  <Link
                    to={`/app/appointments?book=${doc.id}`}
                    className="block w-full text-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500"
                  >
                    Book appointment
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
