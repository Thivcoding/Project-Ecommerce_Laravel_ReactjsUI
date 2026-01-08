import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTags,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaAlignLeft,
} from "react-icons/fa";
import {
  getCategories,
  deleteCategory,
} from "../../../services/categoryService";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      setCategories(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    await deleteCategory(id);
    fetchCategories();
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6">
      <div className="max-w-7xl mx-auto">

        {/* ===== HEADER ===== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-3 rounded-xl">
              <FaTags />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Categories
              </h1>
              <p className="text-sm text-slate-500">
                Product categories management
              </p>
            </div>
          </div>

          <Link
            to="create"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition"
          >
            <FaPlus /> Add Category
          </Link>
        </div>

        {/* ===== STATS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Stat
            label="Total Categories"
            value={categories.length}
            icon={<FaTags />}
            color="indigo"
          />
          <Stat
            label="Descriptions"
            value={categories.filter(c => c.description).length}
            icon={<FaAlignLeft />}
            color="emerald"
          />
        </div>

        {/* ===== SEARCH ===== */}
        <div className="mb-6 relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search category..."
            className="w-full bg-white border border-slate-200 rounded-lg pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* ===== TABLE ===== */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {loading ? (
            <div className="py-20 flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 text-sm">Loading products...</p>
                </div>
                </div>
          ) : filteredCategories.length === 0 ? (
            <div className="py-20 flex items-center justify-center bg-slate-50">
                <div className="text-center">
                  <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-500 text-sm"> No products found</p>
                </div>
              </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="px-6 py-3 text-lg text-left">ID</th>
                    <th className="px-6 py-3 text-lg text-left">Name</th>
                    <th className="px-6 py-3 text-lg text-left">
                      Description
                    </th>
                    <th className="px-6 py-3 text-lg text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((c) => (
                    <tr
                      key={c.id}
                      className="border-t hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 text-lg font-semibold text-blue-500">
                        #{c.id}
                      </td>

                      <td className="px-6 py-4 text-lg font-semibold">
                        {c.name}
                      </td>

                      <td className="px-6 py-4 text-slate-600 line-clamp-2 max-w-[400px]">
                        {c.description || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`edit/${c.id}`}
                            className="p-2 rounded-lg text-yellow-500 text-lg"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="p-2 rounded-lg text-rose-600 text-lg"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ===== FOOTER ===== */}
        <div className="mt-4 text-lg text-slate-500">
          Showing {filteredCategories.length} of {categories.length}
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, icon, color }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 flex justify-between items-center">
    <div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-slate-900">
        {value}
      </h3>
    </div>
    <div className={`bg-${color}-100 text-${color}-600 p-3 rounded-lg`}>
      {icon}
    </div>
  </div>
);

export default Categories;
