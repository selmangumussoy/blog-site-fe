<template>
  <nav class="navbar">
    <div class="navbar-content">
      <!-- Sol: Logo -->
      <div class="logo">
        <img src="/logo.svg" alt="Logo" class="logo-icon" />
      </div>

      <!-- Ortada: Arama Çubuğu -->
      <div class="search-bar">
        <input type="text" placeholder="Search" class="search-input" />
      </div>

      <!-- Sağ: Write ve Profil -->
      <div class="navbar-actions">
        <button class="write-btn">Write</button>
        <div class="profile-icon">
          <img src="/logo.svg" alt="Profile" />
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {};
</script>

<style scoped>
/* Navbar */
.navbar {
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
}

/* Logo */
.logo-icon {
  height: 40px;
}

/* Arama Çubuğu */
.search-bar {
  flex: 1;
  margin: 0 20px;
  max-width: 300px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

/* Write ve Profil */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.write-btn {
  padding: 8px 12px;
  background-color: #0073e6;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.write-btn:hover {
  background-color: #005bb5;
}

.profile-icon img {
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
