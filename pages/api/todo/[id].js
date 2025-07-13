import { doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const { todo, isCompleted } = req.body;
      await updateDoc(doc(db, 'todos', id), {
        todo,
        isCompleted,
        createdAt: serverTimestamp(),
      });
      res.status(200).json({ message: 'success' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update todo' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await deleteDoc(doc(db, 'todos', id));
      res.status(200).json({ message: 'success' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete todo' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
