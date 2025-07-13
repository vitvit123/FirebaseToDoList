import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const querySnapshot = await getDocs(collection(db, 'todos'));
      const todos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.status(200).json(todos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch todos' });
    }
  } else if (req.method === 'POST') {
    try {
      const { todo, isCompleted } = req.body;
      if (!todo || todo.trim() === '') {
        return res.status(400).json({ error: 'Todo text required' });
      }
      const newTodo = {
        todo: todo.trim(),
        isCompleted: !!isCompleted,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, 'todos'), newTodo);
      res.status(200).json({ message: 'success' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create todo' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
