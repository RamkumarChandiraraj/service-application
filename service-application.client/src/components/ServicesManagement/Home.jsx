import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { getAllServices } from "../../api/serviceList";

function Home() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await getAllServices();
                console.log(res);
                setData(res.data)
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchServices();
    }, []);


    if (loading) return <p>Loading products...</p>;
    if (error) return <p>Error: {error}</p>;

    //useEffect(() => {
    //    axios
    //        .get("https://localhost:44351/api/Service/list")
    //        .then((res) => setData(res.data.data))
    //        .catch((err) => console.log(err));
    //}, []);

    return (
        <div className="d-flex flex-column justify-content-center align-items-center bg-light vh-100">
            <h1>Services List</h1>

            <div className="w-75 rounded bg-white border shadow p-4">
                <div className="d-flex justify-content-end">
                    <Link to="/createservicemanagement" className="btn btn-success">
                        Add +
                    </Link>
                </div>

                <table className="table table-striped mt-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                        </tr>
                    </thead>

                    <tbody>
                        { data.map((d, i) => (
                            <tr key={i}>
                                <td>{d.id}</td>
                                <td>{d.name}</td>
                                <td>{d.description}</td>
                                <td className="text-end">
                                    <button className="btn btn-sm btn-info me-2">
                                        Read
                                    </button>
                                    <button className="btn btn-sm btn-primary me-2">
                                        Edit
                                    </button>
                                    <button className="btn btn-sm btn-danger">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Home;
