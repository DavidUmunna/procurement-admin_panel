

function CategorySelect({ user, categories, formdata, handleInputChange }) {
  // Filter categories based on user role
  let filteredCategories = [];

  switch (user.role) {
    case "HSE_officer":
      filteredCategories = categories.filter(cat => cat.name === "HSE_items");
      break;

    case "Environmental_lab_manager" || "lab_supervisor":
      filteredCategories=categories.filter(cat => cat.name === "lab_items");
      break;
      
    default:
      filteredCategories = categories; // admins see all
      break;
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Category</label>
      <select
        name="category"
        value={formdata.category}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Select Category</option>
        {filteredCategories.map(category => (
          <option key={category._id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategorySelect;
