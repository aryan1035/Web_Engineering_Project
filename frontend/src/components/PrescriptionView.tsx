import { useQuery } from '@tanstack/react-query';
import { api } from '../context/AuthContext';

interface PrescriptionViewProps {
  appointmentId: number;
  onClose: () => void;
}

export default function PrescriptionView({ appointmentId, onClose }: PrescriptionViewProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['prescription', appointmentId],
    queryFn: async () => {
      const { data: res } = await api.get<{ success: boolean; data: { prescription: { diagnosis?: string; medicines?: { name?: string; dosage?: string; duration?: string }[]; notes?: string } } }>(
        `/prescriptions/appointment/${appointmentId}`
      );
      return res.data?.prescription;
    },
    enabled: !!appointmentId,
  });

  const prescription = data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescription</h3>
          {isLoading && <p className="text-gray-500">Loading...</p>}
          {error && <p className="text-red-600">No prescription found for this appointment.</p>}
          {prescription && (
            <div className="space-y-4 text-sm">
              {prescription.diagnosis && (
                <div>
                  <p className="font-medium text-gray-700">Diagnosis</p>
                  <p className="text-gray-600">{prescription.diagnosis}</p>
                </div>
              )}
              {prescription.medicines && prescription.medicines.length > 0 && (
                <div>
                  <p className="font-medium text-gray-700">Medicines</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {prescription.medicines.map((m, i) => (
                      <li key={i}>
                        {m.name}
                        {m.dosage && ` — ${m.dosage}`}
                        {m.duration && ` (${m.duration})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {prescription.notes && (
                <div>
                  <p className="font-medium text-gray-700">Notes</p>
                  <p className="text-gray-600">{prescription.notes}</p>
                </div>
              )}
              {!prescription.diagnosis && !(prescription.medicines?.length) && !prescription.notes && (
                <p className="text-gray-500">No details added yet.</p>
              )}
            </div>
          )}
          <div className="mt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
