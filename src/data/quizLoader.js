export function loadQuizzes() {
  // Uses webpack's require.context to load all .json files from the quizzes directory
  const context = require.context('./quizzes', true, /\.json$/);

  return context.keys().map((key) => {
    const data = context(key);
    const parts = key.split('/');
    const course = parts.length > 2 ? parts[1] : 'General';
    return {
      id: key.replace('./', '').replace('.json', ''),
      course,
      ...data,
    };
  });
}