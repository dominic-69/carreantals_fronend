import React, { useEffect, useState } from "react";
import SellerSidebar from "../components/SellerSidebar";
import { useParams, useNavigate } from "react-router-dom";
import { getMyAccessories, updateAccessory } from "../../services/api";

const EditAccessory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    stock: "",
    description: "",
    category: "",
  });

  const [images, setImages] = useState([null, null, null, null, null]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    fetchAccessory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAccessory = async () => {
    try {
      const res = await getMyAccessories();
      const item = res.data.find((acc) => acc.id === parseInt(id));

      if (item) {
        setForm({
          name: item.name,
          brand: item.brand,
          price: item.price,
          stock: item.stock,
          description: item.description,
          category: item.category,
        });

        setExistingImages(item.images || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, file) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    images.forEach((img) => {
      if (img) formData.append("images", img);
    });

    try {
      await updateAccessory(id, formData);
      alert("Updated ✅");
      navigate("/seller/my-accessories");
    } catch (err) {
      console.error(err);
      alert("Error ❌");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <SellerSidebar />

      <div style={{ padding: "30px", width: "100%" }}>
        <h2>Edit Accessory</h2>

        {/* 🔥 IMAGE GRID */}
        <div style={styles.grid}>
          {[0, 1, 2, 3, 4].map((i) => (
            <label key={i} style={styles.card}>
              {images[i] ? (
                <img
                  src={URL.createObjectURL(images[i])}
                  alt=""
                  style={styles.image}
                />
              ) : existingImages[i] ? (
                <img
                  src={existingImages[i].image}
                  alt=""
                  style={styles.image}
                />
              ) : (
                <span style={{ fontSize: "30px" }}>+</span>
              )}

              <input
                type="file"
                hidden
                onChange={(e) =>
                  handleImageChange(i, e.target.files[0])
                }
              />
            </label>
          ))}
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <input name="name" value={form.name} onChange={handleChange} style={styles.input} />
          <input name="brand" value={form.brand} onChange={handleChange} style={styles.input} />
          <input name="price" value={form.price} onChange={handleChange} style={styles.input} />
          <input name="stock" value={form.stock} onChange={handleChange} style={styles.input} />

          <select name="category" value={form.category} onChange={handleChange} style={styles.input}>
            <option value="">Select Category</option>
            <option value="interior">Interior</option>
            <option value="exterior">Exterior</option>
            <option value="electronics">Electronics</option>
            <option value="safety">Safety</option>
          </select>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            style={styles.input}
          />

          <button style={styles.button}>Update</button>
        </form>
      </div>
    </div>
  );
};

export default EditAccessory;

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 100px)",
    gap: "10px",
    marginBottom: "20px",
  },
  card: {
    height: "100px",
    background: "#eee",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  input: {
    display: "block",
    marginBottom: "10px",
    padding: "10px",
    width: "300px",
  },
  button: {
    padding: "10px",
    background: "#00d2ff",
    border: "none",
    cursor: "pointer",
  },
};