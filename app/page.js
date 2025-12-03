"use client";
import { useState, useEffect } from 'react';
import TranslationExercise from '@/components/TranslationExercise';
import { exercises } from '@/data/exercises';

export default function Home() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [progress, setProgress] = useState({});
  const [started, setStarted] = useState(false);

  // Load progress từ localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('translationProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
    
    // Kiểm tra xem user đã học bài nào chưa
    const lastExerciseId = localStorage.getItem('lastExerciseId');
    if (lastExerciseId) {
      const index = exercises.findIndex(e => e.id === parseInt(lastExerciseId));
      if (index !== -1) {
        setCurrentExerciseIndex(index);
        setStarted(true);
      }
    }
  }, []);

  // Lưu progress vào localStorage
  const saveProgress = (exerciseId, data) => {
    const newProgress = {
      ...progress,
      [exerciseId]: {
        ...progress[exerciseId],
        ...data,
        lastUpdated: new Date().toISOString()
      }
    };
    
    setProgress(newProgress);
    localStorage.setItem('translationProgress', JSON.stringify(newProgress));
    localStorage.setItem('lastExerciseId', exerciseId);
  };

  const nextExercise = () => {
    const nextIndex = (currentExerciseIndex + 1) % exercises.length;
    setCurrentExerciseIndex(nextIndex);
    setStarted(true);
  };

  const selectExercise = (index) => {
    setCurrentExerciseIndex(index);
    setStarted(true);
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            🎯 Luyện Dịch Tiếng Anh
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Nâng cao trình độ tiếng Anh qua bài tập dịch từ Việt sang Anh
          </p>
          
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">📚 Chọn cấp độ bắt đầu</h2>
            <div className="grid grid-cols-3 gap-4">
              {['A1', 'A2', 'B1'].map(level => {
                const count = exercises.filter(e => e.level === level).length;
                return (
                  <button
                    key={level}
                    onClick={() => {
                      const firstIndex = exercises.findIndex(e => e.level === level);
                      if (firstIndex !== -1) selectExercise(firstIndex);
                    }}
                    className="p-6 border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="text-3xl font-bold mb-2">
                      {level === 'A1' ? '👶' : level === 'A2' ? '🚀' : '💼'}
                    </div>
                    <div className="text-xl font-bold text-gray-800">Level {level}</div>
                    <div className="text-gray-600">{count} bài tập</div>
                  </button>
                );
              })}
            </div>
          </div>
          
          <button
            onClick={() => setStarted(true)}
            className="px-8 py-4 bg-blue-600 text-white text-xl rounded-lg hover:bg-blue-700 shadow-lg"
          >
            Bắt đầu học ngay →
          </button>
        </div>
      </div>
    );
  }

  const currentExercise = exercises[currentExerciseIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">🌐 Luyện Dịch Tiếng Anh</h1>
          <div className="text-sm text-gray-600">
            Bài {currentExerciseIndex + 1}/{exercises.length}
          </div>
        </div>
        
        <nav className="mt-4">
          <div className="flex flex-wrap gap-2">
            {exercises.map((ex, index) => (
              <button
                key={ex.id}
                onClick={() => selectExercise(index)}
                className={`px-3 py-1 rounded-full text-sm ${
                  index === currentExerciseIndex
                    ? 'bg-blue-600 text-white'
                    : progress[ex.id]?.completed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Bài {index + 1}
                {progress[ex.id]?.completed && ' ✓'}
              </button>
            ))}
          </div>
        </nav>
      </header>
      
      <main className="max-w-4xl mx-auto">
        <TranslationExercise
          exercise={currentExercise}
          onNext={nextExercise}
          onSaveProgress={saveProgress}
        />
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>💡 Tiến trình được tự động lưu trong trình duyệt của bạn</p>
          <p className="mt-1">🔄 F5 để tải lại trang hoặc chọn bài khác từ menu trên</p>
        </div>
      </main>
    </div>
  );
}