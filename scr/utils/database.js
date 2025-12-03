const DB_KEY = 'translation_app_db';

// Khởi tạo database mẫu nếu chưa có
const initialData = {
  exercises: [
    {
      id: 1,
      level: "A1-A2",
      category: "Chào hỏi",
      vietnamese: "Xin chào, tôi tên là Nam.",
      correctTranslation: "Hello, my name is Nam.",
      alternatives: ["Hi, my name is Nam."],
      hints: ["Xin chào = Hello/Hi", "tôi tên là = my name is"],
      createdAt: new Date().toISOString(),
      isActive: true,
      order: 1
    },
    {
      id: 2,
      level: "A1-A2",
      category: "Gia đình",
      vietnamese: "Gia đình tôi có bốn người.",
      correctTranslation: "My family has four people.",
      alternatives: ["There are four people in my family."],
      hints: ["có = has/there are"],
      createdAt: new Date().toISOString(),
      isActive: true,
      order: 2
    },
    {
      id: 3,
      level: "B1",
      category: "Công việc",
      vietnamese: "Tôi đã làm việc ở đây được ba năm.",
      correctTranslation: "I have worked here for three years.",
      alternatives: ["I've been working here for three years."],
      hints: ["đã... được = present perfect tense"],
      createdAt: new Date().toISOString(),
      isActive: true,
      order: 1
    }
  ],
  categories: ["Chào hỏi", "Gia đình", "Sở thích", "Công việc", "Du lịch", "Ẩm thực"],
  settings: {
    adminPassword: "admin123", // Đổi sau khi deploy
    maxExercises: 100
  }
};

// Lấy toàn bộ database
export function getDatabase() {
  if (typeof window === 'undefined') return initialData;
  
  const db = localStorage.getItem(DB_KEY);
  if (!db) {
    localStorage.setItem(DB_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(db);
}

// Lưu database
export function saveDatabase(data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DB_KEY, JSON.stringify(data));
}

// CRUD Operations
export function getExercises() {
  const db = getDatabase();
  return db.exercises.filter(ex => ex.isActive).sort((a, b) => a.order - b.order);
}

export function getExerciseById(id) {
  const db = getDatabase();
  return db.exercises.find(ex => ex.id === id);
}

export function addExercise(exercise) {
  const db = getDatabase();
  const newId = Math.max(...db.exercises.map(e => e.id), 0) + 1;
  
  const newExercise = {
    id: newId,
    ...exercise,
    createdAt: new Date().toISOString(),
    isActive: true
  };
  
  db.exercises.push(newExercise);
  saveDatabase(db);
  return newExercise;
}

export function updateExercise(id, updates) {
  const db = getDatabase();
  const index = db.exercises.findIndex(ex => ex.id === id);
  
  if (index === -1) return null;
  
  db.exercises[index] = {
    ...db.exercises[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  saveDatabase(db);
  return db.exercises[index];
}

export function deleteExercise(id) {
  const db = getDatabase();
  const index = db.exercises.findIndex(ex => ex.id === id);
  
  if (index === -1) return false;
  
  // Soft delete
  db.exercises[index].isActive = false;
  saveDatabase(db);
  return true;
}

export function getCategories() {
  const db = getDatabase();
  return db.categories;
}

export function addCategory(category) {
  const db = getDatabase();
  if (!db.categories.includes(category)) {
    db.categories.push(category);
    saveDatabase(db);
  }
  return db.categories;
}

export function verifyAdminPassword(password) {
  const db = getDatabase();
  return db.settings.adminPassword === password;
}

export function updateSettings(settings) {
  const db = getDatabase();
  db.settings = { ...db.settings, ...settings };
  saveDatabase(db);
  return db.settings;
}
// Thêm vào cuối file
export function getStatistics() {
  const db = getDatabase();
  const progress = JSON.parse(localStorage.getItem('translationProgress') || '{}');
  
  const totalExercises = db.exercises.filter(ex => ex.isActive).length;
  const totalUsers = Object.keys(progress).length;
  
  let totalAttempts = 0;
  Object.values(progress).forEach(userData => {
    Object.values(userData).forEach(ex => {
      totalAttempts += ex.attempts || 0;
    });
  });
  
  return {
    totalExercises,
    totalUsers,
    totalAttempts,
    levelCounts: {
      'A1-A2': db.exercises.filter(ex => ex.level === 'A1-A2' && ex.isActive).length,
      'B1': db.exercises.filter(ex => ex.level === 'B1' && ex.isActive).length,
    }
  };
}