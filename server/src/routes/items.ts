import { Router } from 'express';
import {
  addItem,
  listItems,
  removeItem,
  updateItemStatus,
} from '../controllers/itemsController.js';
import { getList, updateList } from '../controllers/listController.js';

const router = Router();

router.get('/items', listItems);
router.post('/items', addItem);
router.put('/items/:id', updateItemStatus);
router.delete('/items/:id', removeItem);

router.get('/list', getList);
router.put('/list', updateList);

export default router;
