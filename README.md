
# 👕 WYD – WearYourDesign

**WYD (WearYourDesign)** is a full-fledged e-commerce clothing platform that allows users to **design their own custom T-shirts**, visualize them in real-time, and purchase them securely. It also features a modern **admin panel** to manage users, products, and orders.

This project was built using the **MERN stack** and demonstrates a complete end-to-end product lifecycle from frontend interaction to backend processing and payment handling.

---

## 🛠️ Tech Stack

| Layer       | Technologies                               |
|-------------|---------------------------------------------|
| Frontend    | React.js + Vite, Tailwind CSS, html2canvas |
| Backend     | Node.js, Express.js                        |
| Database    | MongoDB                                    |
| Payments    | Stripe API                                 |
| Tools & APIs| Postman, Cloudinary                        |

---

## 🚀 Features

- 🎨 **T-shirt Design Tool** – Users can customize apparel and preview using canvas + html2canvas
- 💳 **Secure Payments** – Stripe integration for safe and smooth checkout
- 🧾 **Product Management** – Admin panel with full CRUD functionality
- 📦 **Order Tracking** – View and manage orders as an admin
- 👤 **User Authentication** – Register/login functionality (future scope)

---

## 📷 Screenshots

> *(Add these screenshots in your `/public/screenshots/` folder and link them here)*

- Home Page  
- Customizer (Canvas Preview)  
- Checkout Page  
- Admin Dashboard  

---

## ⚙️ Getting Started

### 📁 Clone the Repository

```bash
git clone https://github.com/JadhaoR181/WYD-WearYourDesignMain.git
cd WYD-WearYourDesignMain
```

---

### 🔌 Backend Setup (Express API)

```bash
cd server
npm install
npm run server
```

- Create a `.env` file in `/server/`:

```env
MONGO_URI=your_mongo_connection_string
STRIPE_SECRET_KEY=your_stripe_key
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

---

### 💻 Frontend Setup (React + Vite)

```bash
cd client
npm install
npm run dev
```

- Create a `.env` file in `/client/`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## 🌐 Live Demo

🚀 **Deployed Link (if available):** [Coming Soon](#)

---

## 📁 Folder Structure

```
WYD-WearYourDesignMain/
├── client/     # Frontend - React + Vite
│   ├── src/
│   └── ...
├── server/     # Backend - Express
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── ...
```

---

## ✅ To-Do / Future Improvements

- [ ] Add login/authentication for users
- [ ] Add user order history
- [ ] Image optimization & lazy loading
- [ ] Responsive improvements for mobile view

---

## 🧑‍💻 Author

**Ravindra Jadhav**  
Final Year B.E. IT Student | MERN Stack & Android Developer  
📫 [GitHub Profile](https://github.com/JadhaoR181)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Contributions

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## ⭐️ Show Your Support

If you like this project, please consider **starring** 🌟 the repository. It motivates me to continue improving it!
