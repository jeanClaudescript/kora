/**
 * Real-world scheduling playbooks (buffers, no-shows, walk-ins vs booked guests, overruns).
 * Grounded in common industry practice: buffers 10–15m, multi-touch reminders, clear policies,
 * waitlists, confirmation before risk slots — see e.g. SchedulingKit / Acuity / salon no-show guides.
 */

function parseSlotMinutes(label) {
  if (!label || typeof label !== 'string') return null;
  const m = label.trim().match(/(\d{1,2}):(\d{2})/);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

function buildCustomerBookingPeace(userBookings = []) {
  const pending = userBookings.filter((b) => b.status === 'pending' || b.status === 'requested');
  const confirmed = userBookings.filter((b) => b.status === 'confirmed');
  const tips = [
    {
      id: 't1',
      title: 'Running late?',
      body: 'Message the venue as soon as you can — many hold chairs 10–15 minutes before releasing to walk-ins.',
      icon: 'clock',
    },
    {
      id: 't2',
      title: 'Plans changed?',
      body: 'Reschedule in-app or WhatsApp before the cancellation window so someone else can use the slot.',
      icon: 'calendar',
    },
    {
      id: 't3',
      title: 'First time there?',
      body: 'Open the map pin early; add 5–10 minutes for parking and check-in during peak hours.',
      icon: 'map',
    },
  ];

  if (pending.length) {
    tips.unshift({
      id: 't0-pending',
      title: 'Awaiting confirmation',
      body: `You have ${pending.length} request(s) not confirmed yet — check WhatsApp or inbox so the slot does not expire.`,
      icon: 'bell',
    });
  }
  if (confirmed.length) {
    tips.unshift({
      id: 't0-confirmed',
      title: 'You are on the roster',
      body: `${confirmed.length} confirmed visit(s): aim to arrive a few minutes early; services often need setup or forms.`,
      icon: 'check',
    });
  }

  return {
    policySummary:
      'Industry norm: 24–48h notice to cancel without fee; same-day nudges 2–4h before cut “I forgot” no-shows.',
    reminderCadence: ['48h · optional reschedule', '24h · confirm or adjust', 'Same day · short heads-up'],
    tips: tips.slice(0, 6),
    noShowGraceMinutes: 15,
  };
}

function buildBusinessFloorReality(listings, bookings = []) {
  const policies = {
    bufferAfterMinutesDefault: 12,
    bufferBeforeMinutesDefault: 5,
    noShowGraceMinutes: 15,
    doubleBookGuard: 'One in-salon + one pending same clock — resolve order before taking walk-ins.',
    walkInRule:
      'If a booked guest is within 15 minutes of start, serve external/walk-in only in overflow slots or after explicit OK from the booked guest.',
    reminderPlaybook: ['T-48h reschedule window', 'T-24h confirm tap', 'T-2h short SMS / push'],
  };

  const byStatus = bookings.reduce(
    (acc, b) => {
      const s = (b.status || '').toLowerCase();
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    {},
  );

  const alerts = [];
  const pending = bookings.filter((b) => b.status === 'pending' || b.status === 'requested');
  const inSalon = bookings.filter((b) => b.status === 'in-salon');
  const confirmed = bookings.filter((b) => b.status === 'confirmed');

  if (pending.length) {
    alerts.push({
      id: 'pending-confirm',
      severity: 'high',
      title: 'Unconfirmed requests',
      detail: `${pending.length} booking(s) need a yes/no so guests are not left guessing.`,
      runbook: [
        'Reply in under 3 minutes where possible — speed converts.',
        'If you cannot honour time, propose 2 alternate slots in one message.',
      ],
    });
  }

  if (inSalon.length && confirmed.length) {
    const times = [...inSalon, ...confirmed].map((b) => parseSlotMinutes(b.slotLabel)).filter((n) => n != null);
    const minT = Math.min(...times);
    const maxT = Math.max(...times);
    if (maxT - minT < 45 && inSalon.length && confirmed.length) {
      alerts.push({
        id: 'stack-risk',
        severity: 'medium',
        title: 'Back-to-back density',
        detail: 'Slots look tight on the clock — build invisible buffers for cleanup and handoff.',
        runbook: [
          `Add ${policies.bufferAfterMinutesDefault}m after chemical / long services.`,
          'If service runs long, notify the next guest early with a new ETA.',
        ],
      });
    }
  }

  if (inSalon.length) {
    alerts.push({
      id: 'walkin-vs-booked',
      severity: 'medium',
      title: 'Walk-in vs booked guest',
      detail:
        'External clients feel great when helped early — booked guests feel respected when you protect their window.',
      runbook: [
        'Use a visible queue: walk-in gets “next free chair” time, not a silent overlap.',
        'If you squeeze a walk-in before a booking, shorten service scope or move booking with consent.',
        'Offer coffee / wait estimate — reduces perceived unfairness.',
      ],
    });
  }

  const busyVenues = listings.filter((l) => l.busyNow).length;
  if (busyVenues >= 2) {
    alerts.push({
      id: 'overrun-risk',
      severity: 'low',
      title: 'Overrun ripple risk',
      detail: 'Multiple venues show “busy” — delays propagate to the rest of the day.',
      runbook: [
        'Track actual vs planned end time for top 3 services this week.',
        'Auto-offer waitlist when a slot opens within 45 minutes.',
      ],
    });
  }

  if (!alerts.length) {
    alerts.push({
      id: 'healthy-baseline',
      severity: 'info',
      title: 'Healthy baseline',
      detail: 'No critical queue flags from current demo data — keep buffers and reminders on.',
      runbook: [
        'Keep 10–15m buffers between high-touch services.',
        'Send confirmation asks for new clients or high-value slots.',
      ],
    });
  }

  return {
    policies,
    statusCounts: byStatus,
    alerts: alerts.slice(0, 6),
    metricsTargets: {
      noShowRateTargetPct: 10,
      chairUtilisationPeakPct: 80,
      rebookBeforeLeaveTargetPct: 60,
    },
  };
}

function buildBusinessWorkforceReality(bookings = [], workerCount = 8) {
  const stages = [
    { id: 'applicants', label: 'Applicants', value: 26, targetDays: 3 },
    { id: 'screening', label: 'Screening', value: 11, targetDays: 4 },
    { id: 'trial', label: 'Trial shift', value: 5, targetDays: 7 },
    { id: 'offer', label: 'Offer', value: 2, targetDays: 3 },
  ];
  const active = bookings.filter((b) => ['confirmed', 'in-salon'].includes(String(b.status || '').toLowerCase())).length;
  const noShow = bookings.filter((b) => String(b.status || '').toLowerCase() === 'no-show').length;
  const todayLoadPct = Math.max(20, Math.min(98, Math.round((active / Math.max(workerCount, 1)) * 100)));
  const noShowRatePct = bookings.length ? Math.round((noShow / bookings.length) * 100) : 0;

  return {
    hiring: {
      playbook:
        'Use a simple 4-stage hiring pipeline (Applicants > Screening > Trial shift > Offer) with weekly stage reviews.',
      stages,
      scorecard: ['Reliability', 'Speed + quality', 'Guest communication', 'Team handoff discipline'],
    },
    staffing: {
      workerCount,
      activeBookingsNow: active,
      todayLoadPct,
      noShowRatePct,
      shiftAdvice:
        todayLoadPct >= 85
          ? 'Peak pressure: trigger on-call list and hold 1 overflow slot each hour.'
          : 'Healthy load: keep 10-12m post-service buffers and reserve one walk-in window.',
    },
  };
}

module.exports = { buildCustomerBookingPeace, buildBusinessFloorReality, buildBusinessWorkforceReality };
