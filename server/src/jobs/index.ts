import cron from 'node-cron';
import { prisma } from '../config/db.js';
import { pushToGuards } from '../sockets/index.js';

export function initCronJobs() {
  console.log('⏰ Initializing node-cron background scheduler...');

  // Module 2 Stub: Overstay Alert Check (Runs every 2 minutes)
  // Checks active passes where valid_to < now() and exit_time is not logged
  cron.schedule('*/2 * * * *', async () => {
    try {
      const now = new Date();
      const overstayPasses = await prisma.visitorPass.findMany({
        where: {
          status: 'active',
          valid_to: { lt: now },
        },
      });

      if (overstayPasses.length > 0) {
        // Mark as expired or push overstay alert via Socket.io
        pushToGuards('overstay:alert', {
          count: overstayPasses.length,
          timestamp: new Date().toISOString(),
          passes: overstayPasses,
        });
      }
    } catch (err) {
      console.error('[Cron Error] Overstay check failed:', err);
    }
  });

  // Module 4 Stub: Monthly Invoicing Check (Runs on 1st of every month at midnight 00:00)
  cron.schedule('0 0 1 * *', async () => {
    console.log('[Cron] Running automated monthly invoice generation...');
    // Invoicing logic will be activated in Module 4
  });
}
