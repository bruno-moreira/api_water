import express from 'express';
import waterController from '../controllers/waterController.js';
import asyncHandler from "../middlewares/asyncHandler.js";
import { insertLimiter } from "../middlewares/rateLimit.js";
import { validateCreateWater } from "../middlewares/validateWaterInput.js";

const router = express.Router();

/**
 * @openapi
 * /api/nivel/:
 *   get:
 *     summary: Lista os últimos registros de nível de água
 *     tags: [Water]
 *     responses:
 *       200:
 *         description: Lista de registros (limite 100)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Water'
 */
router.get('/', asyncHandler(waterController.getAllWater));

/**
 * @openapi
 * /api/nivel/last2h:
 *   get:
 *     summary: Retorna buckets de 30 minutos das últimas 2 horas (hour, wlevel)
 *     tags: [Water]
 *     responses:
 *       200:
 *         description: Lista de buckets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   hour:
 *                     type: string
 *                     format: date-time
 *                   wlevel:
 *                     type: integer
 */
router.get('/last2h', asyncHandler(waterController.getLast2h));

/**
 * @openapi
 * /api/nivel/insert:
 *   get:
 *     summary: Cria um novo registro via query string (apenas testes)
 *     tags: [Water]
 *     parameters:
 *       - in: query
 *         name: wlevel
 *         schema: { type: integer }
 *         required: true
 *       - in: query
 *         name: state
 *         schema: { type: integer }
 *         required: true
 *     responses:
 *       201:
 *         description: Criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Water'
 *       400:
 *         description: Campos obrigatórios ausentes
 */
router.get('/insert', insertLimiter, asyncHandler(waterController.createWaterQuery));

/**
 * @openapi
 * /api/nivel/{id}:
 *   get:
 *     summary: Obtém um registro pelo ID
 *     tags: [Water]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Registro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Water'
 *       404:
 *         description: Não encontrado
 */
router.get('/:id(\\d+)', asyncHandler(waterController.getWaterById));

/**
 * @openapi
 * /api/nivel/:
 *   post:
 *     summary: Cria um novo registro de nível de água
 *     tags: [Water]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWaterBody'
 *     responses:
 *       201:
 *         description: Criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Water'
 *       400:
 *         description: Campos obrigatórios ausentes
 */
router.post('/', insertLimiter, validateCreateWater, asyncHandler(waterController.createWater));

export default router;