# Masirat Inventory Management Assignment

A full-stack inventory management system with advanced product CRUD, import/export (CSV), category management, inventory history, and a modern, user-friendly UI.

---

## Tech Stack

### Backend
- **Node.js** + **Express**: REST API server
- **MongoDB** + **Mongoose**: Database and ODM
- **Multer**: File uploads (CSV import)
- **csv-parser**: CSV file parsing
- **dotenv**: Environment variable management
- **CORS**: Cross-origin resource sharing

### Frontend
- **React** (Vite): SPA framework
- **shadcn/ui**: All UI components (Dialog, Button, Input, Select, Badge, etc.)
- **TanStack Table**: Data grid for product table (manual pagination, sorting)
- **Axios**: API requests
- **Custom debounce**: For search
- **Tailwind CSS**: Styling (via shadcn/ui)

---

## Backend API Routes

All routes are prefixed with `/api/products`.

| Method | Endpoint                | Description                                      |
|--------|------------------------|--------------------------------------------------|
| GET    | `/`                    | List products (pagination, search, sort)         |
| POST   | `/`                    | Create a new product                             |
| PUT    | `/:id`                 | Update a product (tracks inventory history)      |
| DELETE | `/:id`                 | Delete a product                                 |
| GET    | `/categories`          | Get all unique product categories                |
| POST   | `/import`              | Import products from CSV (multipart/form-data)   |
| GET    | `/export`              | Export all products as CSV                       |
| GET    | `/:id/history`         | Get inventory change history for a product       |

#### Example: Product Object
```json
{
  "name": "Product Name",
  "unit": "kg",
  "category": "Fruits",
  "brand": "BrandX",
  "stock": 10,
  "status": "In_Stock",
  "image": "http://..."
}
```

---

## Frontend Component Structure

All UI is built with **shadcn/ui** components for a modern, consistent look.

- **ProductTable.jsx**: Main data grid (TanStack Table, shadcn Table, Button, Input, Badge, Select)
  - Inline edit, delete, view history, pagination, sorting
- **AddProductDialog.jsx**: Modal form for adding products (Dialog, Input, Button, Select)
  - Category input with suggestions and free typing (new categories auto-created)
- **ImportExportButtons.jsx**: Import/export CSV buttons (Button, ImportResultDialog)
- **ImportResultDialog.jsx**: Shows import summary, allows editing and re-adding duplicates (Dialog, Badge, Button, EditDuplicateDialog)
- **EditDuplicateDialog.jsx**: Modal to edit duplicate product from import and re-add (Dialog, Input, Button)
- **InventoryHistoryDrawer.jsx**: Drawer/modal showing product inventory change history (Dialog, Timeline UI)
- **SearchBar.jsx**: Debounced search and category filter (Input, Select)
- **/ui/**: All shadcn/ui primitives (button, input, dialog, select, badge, etc.)

**Component Reuse:**
- All dialogs, buttons, inputs, selects, and badges are reused from `src/components/ui/` (shadcn/ui).
- Product add/edit/import dialogs share similar form logic and UI.
- Category suggestions are reused in add/edit forms.

---

## Environment Variables

### Backend (`/backend/.env`)
Create a `.env` file in the `backend` folder with:
```
MONGO_URI=mongodb://localhost:27017/masirat_inventory
```
- `MONGO_URI`: MongoDB connection string.

### Frontend (`/frontend/.env`)
Create a `.env` file in the `frontend` folder with:
```
VITE_API_BASE_URL=http://localhost:5000/api
```
- `VITE_API_BASE_URL`: Base URL for backend API.

---

## Local Development Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)

### 1. Clone the repository
```sh
git clone https://github.com/farvath/masiratTechAssignment.git
cd masiratTechAssignment
```

### 2. Setup Backend

```sh
cd backend
cp .env.example .env   # or create .env as shown above
npm install
npm run dev            # starts server with nodemon on port 5000
```

### 3. Setup Frontend

```sh
cd ../frontend
cp .env.example .env   # or create .env as shown above
npm install
npm run dev            # starts Vite dev server on port 5173
```

### 4. Open in Browser

Visit: [http://localhost:5173](http://localhost:5173)

---

## Usage Notes

- **Import CSV**: Use the "Import CSV" button. Duplicates are shown in a dialog, where you can edit and re-add them directly.
- **Export CSV**: Use the "Export CSV" button to download all products.
- **Add/Edit Product**: All forms use shadcn/ui Dialogs and Inputs. Category field supports both suggestions and new entries.
- **Inventory History**: Click "History" on any product to view its stock change timeline.
- **Search/Filter**: Use the search bar and category filter for quick lookup.

---

## Project Structure

```
masiratTechAssignment/
  backend/
    controllers/
    models/
    routes/
    middleware/
    config/
    uploads/
    .env
    server.js
    package.json
  frontend/
    src/
      components/
        ui/
      api/
      assets/
      lib/
      pages/
      App.jsx
      main.jsx
    .env
    package.json
    vite.config.js
```

---

## License

This project is for educational/assignment purposes.

---
