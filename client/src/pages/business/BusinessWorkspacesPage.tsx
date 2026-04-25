import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import type { BusinessAccessContextValue } from '../../layouts/BusinessPortalLayout'

type WorkerState = 'free' | 'booked' | 'external' | 'break'

type Worker = {
  id: string
  name: string
  role: string
  skills: string[]
  state: WorkerState
  nextAvailable: string
  todayBookings: number
  productivity: number
}

const categoryRoleMap: Record<string, string[]> = {
  Salon: ['Senior Stylist', 'Color Specialist', 'Front Desk'],
  Barber: ['Barber', 'Shave Specialist', 'Reception'],
  Spa: ['Massage Therapist', 'Facial Specialist', 'Concierge'],
  Nails: ['Nail Artist', 'Manicure Specialist', 'Reception'],
  MotorbikeRide: ['Rider', 'Dispatcher', 'Fleet Supervisor'],
  BicycleTransport: ['Cyclist', 'Route Coordinator', 'Dispatcher'],
  Recruitment: ['Recruiter', 'Hiring Manager', 'Screening Lead'],
  JobSearch: ['Career Advisor', 'Interview Coach', 'Recruiter'],
  Courier: ['Courier', 'Route Planner', 'Ops Controller'],
  Logistics: ['Logistics Officer', 'Dispatch Lead', 'Warehouse Coordinator'],
}

const defaultRoles = ['Operator', 'Supervisor', 'Coordinator']

function rolePool(categoryId: string) {
  return categoryRoleMap[categoryId] ?? defaultRoles
}

function buildWorkers(categoryId: string, count = 24): Worker[] {
  const roles = rolePool(categoryId)
  return Array.from({ length: count }).map((_, idx) => {
    const role = roles[idx % roles.length]
    const name = `Worker ${String(idx + 1).padStart(2, '0')}`
    const state: WorkerState =
      idx % 4 === 0 ? 'booked' : idx % 5 === 0 ? 'external' : idx % 3 === 0 ? 'break' : 'free'
    return {
      id: `${categoryId}-${idx + 1}`,
      name,
      role,
      skills: [categoryId, 'Bookings', idx % 2 === 0 ? 'Walk-ins' : 'Scheduled slots'],
      state,
      nextAvailable: `${9 + (idx % 8)}:${idx % 2 === 0 ? '00' : '30'}`,
      todayBookings: 3 + (idx % 7),
      productivity: 62 + (idx % 35),
    }
  })
}

function statusClasses(state: WorkerState) {
  if (state === 'free') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
  if (state === 'booked') return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300'
  if (state === 'external') return 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300'
  return 'bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200'
}

function statusLabel(state: WorkerState) {
  if (state === 'free') return 'Free'
  if (state === 'booked') return 'With booking'
  if (state === 'external') return 'External client'
  return 'On break'
}

