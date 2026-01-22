import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { addJoke } from '@/serverActions/jokesActions';

export function JokeForm() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!question || !answer || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await addJoke({
        data: { question, answer }
      });


      setQuestion('');
      setAnswer('');
      router.invalidate();

    } catch (error) {
      console.error('geen grapje voor jou');
      setError('geen grapje voor jou');
    } finally {
      setIsSubmitting(false)
    }


  }
  return (
    <form onSubmit={handleSubmit} className='mb-8'>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}

      <div className='flex flex-col sm:flex-row gap-4 mb-8'>
        <input
          id='question'
          type='text'
          placeholder='zeg maar grappie'
          className='w-full p-2 border rounded focus:ring focus:ring-blue-300 flex-1'
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </div>


      <div className='flex flex-col sm:flex-row gap-4 mb-8'>
        <input
          id='answer'
          type='text'
          placeholder='zeg maar punchline'
          className='w-full p-2 border rounded focus:ring focus:ring-blue-300 flex-1 py-4'
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />
      </div>

      <button
        type='submit'
        disabled={isSubmitting}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded disabled:opacity-50 px-4"
      >
        {isSubmitting ? 'grapje aan het maken' : 'grapje maken?'}
      </button>
    </form>
  )
}
