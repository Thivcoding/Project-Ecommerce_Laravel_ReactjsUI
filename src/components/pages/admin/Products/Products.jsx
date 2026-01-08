import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBoxOpen,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaDollarSign,
  FaWarehouse,
} from "react-icons/fa";
import { deleteProduct, getProduct } from "../../../services/productService";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProduct();
      setProducts(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    fetchProducts();
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStock = products.reduce((s, p) => s + Number(p.stock || 0), 0);
  const totalValue = products.reduce(
    (s, p) => s + Number(p.price || 0) * Number(p.stock || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6">
      <div className="max-w-7xl mx-auto">

        {/* ===== HEADER ===== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-3 rounded-xl">
              <FaBoxOpen />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Products</h1>
              <p className="text-sm text-slate-500">
                Inventory management
              </p>
            </div>
          </div>

          <Link
            to="create"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition"
          >
            <FaPlus /> Add Product
          </Link>
        </div>

        {/* ===== STATS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Stat
            label="Products"
            value={products.length}
            icon={<FaBoxOpen />}
            color="indigo"
          />
          <Stat
            label="Total Stock"
            value={totalStock}
            icon={<FaWarehouse />}
            color="emerald"
          />
          <Stat
            label="Inventory Value"
            value={`$${totalValue.toLocaleString()}`}
            icon={<FaDollarSign />}
            color="sky"
          />
        </div>

        {/* ===== SEARCH ===== */}
        <div className="mb-6 relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search product..."
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
       ) : filteredProducts.length === 0 ? (
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
                    <th className="px-6 py-3 text-lg text-left">Product</th>
                    <th className="px-6 py-3 text-lg text-left">Price</th>
                    <th className="px-6 py-3 text-lg text-left">Stock</th>
                    <th className="px-6 py-3 text-lg text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr
                      key={p.id}
                      className="border-t hover:bg-slate-50"
                    >

                       <td className="px-6 py-4 font-semibold">
                            <h1 className="text-lg text-blue-500">
                                #{p.id}
                            </h1>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image_url || "/no-image.png"}
                            onError={(e) =>
                              (e.currentTarget.src = "/no-image.png")
                            }
                            className="w-12 h-12 rounded-lg object-cover border"
                          />
                          <div>
                            <p className="font-medium text-base text-slate-900 line-clamp-1 max-w-[200px]">
                              {p.name}
                            </p>
                            
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-lg font-semibold">
                        ${Number(p.price).toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-lg font-semibold ${
                            p.stock > 20
                              ? "bg-emerald-100 text-emerald-700"
                              : p.stock > 10
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {p.stock}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`edit/${p.id}`}
                            className="p-2 rounded-lg text-yellow-500 text-lg transition"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-2 rounded-lg text-rose-600 tetx-lg transition"
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
        <div className="mt-4 flex justify-between text-lg text-slate-500">
          <span>
            Showing {filteredProducts.length} of {products.length}
          </span>
          <span>
            Total value:{" "}
            <b className="text-slate-900">
              ${totalValue.toLocaleString()}
            </b>
          </span>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, icon, color }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 flex justify-between items-center">
    <div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
    </div>
    <div className={`bg-${color}-100 text-${color}-600 p-3 rounded-lg`}>
      {icon}
    </div>
  </div>
);

export default Products;