export function BusinessWorkspacesPage() {
  const { user } = useAuth()
  const access = useOutletContext<BusinessAccessContextValue>()
  const initialCategory = user?.businessCategory ?? 'Salon'
  const [extraWorkers, setExtraWorkers] = useState(0)
  const workerTarget = Math.min((access?.workerCount ?? user?.businessWorkerCount ?? 24) + extraWorkers, 100)
  const categoryId = initialCategory
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null)
  const [stateFilter, setStateFilter] = useState<'all' | WorkerState>('all')
  const [hiringStage, setHiringStage] = useState<'applicants' | 'screening' | 'trial' | 'offer'>('applicants')
  const [candidateName, setCandidateName] = useState('')
  const [nextEtaMinutes, setNextEtaMinutes] = useState(15)
  const [taskNote, setTaskNote] = useState('')
  const [helperTip, setHelperTip] = useState('Mark your state after every service to keep bookings accurate.')
  const [pipelineCounts, setPipelineCounts] = useState({
    applicants: 12,
    screening: 5,
    trial: 2,
    offer: 1,
  })
  const [workersByCategory, setWorkersByCategory] = useState<Record<string, Worker[]>>(() => ({
    [initialCategory]: buildWorkers(initialCategory, workerTarget),
  }))

  const workers = workersByCategory[categoryId] ?? buildWorkers(categoryId, workerTarget)
  const scopedWorkers =
    access?.session.mode === 'worker'
      ? workers.filter((w) => w.id === access.session.workerId)
      : workers
  const visibleWorkers =
    stateFilter === 'all' ? scopedWorkers : scopedWorkers.filter((w) => w.state === stateFilter)
  const selectedWorker = visibleWorkers.find((w) => w.id === selectedWorkerId) ?? visibleWorkers[0]

  function updateWorkerState(workerId: string, nextState: WorkerState) {
    setWorkersByCategory((prev) => {
      const current = prev[categoryId] ?? buildWorkers(categoryId, workerTarget)
      return {
        ...prev,
        [categoryId]: current.map((w) =>
          w.id === workerId
            ? {
                ...w,
                state: nextState,
                nextAvailable: nextState === 'free' ? 'Now' : w.nextAvailable,
              }
            : w,
        ),
      }
    })
  }

  const counts = workers.reduce(
    (acc, worker) => {
      acc[worker.state] += 1
      return acc
    },
    { free: 0, booked: 0, external: 0, break: 0 } as Record<WorkerState, number>,
  )
  const workspaceTemplate = categoryRoleMap[categoryId]
    ? 'Specialized workflow'
    : 'General workflow'
  const loadPct = Math.round(((counts.booked + counts.external) / Math.max(workers.length, 1)) * 100)
  const overtimeRisk = loadPct >= 80 ? 'high' : loadPct >= 65 ? 'medium' : 'low'

  function addCandidate() {
    if (!candidateName.trim()) return
    setPipelineCounts((prev) => ({ ...prev, [hiringStage]: prev[hiringStage] + 1 }))
    setCandidateName('')
  }

  function applyQuickMode(nextState: WorkerState, tip: string) {
    if (!selectedWorker) return
    updateWorkerState(selectedWorker.id, nextState)
    setHelperTip(tip)
  }

  return (
    <div className="space-y-6">
      <section className="kora-card rounded-3xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              Business workspace
            </p>
            <h1 className="text-2xl font-black text-[var(--kora-text)] sm:text-3xl">
              {categoryId} Operations Hub
            </h1>
          </div>
          <div className="kora-card-muted rounded-xl px-4 py-2">
            <p className="text-[11px] font-bold uppercase text-[var(--kora-muted)]">Admin control</p>
            <p className="text-sm font-semibold text-[var(--kora-text)]">
              {access?.canManage
                ? `Manage ${workerTarget} worker workspaces`
                : `Your private worker workspace`}
            </p>
          </div>
        </div>
        <p className="mt-2 max-w-3xl text-sm text-[var(--kora-text-secondary)]">
          Category is fixed from signup so every worker follows one real-world workflow. Each worker has
          an independent panel, and business admin sees full team availability in one place.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="kora-card-muted rounded-2xl p-4">
            <p className="text-xs font-bold uppercase text-[var(--kora-muted)]">Business category</p>
            <p className="mt-1 text-2xl font-black text-[var(--kora-text)]">{categoryId}</p>
          </div>
          <div className="kora-card-muted rounded-2xl p-4">
            <p className="text-xs font-bold uppercase text-[var(--kora-muted)]">Workspace template</p>
            <p className="mt-1 text-xl font-black text-[var(--kora-text)]">{workspaceTemplate}</p>
          </div>
          <div className="kora-card-muted rounded-2xl p-4">
            <p className="text-xs font-bold uppercase text-[var(--kora-muted)]">Free now</p>
            <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">{counts.free}</p>
          </div>
          <div className="kora-card-muted rounded-2xl p-4">
            <p className="text-xs font-bold uppercase text-[var(--kora-muted)]">Booked</p>
            <p className="mt-1 text-2xl font-black text-orange-600 dark:text-orange-400">{counts.booked}</p>
          </div>
          <div className="kora-card-muted rounded-2xl p-4">
            <p className="text-xs font-bold uppercase text-[var(--kora-muted)]">External / break</p>
            <p className="mt-1 text-2xl font-black text-sky-600 dark:text-sky-400">
              {counts.external + counts.break}
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)]/65 p-4">
            <p className="text-xs font-black uppercase text-[var(--kora-muted)]">Coverage risk</p>
            <p className="mt-1 text-base font-black text-[var(--kora-text)]">
              Team load {loadPct}% · Overtime risk {overtimeRisk}
            </p>
            <p className="mt-1 text-xs text-[var(--kora-text-secondary)]">
              Keep 10-12 minute buffers after long services and reserve one floating worker for walk-ins during peak hours.
            </p>
          </div>
          {access?.canManage ? (
            <div className="rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)]/65 p-4">
              <p className="text-xs font-black uppercase text-[var(--kora-muted)]">Hiring pipeline (admin only)</p>
              <div className="mt-2 grid grid-cols-4 gap-2 text-center">
                <div className="rounded-lg bg-white/80 p-2 dark:bg-zinc-900/60">
                  <p className="text-[10px] font-bold uppercase text-[var(--kora-muted)]">Applicants</p>
                  <p className="text-sm font-black text-[var(--kora-text)]">{pipelineCounts.applicants}</p>
                </div>
                <div className="rounded-lg bg-white/80 p-2 dark:bg-zinc-900/60">
                  <p className="text-[10px] font-bold uppercase text-[var(--kora-muted)]">Screen</p>
                  <p className="text-sm font-black text-[var(--kora-text)]">{pipelineCounts.screening}</p>
                </div>
                <div className="rounded-lg bg-white/80 p-2 dark:bg-zinc-900/60">
                  <p className="text-[10px] font-bold uppercase text-[var(--kora-muted)]">Trial</p>
                  <p className="text-sm font-black text-[var(--kora-text)]">{pipelineCounts.trial}</p>
                </div>
                <div className="rounded-lg bg-white/80 p-2 dark:bg-zinc-900/60">
                  <p className="text-[10px] font-bold uppercase text-[var(--kora-muted)]">Offer</p>
                  <p className="text-sm font-black text-[var(--kora-text)]">{pipelineCounts.offer}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <select
                  value={hiringStage}
                  onChange={(e) => setHiringStage(e.target.value as typeof hiringStage)}
                  className="kora-input w-40 py-2 text-xs"
                >
                  <option value="applicants">Applicants</option>
                  <option value="screening">Screening</option>
                  <option value="trial">Trial shift</option>
                  <option value="offer">Offer</option>
                </select>
                <input
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Candidate name"
                  className="kora-input max-w-[190px] py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={addCandidate}
                  className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-500"
                >
                  Add candidate
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)]/65 p-4">
              <p className="text-xs font-black uppercase text-[var(--kora-muted)]">Worker helper</p>
              <p className="mt-1 text-sm font-bold text-[var(--kora-text)]">Hiring is admin-only</p>
              <p className="mt-1 text-xs text-[var(--kora-text-secondary)]">
                Your focus: keep state updated, share ETA changes quickly, and reduce guest wait-time surprises.
              </p>
            </div>
          )}
        </div>
        {access?.canManage ? (
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setExtraWorkers((v) => Math.min(v + 1, 100 - (access.workerCount ?? 1)))}
              className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-500"
            >
              Create sub-workspace
            </button>
            <p className="text-xs text-[var(--kora-muted)]">
              Only admin can create worker rooms and credentials.
            </p>
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="kora-card rounded-2xl p-3">
          <div className="flex items-center justify-between px-2 pb-2">
            <p className="text-sm font-bold text-[var(--kora-text)]">Workers ({visibleWorkers.length})</p>
            <div className="flex items-center gap-2">
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value as typeof stateFilter)}
                className="rounded-lg border border-[var(--kora-line)] bg-[var(--kora-elevated)] px-2 py-1 text-[11px] font-semibold text-[var(--kora-text)]"
              >
                <option value="all">All states</option>
                <option value="free">Free</option>
                <option value="booked">Booked</option>
                <option value="external">External</option>
                <option value="break">Break</option>
              </select>
            </div>
          </div>
          <div className="max-h-[640px] space-y-2 overflow-y-auto pr-1">
            {visibleWorkers.map((worker) => (
              <button
                key={worker.id}
                type="button"
                onClick={() => setSelectedWorkerId(worker.id)}
                className={`w-full rounded-xl border p-3 text-left transition ${
                  selectedWorker?.id === worker.id
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                    : 'border-[var(--kora-line)] bg-[var(--kora-elevated)] hover:border-emerald-400'
                }`}
              >
                <p className="text-sm font-bold text-[var(--kora-text)]">{worker.name}</p>
                <p className="text-xs text-[var(--kora-text-secondary)]">{worker.role}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusClasses(worker.state)}`}>
                    {statusLabel(worker.state)}
                  </span>
                  <span className="text-[10px] font-semibold text-[var(--kora-muted)]">
                    {worker.todayBookings} bookings
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <article className="kora-card rounded-2xl p-5">
          {selectedWorker ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-black text-[var(--kora-text)]">{selectedWorker.name}</p>
                  <p className="text-sm text-[var(--kora-text-secondary)]">
                    {selectedWorker.role} · {categoryId} workspace
                  </p>
                  <p className="mt-1 text-xs text-[var(--kora-muted)]">
                    Skills: {selectedWorker.skills.join(' • ')}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClasses(selectedWorker.state)}`}>
                  {statusLabel(selectedWorker.state)}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="kora-card-muted rounded-xl p-3">
                  <p className="text-xs font-bold uppercase text-[var(--kora-muted)]">Today bookings</p>
                  <p className="mt-1 text-xl font-black text-[var(--kora-text)]">{selectedWorker.todayBookings}</p>
                </div>
                <div className="kora-card-muted rounded-xl p-3">
                  <p className="text-xs font-bold uppercase text-[var(--kora-muted)]">Productivity</p>
                  <p className="mt-1 text-xl font-black text-[var(--kora-text)]">{selectedWorker.productivity}%</p>
                </div>
                <div className="kora-card-muted rounded-xl p-3">
                  <p className="text-xs font-bold uppercase text-[var(--kora-muted)]">Next available</p>
                  <p className="mt-1 text-xl font-black text-[var(--kora-text)]">{selectedWorker.nextAvailable}</p>
                </div>
              </div>
              <div className="rounded-xl border border-[var(--kora-line)] p-3">
                <p className="text-sm font-bold text-[var(--kora-text)]">Live update panel</p>
                <p className="mt-1 text-xs text-[var(--kora-text-secondary)]">
                  Update this worker status and the booking engine can instantly reflect availability.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => updateWorkerState(selectedWorker.id, 'free')}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
                  >
                    Free
                  </button>
                  <button
                    type="button"
                    onClick={() => updateWorkerState(selectedWorker.id, 'booked')}
                    className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-400"
                  >
                    Booked
                  </button>
                  <button
                    type="button"
                    onClick={() => updateWorkerState(selectedWorker.id, 'external')}
                    className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-500"
                  >
                    External
                  </button>
                  <button
                    type="button"
                    onClick={() => updateWorkerState(selectedWorker.id, 'break')}
                    className="rounded-lg border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)] px-3 py-1.5 text-xs font-bold text-[var(--kora-text)] hover:bg-[var(--kora-line)]/25"
                  >
                    Break
                  </button>
                </div>
              </div>
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 dark:border-indigo-900/40 dark:bg-indigo-950/20">
                <p className="text-sm font-bold text-[var(--kora-text)]">Availability + time helper</p>
                <p className="mt-1 text-xs text-[var(--kora-text-secondary)]">
                  Simple workflow to keep booking times reliable for guests and front desk.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      applyQuickMode('booked', 'In service: set realistic ETA now and update if you pass that time.')
                    }
                    className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-400"
                  >
                    Start service
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickMode('external', 'External job: mark return ETA so new bookings stay safe.')}
                    className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-500"
                  >
                    Go external
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickMode('free', 'Free now: accept next booking or nearest walk-in slot.')}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
                  >
                    Ready now
                  </button>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-[160px_1fr_auto]">
                  <select
                    value={nextEtaMinutes}
                    onChange={(e) => setNextEtaMinutes(Number(e.target.value))}
                    className="kora-input py-2 text-xs"
                  >
                    <option value={10}>ETA 10 min</option>
                    <option value={15}>ETA 15 min</option>
                    <option value={20}>ETA 20 min</option>
                    <option value={30}>ETA 30 min</option>
                    <option value={45}>ETA 45 min</option>
                  </select>
                  <input
                    value={taskNote}
                    onChange={(e) => setTaskNote(e.target.value)}
                    className="kora-input py-2 text-xs"
                    placeholder="Quick note: finishing braids, 2 chairs ahead..."
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setHelperTip(
                        `ETA shared: around ${nextEtaMinutes} min${taskNote.trim() ? ` · note: ${taskNote.trim()}` : ''}`,
                      )
                    }
                    className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-500"
                  >
                    Share ETA
                  </button>
                </div>
                <p className="mt-2 rounded-lg border border-indigo-200/80 bg-white/80 px-2.5 py-2 text-xs font-semibold text-indigo-800 dark:border-indigo-900/40 dark:bg-zinc-900/60 dark:text-indigo-200">
                  {helperTip}
                </p>
              </div>
              <div className="rounded-xl border border-[var(--kora-line)] bg-[var(--kora-elevated-muted)] p-3">
                <p className="text-sm font-bold text-[var(--kora-text)]">Admin conversation panel</p>
                <p className="mt-1 text-xs text-[var(--kora-text-secondary)]">
                  Send direct instructions to this worker and keep communication in the business system.
                </p>
                <div className="mt-3 flex gap-2">
                  <input className="kora-input py-2 text-sm" placeholder="Write a quick instruction..." />
                  <button
                    type="button"
                    className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-bold text-white hover:bg-brand-700"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </article>
      </section>
    </div>
  )
}
