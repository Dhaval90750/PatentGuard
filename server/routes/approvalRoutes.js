const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const bcrypt = require('bcryptjs');
const { authMiddleware, authorize } = require('../middlewares/authMiddleware');
const { auditLog } = require('../middlewares/auditMiddleware');

/**
 * @desc    Get all pending approval requests for the current user's role
 */
router.get('/pending', authMiddleware, async (req, res) => {
  try {
    const userRole = req.user.role;
    
    // In a sequential model, we'd check if the current user's role matches the current step's required role.
    // Simplified: Show requests that haven't been signed by this user yet.
    const pending = await prisma.approvalRequest.findMany({
      where: {
        status: 'PENDING',
        signatures: { none: { userId: req.user.id } }
      },
      include: { signatures: true }
    });

    res.json({ success: true, data: pending });
  } catch (err) {
    console.error('[APPROVAL-PENDING-FAIL]:', err.message);
    res.status(500).json({ success: false, error: 'Approval Database Retrieval Failure' });
  }
});

/**
 * @desc    Initiate a new GxP Stage-Gate Approval Workflow
 */
router.post('/initiate', authMiddleware, authorize(['ADMIN', 'LEGAL', 'RD']), async (req, res) => {
  try {
    const { documentId, patentId, drugId, workflowType, description, totalSteps } = req.body;

    const request = await prisma.approvalRequest.create({
      data: {
        documentId,
        patentId,
        drugId,
        workflowType,
        description,
        totalSteps: totalSteps || 3,
        status: 'PENDING'
      }
    });

    res.json({ success: true, data: request });
  } catch (err) {
    console.error('[APPROVAL-INITIATE-FAIL]:', err.message);
    res.status(500).json({ success: false, error: 'Workflow Initialization Failure' });
  }
});

/**
 * @desc    Sign an Approval Request (Electronic Signature - 21 CFR Part 11)
 * @purpose Requires password re-verification for non-repudiation.
 */
router.post('/sign', authMiddleware, async (req, res) => {
  try {
    const { requestId, password, reason } = req.body;
    const userId = req.user.id;

    // 1. Verify Request
    const request = await prisma.approvalRequest.findUnique({
      where: { id: requestId },
      include: { signatures: true }
    });

    if (!request || request.status !== 'PENDING') {
      return res.status(404).json({ success: false, error: 'Active approval request not found.' });
    }

    // 2. Electronic Signature Verification (Password Re-entry)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({ success: false, error: 'ELECTRONIC SIGNATURE FAILURE: Invalid credentials provided.' });
    }

    // 3. Prevent Double Signing
    const existingSig = request.signatures.find(s => s.userId === userId);
    if (existingSig) {
      return res.status(400).json({ success: false, error: 'User has already signed this request.' });
    }

    // 4. Record Non-Repudiable Signature
    await prisma.signature.create({
      data: {
        requestId,
        userId,
        username: user.username,
        role: user.role,
        reason: reason || 'Approval of strategic asset revision',
        ipAddress: req.ip,
        isElectronicSignature: true
      }
    });

    // 5. Advance Workflow (Simplified Status Logic)
    const updatedSignatures = await prisma.signature.findMany({ where: { requestId } });
    if (updatedSignatures.length >= request.totalSteps) {
      await prisma.approvalRequest.update({
        where: { id: requestId },
        data: { status: 'APPROVED', currentStep: request.totalSteps }
      });
    } else {
      await prisma.approvalRequest.update({
        where: { id: requestId },
        data: { currentStep: updatedSignatures.length + 1 }
      });
    }

    // 6. GxP Audit Log
    console.log(`[GxP-SIGNATURE-RECORDED]: Request ${requestId} signed by ${user.username}`);

    res.json({ success: true, message: 'Electronic Signature Recorded Successfully.' });
  } catch (err) {
    console.error('[APPROVAL-SIGN-FAIL]:', err.message);
    res.status(500).json({ success: false, error: 'Signature Processing Failure' });
  }
});

module.exports = router;
