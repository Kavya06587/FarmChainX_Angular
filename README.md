# 🌾 FarmChainX – AI Driven Agricultural Traceability Network

## 📌 Project Overview

**FarmChainX** is a full-stack, AI-powered agricultural traceability platform designed to ensure transparency, accountability, and trust across the agricultural supply chain.  

The system digitally tracks agricultural products from crop cultivation to final consumer purchase, integrating Artificial Intelligence to provide intelligent insights for farmers and consumers.

This project was developed as part of the **Infosys Springboard Virtual Internship 6.0**.

---

## 🎯 Objective

The primary objective of FarmChainX is to:

- Enable **end-to-end traceability** of agricultural products  
- Ensure **product authenticity and accountability**
- Empower **farmers with AI-driven cultivation insights**
- Provide **verified product management for distributors**
- Allow **consumers to access complete product trace history**
- Strengthen trust within the agricultural ecosystem  

---

## 🏗️ System Architecture

FarmChainX follows a modular full-stack architecture:

- **Frontend:** Angular  
- **Backend:** Spring Boot (REST APIs)  
- **Database:** MySQL  
- **Authentication & Security:** Spring Security with BCrypt password encryption  
- **AI Integration:** Groq AI APIs  

The system is role-based and supports multiple user types including:

- Farmer  
- Distributor  
- Buyer (Consumer)  
- Admin  

---

## 🚜 Core Features

### 👨‍🌾 Farmer Module
- Crop registration and management  
- Batch creation for harvested products  
- Batch tracking and status monitoring  
- AI-powered crop guidance and insights  
- Notifications for approvals and updates  

### 🚚 Distributor Module
- Batch approval and verification  
- Order handling and logistics updates  
- Status updates (Warehouse → Transit → Delivered)  
- Order history tracking  
- Notification system  

### 🛒 Buyer (Consumer) Module
- Marketplace browsing  
- Add to cart and order placement  
- Real-time order tracking  
- Batch traceability view  
- AI assistant for crop information  
- Notifications for order updates  

### 🛠️ Admin Module
- User management  
- Crop management  
- Batch monitoring  
- System reports and analytics  
- Support ticket management  
- Role-based access control  

### 🤖 AI Integration
- Crop cultivation recommendations  
- Soil and farming guidance  
- Yield and profit insights  
- Nutritional information for crops  
- AI-powered assistance for farmers and buyers  

---

## 🔄 Traceability Workflow

1. Farmer registers crop and creates batch  
2. Distributor verifies and approves batch  
3. Product is listed in marketplace  
4. Buyer places order  
5. Order status is updated through logistics stages  
6. Buyer can trace the complete lifecycle of the product  

This ensures full transparency from **Farm to Table**.

---

## 🔐 Security Features

- Role-based access control using Spring Security  
- Password encryption using **BCrypt hashing**  
- Secure REST API communication  
- Data consistency across batch trace records  

---

## 🗂️ Database Design

- Structured relational schema using MySQL  
- Entity relationships for users, crops, batches, orders, and trace records  
- JPA-based ORM integration  

---

## 📊 Key Functional Components

- Login & Authentication System  
- Marketplace System  
- Batch Management  
- Order Processing  
- Real-Time Notifications  
- AI Assistant Interfaces  
- Admin Analytics Dashboard  
- Support Ticket System  

---

## ⚙️ Technology Stack

| Layer        | Technology Used |
|-------------|-----------------|
| Frontend    | Angular |
| Backend     | Spring Boot |
| Database    | MySQL |
| Security    | Spring Security + BCrypt |
| AI Services | Groq AI |
| API Style   | RESTful APIs |

---

## 📅 Development Timeline

| Week | Work Completed |
|------|----------------|
| Week 1 | Requirement analysis and scope definition |
| Week 2 | System architecture design |
| Week 3 | Database schema creation |
| Week 4 | Angular frontend development |
| Week 5 | Spring Boot backend implementation |
| Week 6 | AI integration |
| Week 7 | Testing and debugging |
| Week 8 | Final documentation and demo |

---

## 🚧 Challenges Addressed

- Designing secure role-based access control  
- Integrating AI services with backend APIs  
- Maintaining consistency in traceability records  
- Managing distributor-mediated approval workflows  

These were resolved using modular architecture, structured API design, and continuous testing.

---

## 📈 Project Outcome

FarmChainX successfully demonstrates how:

- AI can enhance agricultural decision-making  
- Full-stack technologies can solve real-world transparency issues  
- Digital traceability can build trust in supply chains  
- Multi-role systems can be securely implemented using Spring Security  

The platform provides a scalable foundation for transparent, AI-enabled agricultural ecosystems.

---

## 🏁 Conclusion

FarmChainX is a complete AI-driven agricultural traceability platform that integrates modern web technologies with intelligent insights to ensure transparency, trust, and accountability across the agricultural supply chain.

It represents a practical implementation of full-stack development, AI integration, and real-world system design within the agriculture domain.
