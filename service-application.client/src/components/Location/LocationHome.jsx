import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllLocations, deleteLocation } from "../../api/locationList";

function LocationHome() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllLocations()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location?")) return;

    await deleteLocation(id);
    setData((prev) => prev.filter((x) => x.id !== id));
  };

  if (loading) return <p className="text-center mt-5">Loading Locations...</p>;

  return (
    <div
      className="d-flex flex-column align-items-center bg-light min-vh-100"
      style={{ paddingBottom: "80px" }} // 👈 prevents footer overlap
    >
      <h1 className="mt-4">Locations List</h1>

      <div className="w-75 rounded bg-white border shadow p-4 mb-4">
        <div className="d-flex justify-content-end">
          <Link to="/createlocation" className="btn btn-success">
            Add +
          </Link>
        </div>

        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Pincode</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.name}</td>
                <td>{d.pincode}</td>
                <td className="text-end">
                  <Link
                    to={`/readlocation/${d.id}`}
                    className="btn btn-info btn-sm me-2"
                  >
                    Read
                  </Link>

                  <Link
                    to={`/createlocation/${d.id}`}
                    className="btn btn-primary btn-sm me-2"
                  >
                    Edit
                  </Link>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(d.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  No Locations Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LocationHome;
