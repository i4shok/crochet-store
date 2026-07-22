import {
    Upload,
    X,
} from "lucide-react";

import "../../styles/AddProductForm.css";

// Center-crops any image file to a 1:1 (square) ratio on the client,
// so every product photo is stored consistently regardless of what
// the admin uploads. Runs the same way on desktop and mobile.
const CROP_SIZE = 800;

function cropImageToSquare(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            const side = Math.min(img.width, img.height);
            const sx = (img.width - side) / 2;
            const sy = (img.height - side) / 2;

            const canvas = document.createElement("canvas");
            canvas.width = CROP_SIZE;
            canvas.height = CROP_SIZE;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, sx, sy, side, side, 0, 0, CROP_SIZE, CROP_SIZE);

            canvas.toBlob((blob) => {
                URL.revokeObjectURL(objectUrl);

                if (!blob) {
                    reject(new Error("Could not crop image"));
                    return;
                }

                resolve(
                    new File([blob], file.name, {
                        type: "image/jpeg",
                    })
                );
            }, "image/jpeg", 0.9);
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Could not load image"));
        };

        img.src = objectUrl;
    });
}

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

    imageFiles,
    setImageFiles,

    imagePreviews,
    setImagePreviews,

    addProduct,

    isAdding,

}) {

    const handleFilesSelected = async (e) => {

        const files = Array.from(e.target.files || []);

        if (files.length === 0) return;

        const cropped = await Promise.all(
            files.map((file) => cropImageToSquare(file))
        );

        setImageFiles((prev) => [...prev, ...cropped]);

        setImagePreviews((prev) => [
            ...prev,
            ...cropped.map((file) => URL.createObjectURL(file)),
        ]);

        // allow re-selecting the same file again later
        e.target.value = "";
    };

    const removeImage = (index) => {

        setImageFiles((prev) =>
            prev.filter((_, i) => i !== index)
        );

        setImagePreviews((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    return (

        <form
            className="admin-product-form"
            onSubmit={addProduct}
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

                <label>Upload Images</label>

                <p className="upload-hint">
                    Every photo is cropped to a 1:1 square automatically.
                </p>

                {imagePreviews.length > 0 && (

                    <div className="image-preview-grid">

                        {imagePreviews.map((src, index) => (

                            <div className="image-preview-item" key={src}>

                                <img src={src} alt="" />

                                <button
                                    type="button"
                                    className="remove-image-btn"
                                    onClick={() => removeImage(index)}
                                    aria-label="Remove image"
                                >
                                    <X size={16} />
                                </button>

                                {index === 0 && (
                                    <span className="cover-badge">Cover</span>
                                )}

                            </div>

                        ))}

                    </div>

                )}

                <label className="upload-box">

                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        multiple
                        onChange={handleFilesSelected}
                    />

                    <Upload size={40} />

                    <h3>
                        {imagePreviews.length > 0
                            ? "Add more images"
                            : "Upload Images"}
                    </h3>

                    <p>PNG, JPG or WEBP · cropped to 1:1</p>

                </label>

            </div>


            <button
                type="submit"
                className="submit-btn"
                disabled={isAdding}
            >
                {isAdding ? "Adding..." : "Add Product"}
            </button>
        </form>

    );

}

export default AddProductForm;