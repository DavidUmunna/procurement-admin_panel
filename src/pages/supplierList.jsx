import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [expandedSupplierId, setExpandedSupplierId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState({}); // supplierId -> [requests]

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const res = await fetch("/api/suppliers");
        const data = await res.json();
        setSuppliers(data);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSuppliers();
  }, []);

  const toggleSupplier = async (supplierId) => {
    if (expandedSupplierId === supplierId) {
      setExpandedSupplierId(null);
    } else {
      setExpandedSupplierId(supplierId);
      if (!requests[supplierId]) {
        try {
          const res = await fetch(`/api/suppliers/${supplierId}/requests`);
          const data = await res.json();
          setRequests((prev) => ({ ...prev, [supplierId]: data }));
        } catch (err) {
          console.error("Error fetching requests:", err);
        }
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Loading suppliers...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6">Suppliers & Requests</h2>

      {suppliers.length === 0 ? (
        <p>No suppliers found.</p>
      ) : (
        <div className="space-y-4">
          {suppliers.map((supplier) => (
            <div
              key={supplier._id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">{supplier.name}</h3>
                  <p className="text-gray-600 text-sm">{supplier.email}</p>
                  <p className="text-gray-600 text-sm">{supplier.phone}</p>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      supplier.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {supplier.status}
                  </span>
                </div>
                <button onClick={() => toggleSupplier(supplier._id)}>
                  {expandedSupplierId === supplier._id ? (
                    <ChevronUp className="w-6 h-6" />
                  ) : (
                    <ChevronDown className="w-6 h-6" />
                  )}
                </button>
              </div>

              {expandedSupplierId === supplier._id && (
                <div className="mt-4">
                  <h4 className="text-lg font-medium mb-2">Requests:</h4>
                  {requests[supplier._id] && requests[supplier._id].length > 0 ? (
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      {requests[supplier._id].map((req) => (
                        <li key={req._id}>
                          <span className="font-semibold">{req.item}</span> — {req.status} (Qty: {req.quantity})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No requests for this supplier.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
