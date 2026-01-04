import { Router } from 'express';
import { propertyController } from '../controllers/property.controller';

const router = Router();

router.post('/', propertyController.createProperty);
router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);
router.patch('/:id', propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);

export default router;