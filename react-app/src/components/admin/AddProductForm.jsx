import {
    PlusCircle,
    Upload,
} from "lucide-react";

import "../../styles/AddProductForm.css";

function AddProductForm({

    name,
    setName,

    category,
    setCategory,

    price,
    setPrice,

    stock,
    setStock,

    description,
    setDescription,

    imagePreview,

    setImageFile,
    setImagePreview,

    addProduct,

    isAdding,

}) {

    return (

        <form
            className="admin-product-form"
            onSubmit={(e) => {
                console.log("FORM SUBMITTED");
                addProduct(e);
            }}
        >

            <div className="form-grid">

                <div className="form-group">
                    <label>Product Name</label>

                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Category</label>

                    <input
                        type="text"
                        placeholder="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Stock Quantity</label>

                    <input
                        type="number"
                        placeholder="Stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                    />
                </div>

            </div>

            <div className="second-row">

                <div className="form-group price-group">

                    <label>Price</label>

                    <input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />

                </div>

                <div className="form-group description-group">

                    <label>Description</label>

                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                </div>

            </div>

            <div className="form-group upload-group">

                <label>Upload Image</label>

                <label className="upload-box">

                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {

                            const file = e.target.files[0];

                            setImageFile(file);

                            if (file) {

                                setImagePreview(
                                    URL.createObjectURL(file)
                                );

                            }

                        }}
                    />

                    {

                        imagePreview

                            ?

                            <img
                                src={imagePreview}
                                alt=""
                                className="preview-image"
                            />

                            :

                            <>

                                <Upload size={54} />

                                <h3>Upload Image</h3>

                                <p>PNG, JPG or WEBP</p>

                            </>

                    }

                </label>

            </div>


            <button
                type="submit"
                className="submit-btn"
                disabled={isAdding}
                onClick={() => console.log("BUTTON CLICKED")}
            >
                {isAdding ? "Adding..." : "Add Product"}
            </button>
        </form>

    );

}

export default AddProductForm; 